"use client";

import React, { useRef, useState } from "react";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileUp, PlusCircle } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToWords } from "to-words";
import { useRouter } from "next/navigation";
import { handleDownloadPDF } from "./functions/PdfFunction";
import Image from "next/image";

// Import the autotable plugin

const Tablebody = dynamic(() => import("../components/Tablebody"), {
  ssr: false,
});

function Invoices() {
  let arr: any = [];
  let obj: any = {};
  const initialCustomer = {
    custname: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    gstin: "",
  };
  const initialSeller = {
    companyname: "",
    comaddress1: "",
    comaddress2: "",
    comcity: "",
    comstate: "",
    comcountry: "",
    compgstin: "",
  };
  const remainingState = {
    invoiceid: "",
    notes: "It’s been a pleasure doing business together.",
    terms: "Kindly ensure that the payment is made by the specified due date.",
    date: "",
    duedate: "",
  };
  const { current: deletedVals } = useRef<any>([]);
  const [total, setTotal] = useState<any>(0);
  const [customerd, setCustomerd] = useState("");

  const [formCustomer, setFormCustomer] = useState(initialCustomer);
  const [formSeller, setFormSeller] = useState(initialSeller);
  const [remaining, setRemaining] = useState(remainingState);
  const [modeofdownload, setModeOfDownload] = useState<string>("Download");
  console.log("Mode of Download:", modeofdownload);
  const DownloadMethods = ["View", "Print", "Download"];
  let first;
  let last;
  let quantity: any;
  const [sgst, setSgst] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  // let quan: any = quantity ? JSON.parse(quantity) : [];
  let tota = 0;
  const [image, setImage] = useState<string | null>(null);

  // function convertToBase64(file: File, callback: (base64Image: string) => void) {
  //   const reader = new FileReader();

  //   reader.onload = (e) => {
  //     const base64Image = e.target?.result as string;  // The base64 image string
  //     callback(base64Image); // Call the callback function with the base64 string
  //   };

  //   reader.onerror = (error) => {
  //     console.error("Error reading file: ", error);
  //   };

  //   // Read the file as a data URL (base64)
  //   reader.readAsDataURL(file);
  // }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Use optional chaining to safely access the file
    if (file) {
      setImage(URL.createObjectURL(file)); // Set the image URL (a string)
    }
  };
  console.log("Image", image);
  const toWords = new ToWords();
  let amountInWords = toWords.convert(Math.floor(total));

  function SubmitForm(formData: FormData) {
    for (const a of formData.entries()) {
      if (a[0] in obj || a[0] === "itemname") {
        arr.push(obj);

        obj = {};
      }
      obj[a[0]] = a[1];
    }

    arr.push(obj);

    const item: any = { total };
    arr.push(item);

    last = arr.pop();
    first = arr.shift();
    first["total"] = last["total"];

    // console.log("Last:", last);
    // console.log("First:", first);

    handleDownloadPDF(
      arr,
      formCustomer,
      formSeller,
      remaining,
      image,
      total,
      sgst,
      cgst,
      subtotal,
      modeofdownload
    );
    arr = [];
  }

  // arr,formCustomer,formSeller,remaining
  const date = new Date().toDateString();
  // let errortoSend = !t && (error.slice(1) || error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <CardTitle className="text-4xl font-extrabold text-white text-center">
            Tax Invoice
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          <form action={SubmitForm}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Invoice Details */}

              <div className="space-y-4">
                {/* File Upload */}
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 w-1/3">
                      Logo:
                    </label>

                    <h1 className="text-destructive">
                      * Use Square Files Eg: 40x40{" "}
                    </h1>
                    <h1 className="text-destructive">*Use .jpg format</h1>
                  </div>

                  <div className="flex items-center space-x-2 flex-grow">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="file-upload"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center space-x-2 cursor-pointer bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-md transition-colors"
                    >
                      <FileUp className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-800">Choose File</span>
                    </label>
                    {image && (
                      <Image
                        src={image}
                        alt="Uploaded"
                        width={20}
                        height={20}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="font-semibold text-gray-700 w-1/3">
                    Invoice ID:
                  </label>
                  <Input
                    placeholder="Enter Invoice ID"
                    className="flex-grow"
                    onChange={(e) =>
                      setRemaining({
                        ...remaining,
                        invoiceid: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="font-semibold text-gray-700 w-1/3">
                    Invoice Date:
                  </label>
                  <Input
                    type="date"
                    className="flex-grow"
                    defaultValue={date}
                    onChange={(e) =>
                      setRemaining({
                        ...remaining,
                        date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="font-semibold text-gray-700 w-1/3">
                    Due Date:
                  </label>
                  <Input
                    type="date"
                    className="flex-grow"
                    defaultValue={date}
                    onChange={(e) =>
                      setRemaining({
                        ...remaining,
                        duedate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Company Logo Placeholder */}
            </div>

            {/* Billing Details */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-4 text-gray-800">
                  Bill To:
                </h3>
                <div className="grid grid-cols-5 gap-y-4">
                  <label htmlFor="custname" className="col-span-1">
                    Name:
                  </label>
                  <Input
                    id="custname"
                    className="col-span-4"
                    onChange={(e) =>
                      setFormCustomer({
                        ...formCustomer,
                        custname: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="address1" className="col-span-1">
                    Address (Line-1):
                  </label>
                  <Input
                    id="address1"
                    className="col-span-4"
                    onChange={(e) =>
                      setFormCustomer({
                        ...formCustomer,
                        address1: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="address2" className="col-span-1">
                    Address (Line-2):
                  </label>
                  <Input
                    id="address2"
                    className="col-span-4"
                    onChange={(e) =>
                      setFormCustomer({
                        ...formCustomer,
                        address2: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="city" className="col-span-1">
                    City:
                  </label>
                  <Input
                    id="city"
                    className="col-span-4"
                    onChange={(e) =>
                      setFormCustomer({ ...formCustomer, city: e.target.value })
                    }
                  />
                  <label htmlFor="state" className="col-span-1">
                    State:
                  </label>
                  <Input
                    id="state"
                    className="col-span-4"
                    onChange={(e) =>
                      setFormCustomer({
                        ...formCustomer,
                        state: e.target.value,
                      })
                    }
                  />{" "}
                  <label htmlFor="state" className="col-span-1">
                    Country:
                  </label>
                  <Input
                    id="country"
                    className="col-span-4"
                    onChange={(e) =>
                      setFormCustomer({
                        ...formCustomer,
                        country: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="gstin" className="col-span-1">
                    GST Number:
                  </label>
                  <Input
                    id="gstin"
                    className="col-span-4"
                    onChange={(e) =>
                      setFormCustomer({
                        ...formCustomer,
                        gstin: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-4 text-gray-800">
                  Seller Details:
                </h3>
                <div className="grid grid-cols-5 gap-y-4">
                  <label htmlFor="companyname" className="col-span-1">
                    Company Name:
                  </label>
                  <Input
                    id="companyname"
                    className="col-span-4"
                    onChange={(e) =>
                      setFormSeller({
                        ...formSeller,
                        companyname: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="comaddress1" className="col-span-1">
                    Address (Line-1):
                  </label>
                  <Input
                    id="comaddress1"
                    className="col-span-4"
                    onChange={(e) =>
                      setFormSeller({
                        ...formSeller,
                        comaddress1: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="comaddress2" className="col-span-1">
                    Address (Line-1):
                  </label>
                  <Input
                    id="comaddress2"
                    className="col-span-4"
                    onChange={(e) =>
                      setFormSeller({
                        ...formSeller,
                        comaddress2: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="comcity" className="col-span-1">
                    City:
                  </label>
                  <Input
                    id="comcity"
                    className="col-span-4"
                    onChange={(e) =>
                      setFormSeller({
                        ...formSeller,
                        comcity: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="comstate" className="col-span-1">
                    State:
                  </label>
                  <Input
                    id="comstate"
                    className="col-span-4"
                    onChange={(e) =>
                      setFormSeller({
                        ...formSeller,
                        comstate: e.target.value,
                      })
                    }
                  />

                  <label htmlFor="comcountry" className="col-span-1">
                    Country:
                  </label>
                  <Input
                    id="comstate"
                    className="col-span-4"
                    onChange={(e) =>
                      setFormSeller({
                        ...formSeller,
                        comcountry: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="compgstin" className="col-span-1">
                    GST Number:
                  </label>
                  <Input
                    id="compgstin"
                    className="col-span-4"
                    onChange={(e) =>
                      setFormSeller({
                        ...formSeller,
                        compgstin: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Invoice Items Table */}
            <div className="mt-6">
              <Table>
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>HSN/SAC Code</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>SGST</TableHead>
                    <TableHead>CGST</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <Tablebody
                  setTotal={setTotal}
                  quantity={quantity}
                  maintotal={total}
                  current={deletedVals}
                  sgst={setSgst}
                  cgst={setCgst}
                  subtotal={setSubtotal}
                />
              </Table>
            </div>

            {/* Additional Details */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Download Method:<span className="text-red-500">*</span>
                </label>
                <Select
                  defaultValue={modeofdownload}
                  onValueChange={(value) => setModeOfDownload(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Download Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {DownloadMethods.map((mode) => (
                        <SelectItem key={mode} value={mode}>
                          {mode}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-4 text-gray-800">
                  Summary
                </h3>
                {/* <div className="flex justify-between">
                  <span>Total Before Tax:</span>
                  <span className="font-bold">₹{total}</span>
                </div> */}
                {/* <div className="flex justify-between mt-2">
                  <span>Total Tax:</span>
                  <span className="font-bold text-green-600">
                    ₹{total}
                  </span>
                </div> */}
                <div className="flex flex-col">
                  <div className="flex justify-between mt-2 pt-2 border-t">
                    <span className="text-lg font-bold">Sub Total:</span>
                    <span className="text-lg font-bold text-blue-600">
                      ₹{subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2 pt-2 border-t">
                    <span className="text-lg font-bold">SGST:</span>
                    <span className="text-lg font-bold text-blue-600">
                      ₹{sgst}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2 pt-2 border-t">
                    <span className="text-lg font-bold">CGST:</span>
                    <span className="text-lg font-bold text-blue-600">
                      ₹{cgst}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2 pt-2 border-t">
                    <span className="text-lg font-bold">Grand Total:</span>
                    <span className="text-lg font-bold text-blue-600">
                      ₹{total}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes and Terms */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Notes:
                </label>
                <Input
                  type="textarea"
                  placeholder="Additional notes..."
                  className="h-24"
                  value={remaining?.notes}
                  onChange={(e) =>
                    setRemaining({
                      ...remaining,
                      notes: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Terms & Conditions:
                </label>
                <Input
                  type="textarea"
                  placeholder="Terms and conditions..."
                  className="h-24"
                  defaultValue={remaining?.terms}
                  onChange={(e) =>
                    setRemaining({
                      ...remaining,
                      terms: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <Button
                type="submit"
                className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Generate Invoice
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Invoices;

"use client";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

function AddItem({
  setTotal,
  id,
  handleDelete,
  quantity,
  maintotal,
  mainsgst,
  maincgst,
  subtotal,
}: {
  setTotal: Function;
  id: number;
  handleDelete: any;
  quantity?: any;
  maintotal?: Number;
  mainsgst: any;
  maincgst: any;
  subtotal: any;
}) {
  const [query, setQuery] = useState("");
  let filteredData = [
    {
      itemname: "",
      hsn: "",
      price: "0",
      sgst: "0",
      cgst: "0",
      qty: 1,
    },
  ];

  const initialState = {
    itemname: "",
    hsn: "",
    price: filteredData[0]?.price || 0,
    sgst: "0",
    cgst: "0",
    qty: quantity?.qty || 1,
  };

  const [formValues, setFormvalues] = useState(initialState);
  const previous = useRef(0);

  // const previoussgst = useRef(0);
  // const previouscgst = useRef(0);
  let total: any;
  let totalinctax: any;
  let sgst: any;
  let cgst: any;
  sgst = Number(formValues?.sgst);
  cgst = Number(formValues?.cgst);
  // console.log("Previous sgst", previoussgst.current);
  // console.log("Previous cgst", previouscgst.current);
  // sgst = Number(formValues?.sgst) / 100;
  // cgst = Number(formValues?.cgst) / 100;
  // useEffect(() => {
  //   sgst = (total * Number(formValues?.sgst)) / 100;
  //   cgst = (total * Number(formValues?.cgst)) / 100;
  // }, [total, formValues?.sgst, formValues?.cgst, formValues?.price]);
  // console.log("sgst", sgst, "cgst", cgst);
  total = Number(formValues?.qty) * Number(formValues?.price) || 0;
  sgst = Number(formValues?.sgst);
  cgst = Number(formValues?.cgst);

  let cgstnumber = (total * Number(formValues?.cgst)) / 100;
  let sgstnumber = (total * Number(formValues?.sgst)) / 100;
  // console.log("Total", "sgst", sgst, "cgst", cgst);
  totalinctax = parseFloat((total + (total * (sgst + cgst)) / 100).toFixed(2));
  useEffect(() => {
    if (quantity) {
      setQuery(quantity?.itemid);
    }
  }, [quantity]);

  function handleQueryChange(e: any) {
    setQuery("");
    setQuery(e.target.value);
  }

  useEffect(() => {
    // console.log(
    //   "sgstnumber",
    //   sgstnumber,
    //   "cgstnumber",
    //   cgstnumber,
    //   "previous current sgst",
    //   previoussgst.current
    // );

    setTotal((p: any) => {
      console.log(
        "Previous",
        p,
        "previous current",
        previous.current,
        "total",
        totalinctax
      );
      return parseFloat(p - previous.current + totalinctax).toFixed(2);
    });

    totalinctax === 0
      ? (previous.current = 0)
      : (previous.current = totalinctax);

    // sgstnumber === 0
    //   ? (previoussgst.current = 0)
    //   : (previoussgst.current = sgstnumber);
    // cgstnumber === 0
    //   ? (previouscgst.current = 0)
    //   : (previouscgst.current = cgstnumber);
  }, [
    formValues?.qty,
    query,
    total,
    formValues?.sgst,
    formValues?.cgst,
    formValues?.price,
  ]);

  const previoussgst = useRef(0);
  const previouscgst = useRef(0);
  const prevsub = useRef(0);
  // Main effect handling SGST and CGST logic
  useEffect(() => {
    // Store the previous values first
    const prevSgst = previoussgst.current;
    const prevCgst = previouscgst.current;
    const prevSub = prevsub.current;
    // Log previous and current values
    console.log("Previous SGST:", prevSgst, "Current SGST:", sgstnumber);

    // Update SGST
    mainsgst((p: any) => {
      const updatedSGST = (p - prevSgst + sgstnumber).toFixed(2);
      return updatedSGST;
    });

    // Update CGST
    maincgst((p: any) => {
      const updatedCGST = (p - prevCgst + cgstnumber).toFixed(2);
      return updatedCGST;
    });
    subtotal((p: any) => parseFloat(p - prevSub + total).toFixed(2));

    if (total !== 0) {
      prevsub.current = total;
    } else {
      prevsub.current = 0;
    }
    // Update the previous values **after** the computations
    if (sgstnumber !== 0) {
      previoussgst.current = sgstnumber;
    } else {
      previoussgst.current = 0;
    }

    if (cgstnumber !== 0) {
      previouscgst.current = cgstnumber;
    } else {
      previouscgst.current = 0;
    }

    // Optionally, you can log if the values are zero
    // if (sgstnumber === 0) {
    //   console.log("SGST is zero");
    // } else {
    //   console.log("SGST is not zero", previoussgst.current, "SGST", sgstnumber);
    // }
  }, [total, formValues?.cgst, formValues?.sgst]); // Dependencies to trigger the effect

  // useEffect(() => {
  //   setFormvalues({
  //     ...formValues,
  //     price: filteredData[0]?.price,
  //   });
  // }, [filteredData[0]?.price]);

  return (
    <TableRow className="relative bg-white shadow-sm hover:shadow-lg transition-shadow duration-200">
      {/* Item Name */}
      <TableCell className="relative">
        <Input
          name="itemname"
          type="text"
          className="w-24 sm:w-32 text-center font-medium border-slate-300 focus:border-slate-500"
          onChange={(event) => {
            setFormvalues({
              ...formValues,
              itemname: event.target.value,
            });
          }}
        />
      </TableCell>
      <TableCell>
        <Input
          name="hsn"
          type="text"
          className="w-24 sm:w-32 text-center font-medium border-slate-300 focus:border-slate-500"
          onChange={(event) => {
            setFormvalues({
              ...formValues,
              hsn: event.target.value,
            });
          }}
        />
      </TableCell>

      {/* Price */}
      <TableCell>
        <Input
          name="price"
          type="text"
          className="w-20 sm:w-24 text-left sm:text-center text-lg border-slate-300 focus:border-slate-500"
          onChange={(event) => {
            setFormvalues({
              ...formValues,
              price: event.target.value,
            });
          }}
        />
      </TableCell>

      {/* SGST */}
      <TableCell>
        <Input
          name="sgst"
          type="number"
          min={0}
          step="any"
          className="w-20 sm:w-24 text-left sm:text-center text-base border-slate-300 focus:border-slate-500"
          onChange={(event) => {
            setFormvalues({
              ...formValues,
              sgst: event.target.value,
            });
          }}
        />
      </TableCell>

      {/* CGST */}
      <TableCell>
        <Input
          name="cgst"
          type="number"
          step="any"
          min={0}
          className="w-20 sm:w-24 text-left sm:text-center text-base border-slate-300 focus:border-slate-500"
          onChange={(event) => {
            setFormvalues({
              ...formValues,
              cgst: event.target.value,
            });
          }}
        />
      </TableCell>

      {/* Quantity */}
      <TableCell>
        <Input
          name="qty"
          type="number"
          min={0}
          defaultValue={1}
          className="w-16 sm:w-20 sm:max-w-20 text-center font-medium border-slate-300 focus:border-slate-500"
          onChange={(event) =>
            setFormvalues({
              ...formValues,
              qty: event.target.value,
            })
          }
        />
      </TableCell>

      {/* Total */}
      <TableCell className="text-left sm:text-right font-bold text-2xl">
        <Input
          name="inditotal"
          type="text"
          value={totalinctax}
          className="w-24 sm:w-32 text-left sm:text-center text-xl self-end border-slate-300 focus:border-slate-500"
          readOnly
        />
      </TableCell>

      {/* Delete Icon */}
      <TableCell>
        <Button
          type="button"
          onClick={() =>
            handleDelete(id, totalinctax, sgstnumber, cgstnumber, total)
          }
          className="text-white bg-red-500 hover:bg-red-700 p-2 rounded-full transition duration-150"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default AddItem;

import { ToWords } from "to-words";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { start } from "repl";
declare module "jspdf" {
  interface jsPDF {
    autoTable: any; // Or define a more specific type if you want
    lastAutoTable: {
      finalY: number;
    };
  }
}
export const handleDownloadPDF = (
  arr: any,
  formCustomer: any,
  formSeller: any,
  remaining: any,
  image: any,
  total: any,
  sgst: any,
  cgst: any,
  subtotal: any,
  modeofdownload: any
) => {
  const pdf = new jsPDF();
  const toWords = new ToWords();

  // Add image to the PDF (10, 10 are the x, y coordinates, 40, 40 are the width and height)

  let amountInWords = toWords.convert(parseFloat(Number(total).toFixed(2)));
  // Add Logo
  pdf.setFont("Helvetica", "italic");
  pdf.setFontSize(8);
  pdf.text("**This is a computer-generated invoice**", 100, 4, {
    align: "center",
  });
  pdf.addImage(String(image), "JPEG", 10, 10, 40, 40);
  pdf.setFontSize(21);
  // pdf.setFont("Helvetica", "normal");

  pdf.setFont("Helvetica", "bold");
  pdf.text(`Tax Invoice`, 85, 15);

  pdf.setFont("Helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Billing Address", 10, 60);
  pdf.setFont("Helvetica", "normal");
  pdf.setFontSize(12);
  pdf.text(`${formCustomer?.custname}`, 10, 70);
  pdf.text(`${formCustomer?.address1}`, 10, 76);
  pdf.text(`${formCustomer?.address2}`, 10, 82);
  pdf.text(`City:${formCustomer?.city}`, 10, 88);
  pdf.text(`State:${formCustomer?.state}`, 10, 94);
  pdf.text(`Country:${formCustomer?.country}`, 10, 100);
  pdf.text(`GSTIN:${formCustomer?.gstin}`, 10, 106);

  // Add Sold by
  pdf.setFontSize(14);
  pdf.setFont("Helvetica", "bold");
  pdf.text("Sold by", 120, 60);
  pdf.setFont("Helvetica", "normal");
  pdf.setFontSize(12);
  pdf.text(`${formSeller?.companyname}`, 120, 70);
  pdf.text(`${formSeller?.comaddress1}`, 120, 76);
  pdf.text(`${formSeller?.comaddress2}`, 120, 82);
  pdf.text(`City:${formSeller?.comcity}`, 120, 88);
  pdf.text(`State:${formSeller?.comstate}`, 120, 94);
  pdf.text(`Country:${formSeller?.comcountry}`, 120, 100);
  pdf.text(`GSTIN:${formSeller?.compgstin}`, 120, 106);

  // Add Invoice ID and Date

  pdf.text(`Invoice ID: ${remaining?.invoiceid}`, 10, 120);
  pdf.text(`Invoice Date: ${remaining?.date}`, 10, 126);
  pdf.text(`Due Date: ${remaining?.duedate}`, 10, 132);
  pdf.setFontSize(12);
  // Add Table
  const tableColumn = [
    "S.No",
    "Description",
    "HSN/SAC \nCode",
    "Price",
    "Quantity",
    "Net Amount",
    "SGST",
    "CGST",
    "Total",
  ];
  const tableRows: any = [];

  arr?.forEach((qt: any, i: number) => {
    tableRows.push([
      i + 1,

      qt.itemname,
      qt.hsn,
      qt.price,
      qt.qty,
      Number(qt?.price) * Number(qt?.qty),
      `${qt.sgst}%`,
      `${qt.cgst}%`,
      qt.inditotal,
    ]);
  });

  // Type assertion for jsPDF instance to include autoTable
  (pdf as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 140,
    theme: "grid",

    // Header styles (custom font color and font style)
    headStyles: {
      fillColor: [0, 0, 0], // Black background for header
      textColor: [255, 255, 255], // White text color
      font: "helvetica", // Font style for header
      fontSize: 10, // Font size for header
      fontStyle: "bold", // Font style for header (bold)
    },

    // Body styles (custom font color and font style)
    bodyStyles: {
      fillColor: [255, 255, 255], // White background for body
      textColor: [0, 0, 0], // Black text color for body
      font: "helvetica", // Font style for body
      fontSize: 10, // Font size for body
      fontStyle: "normal", // Font style for body (normal)
    },

    // Optional: Adding alternate row colors for better readability
    alternateRowStyles: {
      fillColor: [240, 240, 240], // Light gray background for alternate rows
    },
  });

  let a = pdf.lastAutoTable.finalY;
  const sectableRows: any = [];

  const y = a - 10;

  // Draw a box (rectangle) with a border

  // Add a header inside the box

  // Display Subtotal, Tax, and Grand Total inside the box
  pdf.setFontSize(10);
  const tableData = [
    ["Subtotal", `Rs. ${Number(subtotal).toFixed(2)}`],
    ["SGST", `Rs. ${Number(sgst).toFixed(2)}`],
    ["CGST", `Rs. ${Number(cgst).toFixed(2)}`],
    ["Grand Total", `Rs. ${Number(total).toFixed(2)}`],
  ];

  // Define the columns for the table

  const columnWidths = [30, 30];
  // Create the table with `autoTable`
  pdf.autoTable({
    // Table body
    body: tableData,
    startX: 20, // Table data
    startY: a + 10, // Starting Y position of the table (adjust as needed)
    // Set X position to 140 (horizontal position)
    theme: "striped", // Optional theme: striped rows for better readability
    headStyles: {
      fillColor: [0, 0, 0], // Black background for header
      textColor: [255, 255, 255], // White text color for header
      fontSize: 12, // Font size for header
      fontStyle: "bold", // Bold font for header
    },
    styles: {
      cellPadding: 2,
      halign: "center", // or 'right' or 'center'
    },
    bodyStyles: {
      fillColor: [255, 255, 255], // White background for body rows
      textColor: [0, 0, 0], // Black text color for body rows
      fontSize: 11, // Font size for body rows
      fontStyle: "normal", // Normal font for body rows
    },
    columnStyles: {
      0: { cellWidth: columnWidths[0] }, // First column width
      1: { cellWidth: columnWidths[1] }, // Second column width
    },
    margin: { left: 135 }, // Optional: Adjust margins for the table
  });

  pdf.setFontSize(12);

  // Define the starting Y position
  a = pdf.lastAutoTable.finalY + 10; // After last table, with some margin
  const pageHeight = pdf.internal.pageSize.height; // Get the page height
  const margin = 15; // Margin from top for text content
  const lineHeight = 7; // Line height for each line of text (adjust if needed)

  function checkAndAddPage(currentY: any, textHeight: any) {
    // If the Y position plus the text height exceeds the page height, add a new page
    if (currentY + textHeight > pageHeight - margin) {
      pdf.addPage(); // Add a new page
      return margin; // Reset Y position to the top of the new page
    }
    return currentY; // Otherwise, continue on the current page
  }

  // Amount in Words
  let textHeight = pdf.getTextDimensions(
    `Amount in Words: ${amountInWords} Rupees Only`
  ).h;
  a = checkAndAddPage(a, textHeight);
  pdf.setFont("Helvetica", "normal");
  pdf.text(`Amount in Words: ${amountInWords} Rupees Only`, 15, a);

  // Notes
  textHeight = pdf.getTextDimensions("Notes:").h;
  a = checkAndAddPage(a + lineHeight, textHeight); // Add margin after previous content
  pdf.setFont("Helvetica", "bold");
  pdf.text("Notes:", 15, a);

  textHeight = pdf.getTextDimensions(`${remaining?.notes}`).h;
  a = checkAndAddPage(a + lineHeight, textHeight);
  pdf.setFont("Helvetica", "normal");
  pdf.text(`${remaining?.notes}`, 15, a);

  // Terms and Conditions
  textHeight = pdf.getTextDimensions("Terms and Conditions:").h;
  a = checkAndAddPage(a + lineHeight, textHeight);
  pdf.setFont("Helvetica", "bold");
  pdf.text("Terms and Conditions:", 15, a);

  textHeight = pdf.getTextDimensions(`${remaining?.terms}`).h;
  a = checkAndAddPage(a + lineHeight, textHeight);
  pdf.setFont("Helvetica", "normal");
  pdf.text(`${remaining?.terms}`, 15, a);

  // textHeight = pdf.getTextDimensions("Terms and Conditions:").h;
  // a = checkAndAddPage(a + lineHeight, textHeight);
  // //Footer
  // pdf.setLineWidth(0.3);
  // pdf.line(
  //   15,
  //   pdf.internal.pageSize.height - 10,
  //   195,
  //   pdf.internal.pageSize.height - 10
  // );
  // pdf.setFont("helvetica", "italic");
  // pdf.setFontSize(8);

  if (modeofdownload === "Download") {
    pdf.save(`Invoice_No_${remaining?.invoiceid}-${crypto.randomUUID()}.pdf`);
  } else if (modeofdownload === "View") {
    // Trigger autoPrint and then open the print dialog
    pdf.output("pdfobjectnewwindow");
  } else if (modeofdownload === "Print") {
    // Trigger autoPrint and then open the print dialog
    pdf.autoPrint();
    pdf.output("pdfobjectnewwindow");
  }
};

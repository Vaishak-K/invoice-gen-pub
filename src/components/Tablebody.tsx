"use client";

import { TableBody } from "@/components/ui/table";
import React, { cache, useEffect, useRef, useState } from "react";
import AddItem from "./AddItem";
import * as _ from "lodash";
import { Button } from "@/components/ui/button";
import Head from "next/head";

function Tablebody({
  setTotal,
  quantity,
  maintotal,
  current,
  sgst,
  cgst,
  subtotal,
}: {
  setTotal: any;
  quantity?: any;
  maintotal: Number;
  current: any;
  sgst: any;
  cgst: any;
  subtotal: any;
}) {
  let { current: quan } = useRef<any>(quantity ? JSON.parse(quantity) : []);

  // quantity ? (quan = JSON.parse(quantity)) : (quan = []);

  const [val, setVal] = useState([]);
  const [add, setAdd] = useState(quan?.length || 0);
  const [mounted, setMounted] = useState(false);

  let deleteQuan: any;
  let array1: Number[];
  let abc: any;

  useEffect(() => {
    if (quan) {
      array1 = _.range(0, quan.length);
      abc = [...val, ...array1];
      console.log(abc);
      quantity ? setVal(abc) : "";
    }
  }, []);

  quan = quan ? quan : [];

  const rendered = val.map((b: any, i: number) => {
    // console.log(b, " is running");
    return (
      <AddItem
        key={b}
        id={i}
        setTotal={setTotal}
        handleDelete={handleDelete}
        mainsgst={sgst}
        maincgst={cgst}
        subtotal={subtotal}
      />
    );
  });

  function handleAdd() {
    setAdd((p: number) => p + 1);
    const abc: any = [...val, add];
    setVal(abc);
  }

  function handleDelete(
    id: number,
    total: number,
    sgstnumber: number,
    cgstnumber: number,
    subtotalval: number
  ) {
    console.log("Before ", val);
    let c: any;
    const deleteval = [...val];
    deleteval.splice(id, 1);
    rendered.splice(id, 1);
    if (quan && quan.length > 0) {
      deleteQuan = quan.splice(id, 1);
      current.push(deleteQuan);
    }
    console.log("DeleteQuan: ", current);
    console.log("Quan ", quan);
    console.log("After ", deleteval);
    setVal(deleteval);
    setTotal((p: number) => {
      c = p - total;
      return parseFloat(c).toFixed(2);
    });
    subtotal((p: number) => {
      c = p - subtotalval;
      return parseFloat(c).toFixed(2);
    });
    sgst((p: number) => {
      c = p - sgstnumber;
      return parseFloat(c).toFixed(2);
    });
    cgst((p: number) => {
      c = p - cgstnumber;
      return parseFloat(c).toFixed(2);
    });
  }

  return (
    <>
      <TableBody>{rendered}</TableBody>

      <Button type="button" onClick={handleAdd}>
        Add
      </Button>
    </>
  );
}

export default Tablebody;

// quan[i] ? (
//   <AddItem
//     key={b}
//     id={i}
//     setTotal={setTotal}
//     handleDelete={handleDelete}
//     quantity={quan[b]}
//     maintotal={maintotal}
//     mainsgst={sgst}
//     maincgst={cgst}
//   />
// ) :

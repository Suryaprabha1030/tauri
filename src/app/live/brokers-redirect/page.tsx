"use client";

import EnforceAuth from "@/components/layout/EnforceAuth";
import { AuthContext } from "@/context/authContextProvider";

import React, { useContext } from "react";

const data = {
  A: 1,
  B: 2,
  C: 1,
  D: 3,
  E: 2,
  F: 4,
  G: 3,
  H: 1,
  I: 4,
  J: 2,
};

function groupKeysByValue(obj: any) {
  const result: any = {};

  // Iterate over each key-value pair in the input object
  for (const key in obj) {
    const value = obj[key];

    // Check if the value exists in the result object
    if (result[value]) {
      // If it exists, push the current key to the array
      result[value].push(key);
    } else {
      // If it doesn't exist, initialize the array with the current key
      result[value] = [key];
    }
  }

  return result;
}

// Example usage
const groupedResult = groupKeysByValue(data);
console.log(groupedResult);

function BrokerRedirectpage() {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated && <div></div>;
}

export default EnforceAuth(BrokerRedirectpage);

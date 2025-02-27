"use client";
import { TextField } from "@radix-ui/themes";
import React from "react";


const NewIssuePage = () => {
  return (
    <div>
      <TextField.Root>
        <TextField.Input placeholder="title" />
      </TextField.Root>
    </div>
  );
};

export default NewIssuePage;

"use client";

import React, { JSX } from "react";

import Select, { SingleValue } from "react-select";
import { TokenMetaDataProps } from "@/types";
import { tokens } from "@/utils/constants";

// type OptionType = {
//   value: string;
//   label: JSX.Element;
//   symbol: string;
// };
// tokens: TokenMetaDataProps[]
interface ImageSelectProps {
  token: TokenMetaDataProps;
  setToken: React.Dispatch<React.SetStateAction<TokenMetaDataProps>>;
}

export default function ImageSelect({ token, setToken }: ImageSelectProps) {
  const options = tokens.map((token) => {
    return {
      token: token,
      label: (
        <div className="flex items-center">
          <img
            width={20}
            src={token.logo}
            alt="XRP"
            style={{ marginRight: "8px" }}
          />
          {token.symbol}
        </div>
      ),
      value: token.symbol,
    };
  });
  // Typing for th onChange handler
  // const handleChange = (selectedOption: SingleValue<OptionType>) => {
  //   console.log("Selected option:", selectedOption);
  // };

  return (
    <div className="w-[150px]">
      <Select
        className="react-select-container !bg-black"
        classNamePrefix="react-select"
        options={options}
        value={options.find((option) => option.value == token.symbol)!}
        onChange={(value) => {
          if (value) setToken(value!.token);
        }}
      />
    </div>
  );
}

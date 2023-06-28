"use client";

import Contract from "@/src/Contract";
import { SUPPORTED_MAINNETS, SUPPORTED_TESTNETS } from "@/src/chains";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { useState } from "react";

export default function Home() {
  const [activeChain, setActiveChain] = useState<
    (typeof SUPPORTED_MAINNETS)[number] | (typeof SUPPORTED_TESTNETS)[number]
  >("ethereum");
  return (
    <div className="flex flex-col w-full h-full">
      <div className="px-6 mt-20 w-full sm:w-[500px] md:w-[500px] sm:w-90vw mx-auto">
        <label className="text-left">Select network</label>
        <select
          className="mb-4 w-full border border-gray-300 p-2 rounded-md"
          onChange={(e) => setActiveChain(e.target.value)}
        >
          <option disabled>--- Mainnets ---</option>
          {SUPPORTED_MAINNETS.map((item) => (
            <option key={item} value={item}>{`${item
              .charAt(0)
              .toUpperCase()}${item.slice(1)}`}</option>
          ))}
          <option disabled>--- Testnets ---</option>
          {SUPPORTED_TESTNETS.map((item) => (
            <option key={item} value={item}>{`${item
              .charAt(0)
              .toUpperCase()}${item.slice(1)}`}</option>
          ))}
        </select>
      </div>
      <ThirdwebProvider activeChain={activeChain}>
        <Contract />
      </ThirdwebProvider>
    </div>
  );
}

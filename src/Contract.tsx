import { useContract } from "@thirdweb-dev/react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
const Nft = dynamic(() => import("./Nft"), { ssr: false });

export default function Contract() {
  const contractRef = useRef<HTMLInputElement>(null);
  const [contractAddress, setContractAddress] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {
    contract,
    isLoading: isLoadingContract,
    error: errorLoadingContract,
  } = useContract(contractAddress);

  const isLoading = contractAddress && isLoadingContract;

  const setContract = () => {
    const address = contractRef.current?.value ?? "";
    if (!address) {
      alert("1");
      setErrorMessage("Please enter contract address for the NFT collection");
      return;
    }
    setErrorMessage("");
    setContractAddress(address);
  };

  const contractLoaded = contract && !isLoading;

  return (
    <>
      <div className="px-6 w-full sm:w-[500px] md:w-[500px] sm:w-90vw mx-auto">
        <label>NFT Contract address</label>
        <input
          type="text"
          placeholder="0x..."
          ref={contractRef}
          className="border border-gray-300 p-2 rounded-md w-full"
        />
        <div className="flex">
          <button
            className={`btn-primary border border-gray-500 mt-4 py-2 px-4 rounded-lg mx-auto ${
              isLoading ? "loading loading-spinner loading-sm" : ""
            }`}
            onClick={setContract}
          >
            Submit
          </button>
        </div>
      </div>

      {contractLoaded && <Nft contract={contract} />}
    </>
  );
}

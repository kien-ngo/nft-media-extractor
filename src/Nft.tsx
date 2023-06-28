import {
  useNFTs,
  useTotalCirculatingSupply,
  useTotalCount,
} from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
import type { BaseContract } from "ethers";
import { useState } from "react";
import extractCidFromUrl from "./extractCidFromUrl";

const perPage = 100;

export default function Nft({
  contract,
}: {
  contract: SmartContract<BaseContract>;
}) {
  const {
    data: totalSupplyData,
    isLoading: isLoadingTotalSupply,
    error: errorLoadingTotalSupply,
  } = useTotalCount(contract);

  const totalSupply = totalSupplyData?.toNumber() ?? 0;
  if (totalSupply) console.log({ totalSupply });
  const totalPages = totalSupply ? Math.ceil(totalSupply / perPage) : 0;
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const startIndex = (currentPageNum - 1) * perPage;
  const endIndex = startIndex + perPage - 1;

  const {
    data: allNfts,
    isLoading: isLoadingAllNfts,
    error: errorLoadingNfts,
  } = useNFTs(contract, {
    count: perPage,
    start: startIndex,
  });
  if (allNfts) console.log({ allNfts });
  const pages = Array(totalPages)
    .fill(0)
    .map((_, index) => index + 1);

  const PaginationContainer = () => {
    if (pages.length === 1) return <></>;
    return (
      <div className="mx-auto flex flex-row justify-center max-w-[90vw] overflow-x-auto">
        {pages.map((item) => (
          <button
            key={item}
            onClick={() => setCurrentPageNum(item)}
            className={`border-gray-400 mx-1 mt-3 h-10 w-10 border duration-100 hover:border-2 hover:border-white ${
              currentPageNum === item ? "bg-white text-black" : ""
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    );
  };
  const isLoading = isLoadingAllNfts || isLoadingTotalSupply;
  const dataLoadedSuccessfully =
    !isLoading && allNfts && allNfts.length > 0 && totalSupply > 0;

  return (
    <>
      {isLoading && (
        <div className="mt-10 mx-auto loading loading-spinner"></div>
      )}
      {dataLoadedSuccessfully && (
        <>
          <div className="text-center mt-10">Collection founded!</div>
          <div className="text-center">Total supply: {totalSupply} item(s)</div>
          <div className="mx-auto text-sm mt-3">
            Tips: If all the files are under the same folder, for example: "
            <span className="text-warning">Qm...abc</span>/0", "
            <span className="text-warning">Qm...abc</span>/1", you can simply
            copy the folder path: "
            <span className="text-warning">Qm...abc</span>" if you'd like to pin
            the content for the whole collection.
          </div>
          <div className="overflow-x-auto max-w-[90vw] mt-6 mx-auto">
            <table className="table border border-gray-500 rounded max-w-[90vw]">
              {/* head */}
              <thead className="border-b">
                <tr className="bg-primary">
                  {/* <th className="px-1"></th> */}
                  <th className="px-1">Token ID</th>
                  <th className="px-1">Token URI</th>
                  <th className="px-1">Media</th>
                </tr>
              </thead>
              <tbody>
                {allNfts.map((item, index) => (
                  <tr key={item.metadata.id}>
                    {/* <th className="px-1">{startIndex + index + 1}</th> */}
                    <td className="px-1">{item.metadata.id}</td>
                    <td className="px-1">
                      {extractCidFromUrl(item.metadata.uri)}
                    </td>
                    <td className="px-1">
                      {extractCidFromUrl(item.metadata.image ?? "")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationContainer />
          <div className="mt-10"></div>
        </>
      )}
    </>
  );
}

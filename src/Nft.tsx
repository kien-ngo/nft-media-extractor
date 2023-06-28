import {
  useNFTs,
  useTotalCirculatingSupply,
  useTotalCount,
} from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
import type { BaseContract } from "ethers";
import { useState } from "react";

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
      <div className="mx-auto flex flex-row flex-wrap justify-center max-w-[90vw] overflow-x-auto">
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
          <div className="text-center">Total minted: {totalSupply} item(s)</div>
          <div className="overflow-x-auto max-w-[90vw] mt-6 mx-auto">
            <table className="table border border-gray-500 rounded-lg">
              {/* head */}
              <thead className="border-b">
                <tr>
                  <th></th>
                  <th>Token ID</th>
                  <th>Token URI</th>
                  <th>Media</th>
                </tr>
              </thead>
              <tbody>
                {allNfts.map((item, index) => (
                  <tr key={item.metadata.id}>
                    <th>{startIndex + index + 1}</th>
                    <td>{item.metadata.id}</td>
                    <td>{item.metadata.uri}</td>
                    <td>{item.metadata.image}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationContainer />
        </>
      )}
    </>
  );
}

import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { NFTCard } from "./components/nftCard";

const Home = () => {
  const [page, setPage] = useState(1);
  const [NFTs, setNFTs] = useState([]);
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [fetchCollection, setFetchCollection] = useState(false);

  const fetchNFTs = async () => {
    let nfts;
    console.log("fetching nfts");
    const api_key = "R3IbPh76To9_NAiY3KPWiupIwslDN0Tf";
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;

    if (!collection.length) {
      var requestOptions = {
        method: "GET",
      };
      const fetchURL = `${baseURL}?owner=${wallet}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    } else {
      console.log("fetching nfts for collection owned by address");

      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    }

    if (nfts) {
      console.log("nfts:", nfts);
      setNFTs(nfts.ownedNfts);
    }
  };

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      // verify pagination
      console.log(
        "this is page",
        NFTs,
        Object.entries(NFTs)
          .slice(-1)
          .slice("id")
          .map((entry) => entry[0])
          .toString(),
        [(page * 100 + 1).toString()]
      );
      var requestOptions = {
        method: "GET",
        startToken: Object.entries(NFTs)
          .slice("id")
          .map((entry) => entry[0])
          .toString(),
      };
      const api_key = "R3IbPh76To9_NAiY3KPWiupIwslDN0Tf";
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then((data) =>
        data.json()
      );
      if (nfts) {
        console.log("NFTs in collection:", nfts);
        setNFTs(nfts.nfts);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <Head>
        <title>Spy NFT</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="mystyle.css"></link>
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/@neftify/connect/dist/neftify/neftify.esm.js"
        ></script>
        <script
          nomodule
          src="https://cdn.jsdelivr.net/npm/@neftify/connect/dist/esm/neftify.js"
        ></script>
        <neftify-connect-wallet></neftify-connect-wallet>
      </Head>
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input
          disabled={fetchCollection}
          className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
          onChange={(e) => {
            setWalletAddress(e.target.value);
          }}
          value={wallet}
          type={"text"}
          placeholder="Add ethereum-compatible wallet address"
        ></input>
        <input
          className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
          onChange={(e) => {
            setCollectionAddress(e.target.value);
          }}
          value={collection}
          type={"text"}
          placeholder="Add any ethereum-based collection address"
        ></input>
        <label className="text-gray-600 ">
          <input
            onChange={(e) => {
              setFetchCollection(e.target.checked);
            }}
            type={"checkbox"}
            className="mr-2"
          ></input>
          only fetch collection
        </label>
        <button
          className={
            "disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"
          }
          onClick={() => {
            if (fetchCollection) {
              fetchNFTsForCollection();
            } else fetchNFTs();
          }}
        >
          Let's go!{" "}
        </button>
      </div>
      <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
        {NFTs.length &&
          NFTs.map((nft) => {
            return <NFTCard nft={nft}></NFTCard>;
          })}
      </div>
      <input
        className="w-1/32 bg-slate-100 py-1 px-1 rounded-lg text-black-800 focus:outline-black-300 disabled:bg-slate-50 disabled:text-gray-50"
        onChange={(e) => {
          setPage(e.target.value);
        }}
        value={page}
        type={"integer"}
        placeholder="Page"
      ></input>
      <button
        className={
          "disabled:bg-slate-500 text-black bg-gray-300 px-1 py-1 mt-1 rounded-sm w-1/5"
        }
        onClick={() => {
          fetchNFTsForCollection();
        }}
      >
        New page{" "}
      </button>
    </div>
  );
};

export default Home;

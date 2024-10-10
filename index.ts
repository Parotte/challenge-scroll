import { config as dotenv } from "dotenv";
import { createWalletClient, http, getContract, erc20Abi, parseUnits, maxUint256, publicActions, concat, numberToHex, size } from "viem";
import type { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { scroll } from "viem/chains";
import { wethAbi } from "./abi/weth-abi";

// For the 0x Challenge on Scroll, implement the following tasks:
// 1. Display the percentage breakdown of liquidity sources
// 2. Monetize your app with affiliate fees and surplus collection
// 3. Display buy/sell tax for tokens with tax
// 4. Display all sources of liquidity on Scroll

const qs = require("qs");
dotenv();  // Load environment variables
const { PRIVATE_KEY, ZERO_EX_API_KEY, ALCHEMY_HTTP_TRANSPORT_URL } = process.env;

// Validate required environment variables
if (!PRIVATE_KEY || !ZERO_EX_API_KEY || !ALCHEMY_HTTP_TRANSPORT_URL) {
  throw new Error("Missing one or more required environment variables: PRIVATE_KEY, ZERO_EX_API_KEY, ALCHEMY_HTTP_TRANSPORT_URL.");
}

const headers = new Headers({
  "Content-Type": "application/json",
  "0x-api-key": ZERO_EX_API_KEY,
  "0x-version": "v2",
});

// Setup wallet client
const client = createWalletClient({
  account: privateKeyToAccount(`0x${PRIVATE_KEY}` as `0x${string}`),
  chain: scroll,
  transport: http(ALCHEMY_HTTP_TRANSPORT_URL),
}).extend(publicActions); // Extend wallet client with public actions for public client usage

async function displayLiquiditySources() {
  const [address] = await client.getAddresses();
  const weth = getContract({ address: "0x5300000000000000000000000000000000000004", abi: wethAbi, client });
  const wsteth = getContract({ address: "0xf610A9dfB7C89644979b4A0f27063E9e7d7Cda32", abi: erc20Abi, client });

  const chainId = client.chain.id.toString(); // Ensure correct ID for Scroll
  const sourcesResponse = await fetch(`https://api.0x.org/swap/v1/sources?${new URLSearchParams({ chainId }).toString()}`, { headers });
  const sourcesData = await sourcesResponse.json();

  console.log("Liquidity sources for Scroll chain:");
  console.log(Object.keys(sourcesData.sources).join(", "));

  // Further functionality continues below...
}

async function main() {
  try {
    await displayLiquiditySources();
    // Further functionality such as displaying token taxes, etc.
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main();

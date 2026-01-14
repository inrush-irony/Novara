import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import axios from "axios";
import { createPublicClient, createWalletClient, custom, formatEther, http, isAddress } from "viem";
import { baseSepolia } from "viem/chains";
import fs from "node:fs";

const NETWORK = {
  name: "Base Sepolia",
  chainId: 84532,
  rpcUrl: "https://sepolia.base.org",
  explorer: "https://sepolia.basescan.org",
};

function addressLink(address) {
  return `${NETWORK.explorer}/address/${address}`;
}

function blockLink(blockNumber) {
  return `${NETWORK.explorer}/block/${blockNumber}`;
}

function codeLink(address) {
  return `${NETWORK.explorer}/address/${address}#code`;
}

function shortAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function loadTargets() {
  try {
    const raw = fs.readFileSync("samples/targets.json", "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.targets) ? parsed.targets : [];
  } catch {
    return [];
  }
}

async function rpcHealthCheck() {
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_chainId",
    params: [],
  };
  const res = await axios.post(NETWORK.rpcUrl, payload, { timeout: 10000 });
  return res?.data?.result ?? null;
}

export async function run() {
  console.log("Built for Base");
  console.log(`Network: ${NETWORK.name}`);
  console.log(`chainId (decimal): ${NETWORK.chainId}`);
  console.log(`Explorer: ${NETWORK.explorer}`);
  console.log("");

  console.log("RPC health check:");
  try {
    const chainIdHex = await rpcHealthCheck();
    console.log(`- eth_chainId: ${chainIdHex}`);
  } catch (e) {
    console.log(`- rpc check failed: ${e?.message || String(e)}`);
  }

  const sdk = new CoinbaseWalletSDK({
    appName: "Novara",
    darkMode: false,
  });

  const provider = sdk.makeWeb3Provider(NETWORK.rpcUrl, NETWORK.chainId);

  const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: custom(provider),
  });

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(NETWORK.rpcUrl),
  });

  const targets = loadTargets();
  console.log(`Targets loaded: ${targets.length}`);
  console.log("");

  let addresses = [];
  try {
    addresses = await walletClient.getAddresses();
  } catch {
    console.log("Wallet connection unavailable, continuing with RPC-only reads");
  }

  if (addresses.length) {
    console.log("Balances:");
    for (const address of addresses) {
      const balance = await publicClient.getBalance({ address });
      console.log(`- ${shortAddress(address)}: ${formatEther(balance)} ETH`);
      console.log(`  ${addressLink(address)}`);
    }
    console.log("");
  }

  const latestBlock = await publicClient.getBlockNumber();
  const block = await publicClient.getBlock({ blockNumber: latestBlock });
  const gasPrice = await publicClient.getGasPrice();

  console.log("Block and gas data:");
  console.log(`- Latest block: ${latestBlock.toString()}`);
  console.log(`  ${blockLink(latestBlock.toString())}`);
  console.log(`- Timestamp: ${new Date(Number(block.timestamp) * 1000).toISOString()}`);
  console.log(`- Gas price (gwei): ${(Number(gasPrice) / 1e9).toFixed(3)}`);
  console.log("");

  console.log("Bytecode checks:");
  for (const target of targets) {
    if (!isAddress(target)) continue;
    const code = await publicClient.getBytecode({ address: target });
    const hasCode = !!code && code !== "0x";
    console.log(`- ${shortAddress(target)}: ${hasCode ? "bytecode found" : "no bytecode"}`);
    console.log(`  ${codeLink(target)}`);
  }
}

run().catch((e) => console.error(e));

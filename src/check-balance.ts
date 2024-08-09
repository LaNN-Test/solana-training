import { airdropIfRequired } from "@solana-developers/helpers";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import dotenv from "dotenv";

dotenv.config();

const connection = new Connection(clusterApiUrl("devnet"));
console.log(`Connected to devnet`);

const publicKey = new PublicKey("H1TUhEgTMcbQfv54TQoQA4sNsrdDEVLUtFn1AuK7fZXq");

await airdropIfRequired(
  connection,
  publicKey,
  1 * LAMPORTS_PER_SOL,
  0.5 * LAMPORTS_PER_SOL
)

const balanceInLamports = await connection.getBalance(publicKey)

const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL

console.log(`The balance for the wallet at address ${publicKey} is: ${balanceInSol}`)

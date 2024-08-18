import dotenv from "dotenv";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { mintTo } from "@solana/spl-token";
import { getExplorerLink } from "@solana-developers/helpers";

dotenv.config();

let privateKey = process.env["SECRET_KEY"];
if (privateKey === undefined) {
  console.log("Add SECRET_KEY to .env!");
  process.exit(1);
}
const asArray = Uint8Array.from(JSON.parse(privateKey));
const sender = Keypair.fromSecretKey(asArray);

const connection = new Connection(clusterApiUrl("devnet"));

// Our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

// Token mint account (Mint from Explorer) (идентификатор токена)
const tokenMintAccount = new PublicKey(
  "J1kPQXYG5LenR31aCQP5oWXpfFebeQ9kefUCoe3kxaRn"
);

// Token account (create-token-account.ts) (идентификатор балланса конкретного пользователя)
const recipientAssociatedTokenAccount = new PublicKey(
  "5NgQptafPWUWi7XcK4Uvi3U9f3Dnrm5CufX92CQmTgFu"
);

const transactionSignature = await mintTo(
  connection,
  sender,
  tokenMintAccount,
  recipientAssociatedTokenAccount,
  sender,
  10 * MINOR_UNITS_PER_MAJOR_UNITS
);

const link = getExplorerLink("transaction", transactionSignature, "devnet");

console.log(`✅ Success! Mint Token Transaction: ${link}`);

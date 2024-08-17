import dotenv from "dotenv";
import { getExplorerLink } from "@solana-developers/helpers";
import { Keypair, clusterApiUrl, Connection } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";

dotenv.config();

let privateKey = process.env["SECRET_KEY"];
if (privateKey === undefined) {
  console.log("Add SECRET_KEY to .env!");
  process.exit(1);
}
// преобразует строковый приватный ключ в массив байтов
const asArray = Uint8Array.from(JSON.parse(privateKey));
// создает объект 'Keypair' из приватного ключа => аккаунт отправителя транзакций
const sender = Keypair.fromSecretKey(asArray);

// cоздает подключение к 'Solana devnet'
const connection = new Connection(clusterApiUrl("devnet"));

console.log(`🔑 Our public key is: ${sender.publicKey.toBase58()}`);

// cоздает новый токенный минт
const tokenMint = await createMint(
  connection, // подключение к Solana
  sender, // аккаунт отправителя транзакции
  sender.publicKey, // аккаунт, который будет владельцем токенного минта
  null, // опционально - для указания минта, от которого наследуются свойства (здесь не используется)
  2 // количество десятичных знаков для токена
);

// создает ссылку на созданный токенный минт в 'Solana Explorer'
const link = getExplorerLink("address", tokenMint.toString(), "devnet");

console.log(`✅ Token Mint: ${link}`);

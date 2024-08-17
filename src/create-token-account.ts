import "dotenv/config";
import { getExplorerLink } from "@solana-developers/helpers";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

// загрузка приватного ключа
let privateKey = process.env["SECRET_KEY"];
if (privateKey === undefined) {
  console.log("Add SECRET_KEY to .env!");
  process.exit(1);
}
// преобразование приватного ключа в массив байтов для создания объекта 'Keypair'
const asArray = Uint8Array.from(JSON.parse(privateKey));
// создает объект Keypair => аккаунт отправителя транзакций.
const sender = Keypair.fromSecretKey(asArray);
// подключение к 'Solana devnet'
const connection = new Connection(clusterApiUrl("devnet"));

console.log(`🔑 Our pubic key is: ${sender.publicKey.toBase58()}`);

// определяет публичный ключ токенного минта
const tokenMintAccount = new PublicKey(
  "J1kPQXYG5LenR31aCQP5oWXpfFebeQ9kefUCoe3kxaRn"
);
// определяет публичный ключ получателя токенов
const recipient = new PublicKey("H1TUhEgTMcbQfv54TQoQA4sNsrdDEVLUtFn1AuK7fZXq");

// создание или получение ассоциированного токенного аккаунта для получателя и токенного минта
const tokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  sender,
  tokenMintAccount,
  recipient
);

console.log(`Token Account: ${tokenAccount.address.toBase58()}`);

// создание ссылки на созданный токенный аккаунт в Solana Explorer
const link = getExplorerLink(
  "address",
  tokenAccount.address.toBase58(),
  "devnet"
);

console.log(`✅ Created token account: ${link}`);

import "dotenv/config";
import {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import { getExplorerLink } from "@solana-developers/helpers";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";

// Load the private key from the environment variable "SECRET_KEY"
let privateKey = process.env["SECRET_KEY"];
if (privateKey === undefined) {
  console.log("Add SECRET_KEY to .env!");
  process.exit(1);
}

// Convert the private key from JSON to Uint8Array and create a Keypair object
const asArray = Uint8Array.from(JSON.parse(privateKey));
const user = Keypair.fromSecretKey(asArray);

// Establish a connection to the Solana devnet cluster
const connection = new Connection(clusterApiUrl("devnet"));

// Define the Token Metadata Program ID (constant for the Metaplex program)
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// Define the token mint account (token Mint account ID)
const tokenMintAccount = new PublicKey(
  "J1kPQXYG5LenR31aCQP5oWXpfFebeQ9kefUCoe3kxaRn"
);

// Metadata for the token, including name, symbol, URI, and other optional fields
const metadataData = {
  name: "Solana UA Bootcamp 2024-08-06",
  symbol: "UAB-2",
  uri: "https://arweave.net/1234", // URI for off-chain metadata
  sellerFeeBasisPoints: 0, // Seller fee basis points (0 in this case)
  creators: null, // List of creators (optional)
  collection: null, // Collection information (optional)
  uses: null, // Usage information (optional)
};

// Derive the Metadata Program Derived Address (PDA) for the token
const [metadataPDA, _metadataBump] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("metadata"),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    tokenMintAccount.toBuffer(),
  ],
  TOKEN_METADATA_PROGRAM_ID
);

// Create a new transaction object
const transaction = new Transaction();

// Create an instruction to create a metadata account for the token
const createMetadataAccountInstruction =
  createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataPDA, // Metadata account PDA
      mint: tokenMintAccount, // Mint account for the token
      mintAuthority: user.publicKey, // Authority to mint tokens
      payer: user.publicKey, // Payer of the transaction fees
      updateAuthority: user.publicKey, // Authority to update the metadata
    },
    {
      createMetadataAccountArgsV3: {
        collectionDetails: null, // Collection details (optional)
        data: metadataData, // Metadata for the token
        isMutable: true, // Whether the metadata is mutable
      },
    }
  );

// Add the instruction to the transaction
transaction.add(createMetadataAccountInstruction);

// Send the transaction and confirm it on the blockchain
try {
  await sendAndConfirmTransaction(connection, transaction, [user]);
} catch (error) {
  console.error("❌ Transaction failed:", error);
}

// Generate a link to view the token mint on the Solana Explorer
const tokenMintLink = getExplorerLink(
  "address",
  tokenMintAccount.toString(),
  "devnet"
);
console.log(`✅ Look at the token mint again: ${tokenMintLink}!`);

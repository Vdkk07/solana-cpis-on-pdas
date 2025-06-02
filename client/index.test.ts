import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { test, expect } from "bun:test";
import { LiteSVM } from "litesvm";

test("Create pda for client", () => {
  let svm = new LiteSVM();
  let programId = PublicKey.unique();
  let payer = Keypair.generate();
  svm.addProgramFromFile(programId, "./cpi_pda_contract.so");
  svm.airdrop(payer.publicKey, BigInt(LAMPORTS_PER_SOL * 5));

  let [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("user"), payer.publicKey.toBuffer()],
    programId
  );

  let ix = new TransactionInstruction({
    keys: [
      { pubkey: payer.publicKey, isSigner: true, isWritable: true },
      { pubkey: pda, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: programId,
    data: Buffer.from(""),
  });

  let tx = new Transaction().add(ix);
  tx.recentBlockhash = svm.latestBlockhash();
  tx.feePayer = payer.publicKey;
  tx.sign(payer);
  let res = svm.sendTransaction(tx);
  console.log(res.toString());

  const balance = svm.getBalance(pda);
  console.log(Number(balance));
  expect(Number(balance)).toBeGreaterThan(0)
  // expect(Number(balance)).toBe(0);
});

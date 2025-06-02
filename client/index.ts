import {
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { LiteSVM } from "litesvm";

function main() {
  let svm = new LiteSVM();

  let payer = new Keypair();
  let dataAcc = new Keypair();
  svm.airdrop(payer.publicKey, BigInt(LAMPORTS_PER_SOL));

  let balance = svm.getBalance(payer.publicKey);

  let tx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: dataAcc.publicKey,
      lamports: Number(svm.minimumBalanceForRentExemption(BigInt(8))),
      space: 8,
      programId: SystemProgram.programId,
    })
  );

  tx.recentBlockhash = svm.latestBlockhash();
  tx.feePayer = payer.publicKey;
  tx.sign(payer,dataAcc);
  svm.sendTransaction(tx);
  svm.expireBlockhash();

  console.log(dataAcc.publicKey.toBase58())
  console.log(svm.getAccount(dataAcc.publicKey)?.lamports)
  console.log(svm.getAccount(dataAcc.publicKey)?.data);
  console.log(svm.getAccount(dataAcc.publicKey)?.executable);
  console.log(svm.getAccount(dataAcc.publicKey)?.owner.toBase58());
  console.log(svm.getAccount(dataAcc.publicKey)?.rentEpoch)
  

}

main();

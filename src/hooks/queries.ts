"use client";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { randomBytes } from "crypto";

import * as anchor from "@coral-xyz/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, PublicKey, SystemProgram } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useCluster } from "../contexts/cluster/ClusterProvider";
import { useAnchorProvider } from "../contexts/solana/SolanaProvider";
import { getDynamicEscrowProgram, getDynamicEscrowProgramId } from "@/program";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { InitializeProps } from "../types";
import { useTransactionToast } from "@/components/Layout";
import { Mina } from "next/font/google";

export function useDynamicEscrowProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getDynamicEscrowProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = useMemo(
    () => getDynamicEscrowProgram(provider, programId),
    [provider, programId]
  );
  const accounts = useQuery({
    queryKey: ["dynamicescrow", "all", { cluster }],
    queryFn: () => program.account.escrow.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ["dynamicescrow", "initialize", { cluster }],
    mutationFn: (params: InitializeProps) => {
      const seed = new anchor.BN(randomBytes(8));
      const escrow = PublicKey.findProgramAddressSync(
        [Buffer.from("state"), seed.toArrayLike(Buffer, "le", 8)],
        program.programId
      )[0];
      const vault = getAssociatedTokenAddressSync(params.mintA, escrow, true);
      const [initializerAtaA, initializerAtaB] = [params.mintA, params.mintB]
        .map((m) => getAssociatedTokenAddressSync(m, params.initializer))
        .flat();
      const accounts = {
        initializer: params.initializer,
        mintA: params.mintA,
        mintB: params.mintB,
        initializerAtaA: initializerAtaA,
        initializerAtaB: initializerAtaB,
        escrow,
        vault,
        associatedTokenprogram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      };

      return (
        program.methods
          .initialize(
            seed,
            new anchor.BN(params.initializerAmount),
            new anchor.BN(params.takerAmount)
          )
          .accounts(accounts)
          // .signers([params.keypair])
          .rpc()
      );
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error("Failed to initialize account"),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useDynamicEscrowProgramAccount({
  account,
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useDynamicEscrowProgram();

  const accountQuery = useQuery({
    queryKey: ["dynamicescrow", "fetch", { cluster, account }],
    queryFn: () => program.account.escrow.fetch(account),
  });

  const cancelMutation = useMutation({
    mutationKey: ["dynamicescrow", "cancel", { cluster, account }],
    mutationFn: (initializer: PublicKey) => {
      const vault = getAssociatedTokenAddressSync(
        accountQuery.data!.mintA,
        account,
        true
      );
      const initializerAtaA = getAssociatedTokenAddressSync(
        accountQuery.data!.mintA,
        initializer
      );
      const cancelAccounts = {
        initializer,
        mintA: accountQuery.data!.mintA,
        initializerAtaA,
        escrow: account,
        vault,
        associatedTokenprogram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      };
      return program.methods.cancel().accounts(cancelAccounts).rpc();
    },
    onSuccess: (tx) => {
        transactionToast(tx);
      return accounts.refetch();
    },
  });

  const exchangeMutation = useMutation({
    mutationKey: ["dynamicescrow", "exchange", { cluster, account }],
    mutationFn: (taker: PublicKey) => {
      const vault = getAssociatedTokenAddressSync(
        accountQuery.data!.mintA,
        account,
        true
      );
      const [initializerAtaA, initializerAtaB, takerAtaA, takerAtaB] = [
        accountQuery.data!.initializer,
        taker,
      ]
        .map((a) =>
          [accountQuery.data!.mintA, accountQuery.data!.mintB].map((m) =>
            getAssociatedTokenAddressSync(m, a)
          )
        )
        .flat();
      const exchangeAccounts = {
        initializer: accountQuery.data!.initializer,
        taker: taker,
        mintA: accountQuery.data!.mintA,
        mintB: accountQuery.data!.mintB,
        initializerAtaA,
        initializerAtaB,
        takerAtaA,
        takerAtaB,
        escrow: account,
        vault,
        associatedTokenprogram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      };
      return program.methods.exchange().accounts(exchangeAccounts).rpc();
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  return {
    accountQuery,
    exchangeMutation,
    cancelMutation,
  };
}

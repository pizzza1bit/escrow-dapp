"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { TokenMetaDataProps } from "@/types";
import { tokens } from "@/utils/constants";
import { ImageSelect } from "@/components";
import { WalletButton } from "@/contexts/solana/SolanaProvider";
import { useDynamicEscrowProgram } from "@/hooks/queries";

export default function Create() {
  const { publicKey } = useWallet();
  const [tokenA, setTokenA] = useState<TokenMetaDataProps>(tokens[0]);
  const [tokenB, setTokenB] = useState<TokenMetaDataProps>(tokens[0]);
  const [initializerAmount, setInitializerAmount] = useState<
    string | undefined
  >();
  const [takerAmount, setTakerAmount] = useState<string | undefined>();

  const { initialize } = useDynamicEscrowProgram();
  return (
    <div className="w-full flex flex-col items-center mt-48">
      <div className="card bg-base-300 w-[800px] shadow-2xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title pb-5">Create Escrow</h2>
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="w-16 text-start">Send</span>
              <input
                value={initializerAmount}
                type="number"
                placeholder="amount"
                className="input input-bordered input-primary w-full flex-1 !outline-none"
                onChange={(event) => setInitializerAmount(event.target.value)}
              />
              <ImageSelect token={tokenA} setToken={setTokenA} />
            </div>
            <div className="flex items-center gap-4">
              <span className="w-16 text-start">Receive</span>
              <input
                value={takerAmount}
                type="number"
                placeholder="amount"
                className="input input-bordered input-primary w-full flex-1 !outline-none"
                onChange={(event) => setTakerAmount(event.target.value)}
              />
              <ImageSelect token={tokenB} setToken={setTokenB} />
            </div>
          </div>
          <div className="card-actions justify-end w-full mt-10">
            {!!publicKey ? (
              <button
                className="btn btn-primary"
                onClick={() => {
                  const mintA = new PublicKey(tokenA.publickey);
                  const mintB = new PublicKey(tokenB.publickey);
                  if (mintA.equals(mintB)) {
                    toast.error("Can't create with same token");
                    return;
                  }
                  initialize.mutateAsync({
                    initializer: publicKey,
                    mintA,
                    mintB,
                    initializerAmount:
                      Number(initializerAmount) * Math.pow(10, tokenA.decimal),
                    takerAmount:
                      Number(takerAmount) * Math.pow(10, tokenB.decimal),
                  });
                }}
                disabled={initialize.isPending}
              >
                Create
              </button>
            ) : (
              <div className="flex-none space-x-2">
                <WalletButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

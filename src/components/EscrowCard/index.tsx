"use client";

import { WalletButton } from "@/contexts/solana/SolanaProvider";
import { useDynamicEscrowProgramAccount } from "@/hooks/queries";
import { getTokenLogo, truncateAddress } from "@/utils/functions";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import Image from "next/image";
export interface EscrowCardProps {
  account: PublicKey;
  initializer: PublicKey;
  mintA: PublicKey;
  mintB: PublicKey;
  initializerAmount: string;
  takerAmount: string;
}

export default function EscrowCard({
  account,
  initializer,
  mintA,
  mintB,
  initializerAmount,
  takerAmount,
}: EscrowCardProps) {
  const { publicKey } = useWallet();
  const { exchangeMutation, cancelMutation } = useDynamicEscrowProgramAccount({
    account,
  });
  return (
    <div className="card bg-neutral text-neutral-content">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Dynamic Escrow</h2>
        <div className="w-full flex flex-col gap-3 text-[20px]">
          <div className="flex items-center justify-between w-full">
            <span>Creator</span>
            <span>{truncateAddress(initializer.toString(), 5)}</span>
          </div>
          <div className="flex flex-row gap-4 w-full justify-between">
            <span className="text-start flex-1">Send Amount</span>
            <span className="">{initializerAmount}</span>
            <Image
              unoptimized
              src={getTokenLogo(mintA.toString())}
              alt={mintA.toString()}
              width={30}
              height={30}
            />
          </div>
          <div className="flex flex-row gap-4 w-full justify-between">
            <span className="text-start flex-1">Receive Amount</span>
            <span className="">{takerAmount}</span>
            <Image
              unoptimized
              src={getTokenLogo(mintB.toString())}
              alt={mintB.toString()}
              width={30}
              height={30}
            />
          </div>
        </div>
        {!!publicKey ? (
          <div className="card-actions justify-end w-full mt-[10px]">
            {!initializer.equals(publicKey) ? (
              <button
                className="btn btn-primary"
                disabled={exchangeMutation.isPending}
                onClick={() => exchangeMutation.mutateAsync(publicKey)}
              >
                Accept
              </button>
            ) : (
              <button
                onClick={() => cancelMutation.mutateAsync(publicKey)}
                className="btn btn-warning"
                disabled={cancelMutation.isPending}
              >
                Close
              </button>
            )}
          </div>
        ) : (
          <div className="flex-none space-x-2">
            <WalletButton />
          </div>
        )}
      </div>
    </div>
  );
}

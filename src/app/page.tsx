"use client";

import { EscrowCard } from "@/components";
import { useDynamicEscrowProgram } from "@/hooks/queries";
import { getAmount } from "@/utils/functions";

export default function Home() {
  const { accounts, getProgramAccount } = useDynamicEscrowProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }

  return (
    <div className="p-4">
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {accounts.data.map((account) => (
            <EscrowCard
              key={account.publicKey.toString()}
              account={account.publicKey}
              initializer={account.account.initializer}
              mintA={account.account.mintA}
              mintB={account.account.mintB}
              initializerAmount={getAmount(
                account.account.mintA.toBase58(),
                account.account.initializerAmount
              )}
              takerAmount={getAmount(
                account.account.mintB.toBase58(),
                account.account.takerAmount
              )}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={"text-2xl"}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

"use client";

import { ComponentProps } from "../types";
import ReactQueryProvider from "./query/ReactQueryProvider";
import { ClusterProvider } from "./cluster/ClusterProvider";
import { SolanaProvider } from "./solana/SolanaProvider";

export function Providers({ children }: ComponentProps) {
  return (
    <ReactQueryProvider>
      <ClusterProvider>
        <SolanaProvider>{children}</SolanaProvider>
      </ClusterProvider>
    </ReactQueryProvider>
  );
}

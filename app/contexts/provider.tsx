import { ComponentProps } from "@/types";
import ReactQueryProvider from "@/contexts/query/ReactQueryProvider";
import { ClusterProvider } from "@/contexts/cluster/ClusterProvider";
import { SolanaProvider } from "@/contexts/solana/SolanaProvider";

export function Providers({ children }: ComponentProps) {
  return (
    <ReactQueryProvider>
      <ClusterProvider>
        <SolanaProvider>{children}</SolanaProvider>
      </ClusterProvider>
    </ReactQueryProvider>
  );
}

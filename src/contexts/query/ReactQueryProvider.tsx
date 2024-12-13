"use client";

import React from "react";

import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
      <ReactQueryDevtools
        initialIsOpen={false}
        position="left"
        buttonPosition="bottom-left"
      />
    </QueryClientProvider>
  );
}

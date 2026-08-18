"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import I18nProvider from "@/components/i18n-provider";
import { SessionGuard } from "@/components/auth/session-guard";

export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <I18nProvider>
        <SessionGuard />
        {children}
      </I18nProvider>
    </QueryClientProvider>
  );
}

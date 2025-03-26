"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Loading from "./Spinner";
import { useSWRConfig } from "swr";

const LoadingPage = () => {
  const { cache } = useSWRConfig();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Check if any requests are in flight
  const isLoading = Array.from(cache.keys()).some(
    (key) => cache.get(key)?.isValidating
  );

  if (isLoading) {
    return <Loading />;
  }

  return null;
};

export default function LoadingWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <LoadingPage />
    </Suspense>
  );
}

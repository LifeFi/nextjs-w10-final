import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

const PUBLIC = ["/log-in", "/create-account"];

interface ProfileResponse {
  ok: boolean;
  profile: User;
}

export default function useUser() {
  const router = useRouter();

  const { data, error, mutate } = useSWR<ProfileResponse>("/api/users/me");

  // isRefresh && mutate();

  useEffect(() => {
    const isPublic = PUBLIC.includes(router.pathname);

    console.log("isPublic: ", isPublic);
    if (data && !data.ok && !isPublic) {
      router.replace("/log-in");
    }
  }, [data, router]);

  return { user: data?.profile, isLoading: !data && !error };
}

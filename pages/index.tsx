import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { cls } from "../lib/util";
import useMutation from "../lib/useMutation";
import useUser from "../lib/useUser";

export default () => {
  const { user } = useUser();
  const router = useRouter();
  const [logout] = useMutation("/api/users/logout");
  console.log(router);

  return (
    <div>
      <h1>Home</h1>
      <div className="flex">
        <div
          className={cls(
            router.pathname === "/log-in" ? "text-blue-500 font-bold" : ""
          )}
        >
          <Link href="/log-in">Log-In</Link>
        </div>
        <div
          className={cls(
            router.pathname === "/create-account"
              ? "text-blue-500 font-bold"
              : ""
          )}
        >
          <Link href="/create-account">Create-Account</Link>
        </div>

        <div
          className={cls(
            router.pathname === "/" ? "text-blue-500 font-bold" : ""
          )}
        >
          <Link href="/">Home</Link>
        </div>
        <button
          onClick={() => {
            logout({});
            console.log("Log-Out!");
            router.push("/log-in");
          }}
          type="button"
        >
          Log-Out
        </button>
      </div>
      <div>Welcome!~</div>
    </div>
  );
};

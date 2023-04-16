import useMutation from "@libs/useMutation";
import useUser from "@libs/useUser";
import { cls } from "@libs/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import AvatarCircle from "./AvatarCircle";

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  goBackPath?: string;
  hasLeftSideTabBar?: boolean;
  children: React.ReactNode;
}

export default function Layout({
  title,
  canGoBack,
  hasLeftSideTabBar,
  children,
}: LayoutProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { mutate } = useSWRConfig();

  const [logout, { data }] = useMutation("/api/users/logout");

  useEffect(() => {
    if (data?.ok) {
      mutate("/api/users/me");
      router.push("/");
    }
  }, [data]);

  const onClick = () => {
    router.back();
  };

  return (
    <div className="flex w-full h-screen max-w-xl">
      {hasLeftSideTabBar && (
        <div className="w-20 bg-white">
          <div className="fixed left-0 py-3 w-16 h-full flex flex-col justify-between items-center border-r-[1px]">
            <div className="hover:bg-slate-100 hover:rounded-full w-12 h-12 flex justify-center items-center">
              <Link href="/">
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-8 text-blue-400 cursor-pointer"
                >
                  <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                </svg>
              </Link>
            </div>

            {modalOpen ? (
              <>
                <div
                  className="fixed top-0 left-0 w-full h-full"
                  onClick={() => setModalOpen((prev) => !prev)}
                ></div>
                <div className="fixed bottom-24 left-3 bg-white rounded-md shadow-2xl w-72 h-14 flex items-center pl-3 text-sm">
                  <button onClick={() => logout({})} type="button">
                    <span className="font-semibold">@{user?.username}</span>
                    계정에서 로그아웃
                  </button>
                </div>
              </>
            ) : null}

            {user && (
              <div
                onClick={() => setModalOpen((prev) => !prev)}
                className="hover:bg-slate-100 hover:rounded-full w-16 h-16 flex justify-center items-center cursor-pointer"
              >
                <AvatarCircle />
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex w-full ">
        <div className="fixed flex top-0 h-14 w-full pl-2 items-center border-b text-lg font-medium text-gray-800 bg-white">
          {canGoBack ? (
            <div>
              <button
                onClick={onClick}
                className="absolute top-2 left-2 h-10 w-14"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>
            </div>
          ) : null}
          {title ? (
            <span className={cls(canGoBack ? "pl-10" : "", "")}>{title}</span>
          ) : null}
        </div>
        <div className="mt-20 pl-2 w-full">{children}</div>
      </div>
    </div>
  );
}

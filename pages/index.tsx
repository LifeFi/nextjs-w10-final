import Link from "next/link";
import React, { useEffect } from "react";
import { cls } from "@libs/utils";
import useMutation from "@libs/useMutation";
import useUser from "@libs/useUser";
import Layout from "@components/layout";
import AvatarCircle from "@components/AvatarCircle";
import { Tweet, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface TweetMutationsResult {
  ok: boolean;
  tweet: Tweet;
  error: string;
}

interface TweetForm {
  content: string;
}

interface TweetWithInfo extends Tweet {
  user: User;
  _count: {
    likes: number;
  };
}

interface TweetsResponse {
  ok: boolean;
  tweets: TweetWithInfo[];
  error: string;
}

export default () => {
  const { user } = useUser();

  // 폼 작성
  const { register, handleSubmit } = useForm<TweetForm>();

  // 트윗 뮤테이션 작성
  const [tweetMutation, { loading, data }] =
    useMutation<TweetMutationsResult>("/api/tweets");

  // 좋아요 뮤테이션 작성

  // 쿼리 작성
  const { data: tweetsData, mutate: tweetsDataMutate } =
    useSWR<TweetsResponse>("api/tweets");

  const onValid = ({ content }: TweetForm) => {
    if (!loading) {
      tweetMutation({ content });
    }
  };

  useEffect(() => {
    if (!loading && data?.ok) {
      tweetsDataMutate();
    }
  }, [data]);
  console.log(tweetsData);

  return (
    <Layout title="홈" hasLeftSideTabBar>
      <div className="w-full">
        <div className="flex w-full border-b-[1px]">
          <div className="w-16">
            <AvatarCircle />
          </div>

          <form
            onSubmit={handleSubmit(onValid)}
            className="flex flex-col w-full justify-center items-cente mr-2"
          >
            <textarea
              {...register("content", { required: true })}
              name="content"
              placeholder="무슨 일이 일어나고 있나요?"
              className="w-full py-3 px-2"
              disabled={!user}
            />
            <div className="w-full flex justify-center items-center h-16">
              <input
                type="submit"
                value="트윗하기"
                className={cls(
                  "w-28 h-8 rounded-full text-sm font-semibold",
                  user
                    ? " bg-blue-400 text-white cursor-pointer"
                    : "bg-slate-400 text-white"
                )}
                disabled={!user}
              />
            </div>
          </form>
        </div>
        <div>
          {tweetsData?.tweets?.map((tweet) => (
            <div key={tweet.id} className="flex border-b-[1px] mt-3 pb-3">
              <div className="w-16">
                <AvatarCircle />
              </div>
              <div className="flex flex-col w-full">
                <div className="font-semibold pl-1">{tweet.user.username}</div>

                <Link href={`/tweet/${tweet.id}`}>
                  <div className="w-full break-words whitespace-pre-wrap hover:bg-slate-100 p-1 cursor-pointer">
                    {tweet.content}
                  </div>
                </Link>
                <div className="flex pl-1">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="w-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                  {tweet._count.likes}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!user && (
        <div className="fixed bottom-0 left-0 w-full h-16 flex justify-center items-center bg-blue-400">
          <Link href="/log-in">
            <div className="flex h-9 w-1/2 mx-2 rounded-full border-[1px] border-white justify-center items-center text-white font-semibold cursor-pointer text-sm hover:bg-blue-300">
              로그인
            </div>
          </Link>
          <Link href="/create-account">
            <div className="flex h-9 w-1/2 mx-2 rounded-full border-[1px] border-white justify-center items-center bg-white font-semibold cursor-pointer text-sm hover:bg-slate-200">
              가입하기
            </div>
          </Link>
        </div>
      )}
    </Layout>
  );
};

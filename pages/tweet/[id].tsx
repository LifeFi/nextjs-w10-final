import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "@components/layout";
import AvatarCircle from "@components/AvatarCircle";
import useSWR from "swr";
import { Tweet, User } from "@prisma/client";
import useMutation from "@libs/useMutation";

interface TweetWithInfo extends Tweet {
  user: User;
  _count: {
    likes: number;
  };
}
interface TweetResponse {
  ok: boolean;
  error?: string;
  tweet?: TweetWithInfo;
  isLike?: boolean;
}

interface toggleLikeMutationResult {
  ok: boolean;
  isLike: boolean;
}

const TweetDetail: NextPage = () => {
  const router = useRouter();

  const { data: tweetData, mutate: tweetDataMutate } = useSWR<TweetResponse>(
    `/api/tweets/${router.query.id}`
  );
  console.log(tweetData);

  const [toggleLike, { loading, data }] = useMutation<toggleLikeMutationResult>(
    `/api/tweets/${router.query.id}/toggleLike`
  );

  const toggleLikeClick = () => {
    if (!loading) {
      toggleLike({});
    }
  };

  useEffect(() => {
    tweetDataMutate();
  }, [data]);

  return (
    <Layout title="스레드" hasLeftSideTabBar canGoBack>
      {tweetData ? (
        <div className="flex border-b-[1px] mt-3 pb-3">
          <div className="w-16">
            <AvatarCircle />
          </div>
          <div className="flex flex-col w-full">
            <div className="font-semibold pl-1">
              {tweetData?.tweet?.user.username}
            </div>

            <div className="w-full break-words whitespace-pre-wrap">
              {tweetData?.tweet?.content}
            </div>

            <div className="flex pl-1 cursor-pointer" onClick={toggleLikeClick}>
              {tweetData?.isLike ? (
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-5 mr-2 text-red-500"
                >
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              ) : (
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
              )}

              {tweetData?.tweet?._count.likes}
            </div>
          </div>
        </div>
      ) : null}
    </Layout>
  );
};

export default TweetDetail;

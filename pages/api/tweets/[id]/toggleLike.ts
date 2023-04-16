import { NextApiRequest, NextApiResponse } from "next";

import db from "@libs/db";
import withHandler, { ResponseType } from "@libs/withHandler";
import { withApiSession } from "@libs/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    query: { id },
  } = req;

  const foundTweet = await db.tweet.findUnique({
    where: { id: +id.toString() },
  });

  if (!foundTweet) {
    return res.json({
      ok: false,
      error: "Invalid tweet",
    });
  }

  const likeWhere = {
    tweetId_userId: {
      tweetId: +id.toString(),
      userId: Number(user?.id.toString()),
    },
  };

  const like = await db.like.findUnique({
    where: likeWhere,
  });

  if (like) {
    await db.like.delete({
      where: likeWhere,
    });
  } else {
    await db.like.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        tweet: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });
  }

  return res.json({
    ok: true,
    isLike: !Boolean(like),
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    fn: handler,
  })
);

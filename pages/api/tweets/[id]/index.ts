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

  if (req.method === "GET") {
    const foundTweet = await db.tweet.findUnique({
      where: { id: +id.toString() },
      include: {
        user: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!foundTweet) {
      return res.json({
        ok: false,
        error: "Invalid tweet",
      });
    }

    const isLike = Boolean(
      await db.like.findFirst({
        where: {
          tweet: { id: +id.toString() },
          user: { id: user?.id },
        },
      })
    );

    res.json({
      ok: true,
      tweet: foundTweet,
      isLike,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    fn: handler,
  })
);

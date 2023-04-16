import { NextApiRequest, NextApiResponse } from "next";

import db from "../../../libs/db";
import withHandler, { ResponseType } from "../../../libs/withHandler";
import { withApiSession } from "../../../libs/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const allTweets = await db.tweet.findMany({
      include: {
        user: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    res.json({
      ok: true,
      tweets: allTweets,
    });
  }

  if (req.method === "POST") {
    const {
      session: { user },
      body: { content },
    } = req;

    const newTweet = await db.tweet.create({
      data: {
        content,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      tweet: newTweet,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    fn: handler,
  })
);

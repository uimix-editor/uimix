// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { renderTrpcPanel } from "trpc-panel";
import { getBaseURL } from "../../utils/getBaseUrl";
import { appRouter } from "../../server/routers/_app";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const baseURL = getBaseURL();
  const result = renderTrpcPanel(appRouter, {
    url: `${baseURL}/api/trpc`,
    transformer: "superjson",
  });
  res.status(200);
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "no-cache");
  res.write(result);
  res.end();
};

export default handler;

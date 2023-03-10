import { z } from "zod";
import AWS from "aws-sdk";
import { baseProcedure, router } from "../trpc";
import { authenticate } from "../../helpers/api/auth";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

export const imageUploadRouter = router({
  getUploadURL: baseProcedure
    .input(
      z.object({
        hash: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const currentUser = await authenticate(ctx.req);
      const url = s3.getSignedUrl("putObject", {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${currentUser.id}/${input.hash}`,
        Expires: 60,
        ContentType: "image/png",
      });
      return url;
    }),
});

import { z } from "zod";
import AWS from "aws-sdk";
import { baseProcedure, router } from "../trpc";
import { authenticate } from "../../helpers/api/auth";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

export const imageRouter = router({
  getUploadURL: baseProcedure
    .input(
      z.object({
        hash: z.string(),
        contentType: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const currentUser = await authenticate(ctx.req);
      // await s3
      //   .putObject({
      //     Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      //     Key: `images/${currentUser.id}/${input.hash}`,
      //     ContentType: input.contentType,
      //     Body: input.hash,
      //     ACL: "public-read",
      //   })
      //   .promise();

      const uploadURL = await s3.getSignedUrl("putObject", {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `images/${currentUser.id}/${input.hash}`,
        Expires: 60,
        ContentType: input.contentType,
        ACL: "public-read",
      });
      return {
        uploadURL,
        url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/images/${currentUser.id}/${input.hash}`,
      };
    }),
});

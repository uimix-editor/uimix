import { z } from "zod";
import AWS from "aws-sdk";
import { baseProcedure, router } from "../trpc";
import { authenticate } from "../../helpers/api/auth";
import { assertNonNull } from "../../utils/assertNonNull";
import { db } from "../../lib/prismadb";
import { TRPCError } from "@trpc/server";

const s3 = new AWS.S3({
  accessKeyId: assertNonNull(process.env.AWS_S3_ACCESS_KEY_ID),
  secretAccessKey: assertNonNull(process.env.AWS_S3_SECRET_ACCESS_KEY),
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

      const bucketName = assertNonNull(process.env.AWS_S3_BUCKET_NAME);

      const uploadURL = s3.getSignedUrl("putObject", {
        Bucket: bucketName,
        Key: `images/${currentUser.id}/${input.hash}`,
        Expires: 60,
        ContentType: input.contentType,
        ACL: "public-read",
      });
      return {
        uploadURL,
        url: `https://${bucketName}.s3.amazonaws.com/images/${currentUser.id}/${input.hash}`,
      };
    }),

  getDocumentThumbnailUploadURL: baseProcedure
    .input(
      z.object({
        documentId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const currentUser = await authenticate(ctx.req);
      const document = await db.document.findFirst({
        where: {
          id: input.documentId,
          ownerId: currentUser.id,
        },
        select: { id: true },
      });
      if (!document) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found",
        });
      }

      const bucketName = assertNonNull(process.env.AWS_S3_BUCKET_NAME);

      const uploadURL = s3.getSignedUrl("putObject", {
        Bucket: bucketName,
        Key: `thumbnails/${input.documentId}.png`,
        Expires: 60,
        ContentType: "image/png",
        ACL: "public-read",
      });
      return {
        uploadURL,
        url: `https://${bucketName}.s3.amazonaws.com/thumbnails/${input.documentId}.png`,
      };
    }),
});

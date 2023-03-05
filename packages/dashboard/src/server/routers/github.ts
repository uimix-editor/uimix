import { Oregano } from "@next/font/google";
import { TRPCError } from "@trpc/server";
import { Octokit } from "octokit";
import { z } from "zod";
import { getAccountToken } from "../../helpers/api/auth";
import { baseProcedure, router } from "../trpc";

export const githubRouter = router({
  commits: baseProcedure
    .input(
      z.object({
        owner: z.string(),
        repo: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const req = ctx.req!;

      const accessToken = await getAccountToken(req, "github");
      if (!accessToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }

      const octokit = new Octokit({ auth: accessToken });
      const result = await octokit.request(
        "GET /repos/{owner}/{repo}/commits",
        {
          owner: input.owner,
          repo: input.repo,
        }
      );
      return result.data;
    }),

  deleteFiles: baseProcedure
    .input(
      z.object({
        owner: z.string(),
        repo: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const req = ctx.req!;

      const accessToken = await getAccountToken(req, "github");
      if (!accessToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }

      const octokit = new Octokit({ auth: accessToken });

      const { owner, repo } = input;

      const ref = (
        await octokit.request("GET /repos/{owner}/{repo}/git/ref/{ref}", {
          owner: input.owner,
          repo: input.repo,
          ref: "heads/main",
        })
      ).data;

      const currentCommit = (
        await octokit.request(
          "GET /repos/{owner}/{repo}/git/commits/{commit_sha}",
          {
            owner,
            repo,
            commit_sha: ref.object.sha,
          }
        )
      ).data;

      const currentTree = (
        await octokit.request(
          "GET /repos/{owner}/{repo}/git/trees/{tree_sha}{?recursive}",
          {
            owner,
            repo,
            tree_sha: currentCommit.tree.sha,
            recursive: 1,
          }
        )
      ).data;

      const time = new Date().toISOString();

      const newTreeItems = currentTree.tree.filter(
        (tree: any) => !tree.path.startsWith("push-demo")
      );

      const tree = (
        await octokit.request("POST /repos/{owner}/{repo}/git/trees", {
          owner,
          repo,
          tree: newTreeItems,
        })
      ).data;

      const commit = (
        await octokit.request("POST /repos/{owner}/{repo}/git/commits", {
          owner,
          repo,
          message: "Delete Test: " + time,
          tree: tree.sha,
          parents: [currentCommit.sha],
        })
      ).data;

      const newRef = (
        await octokit.request("PATCH /repos/{owner}/{repo}/git/refs/{ref}", {
          owner,
          repo,
          ref: "heads/main",
          sha: commit.sha,
        })
      ).data;

      return newRef;
    }),

  addFiles: baseProcedure
    .input(
      z.object({
        owner: z.string(),
        repo: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const req = ctx.req!;

      const accessToken = await getAccountToken(req, "github");
      if (!accessToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }

      const octokit = new Octokit({ auth: accessToken });

      const { owner, repo } = input;

      const ref = (
        await octokit.request("GET /repos/{owner}/{repo}/git/ref/{ref}", {
          owner: owner,
          repo: repo,
          ref: "heads/main",
        })
      ).data;

      const currentCommit = (
        await octokit.request(
          "GET /repos/{owner}/{repo}/git/commits/{commit_sha}",
          {
            owner: owner,
            repo: repo,
            commit_sha: ref.object.sha,
          }
        )
      ).data;

      const time = new Date().toISOString();

      const tree = (
        await octokit.request("POST /repos/{owner}/{repo}/git/trees", {
          owner: owner,
          repo: repo,
          base_tree: currentCommit.tree.sha,
          tree: [
            {
              path: "push-demo/file1.txt",
              mode: "100644",
              type: "blob",
              content: "File 1: " + time,
            },
            {
              path: "push-demo/file2.txt",
              mode: "100644",
              type: "blob",
              content: "File 2: " + time,
            },
          ],
        })
      ).data;

      const commit = (
        await octokit.request("POST /repos/{owner}/{repo}/git/commits", {
          owner: owner,
          repo: repo,
          message: "Commit Test: " + time,
          tree: tree.sha,
          parents: [currentCommit.sha],
        })
      ).data;

      const newRef = (
        await octokit.request("PATCH /repos/{owner}/{repo}/git/refs/{ref}", {
          owner: owner,
          repo: repo,
          ref: "heads/main",
          sha: commit.sha,
        })
      ).data;

      return newRef;
    }),
});

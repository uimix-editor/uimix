import url from "url";
import path from "path";
import fs from "fs";
import tmp from "tmp-promise";
import shell from "shelljs";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixtureFilePath = path.resolve(
  __dirname,
  "../../test-project/test.macaron"
);

const cliFilePath = path.resolve(__dirname, "../bin/cli.js");

describe("cli", () => {
  let tmpDir: tmp.DirectoryResult;

  beforeEach(async () => {
    tmpDir = await tmp.dir();
  });
  afterEach(async () => {
    await tmpDir.cleanup();
  });

  it("compiles", async () => {
    const tmpDir = await tmp.dir();

    shell.cp(fixtureFilePath, tmpDir.path);
    shell.exec(`node ${cliFilePath} ${tmpDir.path}/test.macaron`);

    const out = fs.readFileSync(`${tmpDir.path}/test.js`, "utf-8");
    expect(out).toMatchSnapshot();
  });

  it("compiles glob", async () => {
    const tmpDir = await tmp.dir();

    shell.cp(fixtureFilePath, tmpDir.path);
    shell.exec(`node ${cliFilePath} ${tmpDir.path}/*.macaron`);

    const out = fs.readFileSync(`${tmpDir.path}/test.js`, "utf-8");
    expect(out).toMatchSnapshot();
  });
});

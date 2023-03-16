import { cac } from "cac";
import { generateCode } from "./compiler/generateCode";
import * as fs from "fs";
import * as path from "path";
import { ProjectJSON } from "@uimix/node-data";

const cli = cac("uimix");

cli
  .command("<file>", "compile a UIMix file")
  .option("-o, --output <outfile>", `[string] output file path`)
  .action(
    async (
      filePath: string,
      options: {
        output?: string;
      }
    ) => {
      const data = fs.readFileSync(filePath, "utf8");
      const json = ProjectJSON.parse(JSON.parse(data));

      const outFiles = generateCode(json, []);

      const outPath = options.output ?? filePath;
      const outPathExt = path.extname(outPath);
      const basePath = outPathExt
        ? outPath.slice(0, -outPathExt.length)
        : outPath;

      for (const outFile of outFiles) {
        const outPath = `${basePath}${outFile.suffix}`;
        fs.writeFileSync(outPath, outFile.content, "utf8");
      }
    }
  );

cli.help();
cli.version("0.0.1");
cli.parse();

import { cac } from "cac";
import { generateCode } from "./compiler/generateCode";
import * as fs from "fs";
import * as path from "path";
import { ProjectJSON } from "@uimix/node-data";

const cli = cac("uimix");

cli
  .command("<file>", "compile a UIMix file")
  .option("-o, --output <outdir>", `[string] output directory`)
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

      const outDir = path.resolve(options.output ?? path.dirname(filePath));
      const outBaseName = path.basename(filePath, path.extname(filePath));

      for (const outFile of outFiles) {
        const outPath = path.join(outDir, outBaseName + outFile.suffix);
        fs.writeFileSync(outPath, outFile.content, "utf8");
      }
    }
  );

cli.help();
cli.version("0.0.1");
cli.parse();

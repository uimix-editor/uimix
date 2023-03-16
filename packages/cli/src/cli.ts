import { cac } from "cac";

const cli = cac("uimix");

cli
  .command("[file]", "compile a UIMix file")
  .option("-o, --output <outfile>", `[string] output file path`)
  .action(
    async (
      root: string | undefined,
      options: {
        output?: string;
      }
    ) => {
      console.log(options);
    }
  );

cli.help();
cli.version("0.0.1");
cli.parse();

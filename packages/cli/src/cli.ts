import { cac } from "cac";
import { startServer } from "./server.js";

const cli = cac("uimix");

cli
  .command("[root]", "start the editor server")
  .option("--port <port>", `[number] specify port`)
  .action(
    async (
      root: string | undefined,
      options: {
        port?: number;
      }
    ) => {
      startServer({
        projectPath: root ?? ".",
        port: options.port ?? 4000,
      });
    }
  );

cli.command("build [root]", "build the UIMix files").action(() => {
  console.log("TODO");
});

cli.help();
cli.version("0.0.1");
cli.parse();

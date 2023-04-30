import shell from "shelljs";
import { zip } from "zip-a-folder";

const name = `uimix-figma-plugin`;

async function run() {
  shell.mkdir(name);
  shell.cp("manifest.json", `${name}/`);
  shell.cp("-r", "dist", `${name}/`);
  await zip(name, `${name}.zip`);
  shell.rm("-rf", name);
}

run();

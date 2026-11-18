import { spawn } from "node:child_process";
import { join } from "node:path";
import process from "node:process";

const nextCli = join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
const nextProcess = spawn(process.execPath, [nextCli, "dev", ...process.argv.slice(2)], {
  stdio: ["inherit", "pipe", "pipe"],
});

let output = "";
let browserOpened = false;

function openBrowser(url) {
  const [command, args] =
    process.platform === "darwin"
      ? ["open", [url]]
      : process.platform === "win32"
        ? ["cmd", ["/c", "start", "", url]]
        : ["xdg-open", [url]];

  const browserProcess = spawn(command, args, { stdio: "ignore" });
  browserProcess.on("error", (error) => {
    console.error(`Impossible d’ouvrir le navigateur : ${error.message}`);
  });
  browserProcess.unref();
}

function forwardOutput(chunk, stream) {
  const text = chunk.toString();
  stream.write(text);
  output = `${output}${text}`.slice(-4096);

  const localUrl = output.match(/Local:\s*(https?:\/\/[^\s]+)/)?.[1];
  if (localUrl && !browserOpened) {
    browserOpened = true;
    openBrowser(localUrl);
  }
}

nextProcess.stdout.on("data", (chunk) => forwardOutput(chunk, process.stdout));
nextProcess.stderr.on("data", (chunk) => forwardOutput(chunk, process.stderr));
nextProcess.on("error", (error) => {
  console.error(`Impossible de démarrer Next.js : ${error.message}`);
  process.exitCode = 1;
});
nextProcess.on("exit", (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => nextProcess.kill(signal));
}

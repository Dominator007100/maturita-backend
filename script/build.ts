import { rm } from "fs/promises";

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("Skipping client build – using static public/ folder.");

  console.log("Building server...");
  // Nic nebuildíme – server běží přes tsx nebo přes tsc, ne přes esbuild
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});

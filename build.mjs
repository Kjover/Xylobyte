import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { minify } from "terser";

const input = readFileSync("src/index.html", "utf8");

const match = input.match(/<script>([\s\S]*?)<\/script>/);
let html = input;

if (match) {
  const js = await minify(match[1]);
  html = html.replace(match[1], js.code);
}

html = html
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/\s+/g, " ")
  .replace(/>\s+</g, "><")
  .trim();

const uri = "data:text/html," + encodeURIComponent(html);

mkdirSync("dist", { recursive: true });

writeFileSync("dist/index.html", html);
writeFileSync("dist/uri.txt", uri);

const bytes = Buffer.byteLength(uri);

console.log(`Built!`);
console.log(`URI size: ${bytes} / 3072 bytes`);

if (bytes <= 3072) {
  console.log("UNDER THE LIMIT!");
} else {
  console.log(`${bytes - 3072} bytes over the limit.`);
}
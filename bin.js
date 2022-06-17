#!/usr/bin/env node
require("source-map-support").install();

const argv = process.argv.splice(2);
const child_process = require("child_process");
const fs = require("fs");
const { resolve } = require("path");
const esbuild = require("esbuild");

const cwd = (...args) => resolve(process.cwd(), ...args);
const entryfile = argv[0];
const outfile = argv[1];
const isDev = !argv[2];
const isBuild = argv[2] === "--build";
const isBytecode = argv[2] === "--byte";

let worker;

function serve() {
  if (worker) {
    worker.kill(1);
    worker = null;
  }
  worker = child_process.spawn("node", [cwd(outfile)], {
    stdio: "inherit",
  });
}

const pkg = require("./package.json");

const builder = (enter, external, allowOverwrite) => {
  return esbuild.build({
    entryPoints: [enter],
    outfile,
    bundle: true,
    target: ["node16"],
    platform: "node",
    sourcemap: isDev,
    allowOverwrite: allowOverwrite,
    external: external || [],
    watch: isDev
      ? {
          onRebuild(error, result) {
            if (error) {
              console.log("__debug__", error);
            } else {
              serve();
            }
          },
        }
      : undefined,
  });
};

builder(
  cwd(entryfile),
  Object.keys({ ...pkg.devDependencies, ...pkg.dependencies })
).then(async (result) => {
  if (isDev) {
    serve();
  } else if (isBuild) {
    console.log("building release...");
    const { code } = await require("@vercel/ncc")(cwd(outfile), {
      cache: false,
      filterAssetBase: process.cwd(), // default
      minify: true, // default
      sourceMap: false, // default
      assetBuilds: false, // default
      quiet: false, // default
      debugLog: false, // default
    });
    fs.writeFileSync(cwd(outfile), code);
  } else if (isBytecode) {
    console.log("building bytenode...");
    const { code } = await require("@vercel/ncc")(cwd(outfile), {
      cache: false,
      filterAssetBase: process.cwd(), // default
      minify: true, // default
      sourceMap: false, // default
      assetBuilds: false, // default
      quiet: false, // default
      debugLog: false, // default
    });
    fs.writeFileSync(cwd(outfile), code);

    const code2 = fs.readFileSync(cwd(outfile)).toString();
    var JavaScriptObfuscator = require("javascript-obfuscator");
    const obfuscatorRes = JavaScriptObfuscator.obfuscate(code2, {
      compact: true,
      controlFlowFlattening: false,
      deadCodeInjection: false,
      debugProtection: false,
      debugProtectionInterval: 0,
      disableConsoleOutput: false,
      identifierNamesGenerator: "hexadecimal",
      log: false,
      numbersToExpressions: false,
      renameGlobals: false,
      selfDefending: false,
      simplify: true,
      splitStrings: false,
      stringArray: true,
      stringArrayCallsTransform: false,
      stringArrayCallsTransformThreshold: 0.5,
      stringArrayEncoding: [],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 1,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersParametersMaxCount: 2,
      stringArrayWrappersType: "variable",
      stringArrayThreshold: 0.75,
      unicodeEscapeSequence: false,
    });
    const obf = obfuscatorRes.getObfuscatedCode();
    fs.writeFileSync(cwd(outfile), obf);

    const bytenode = require("bytenode");
    let compiledFilename = bytenode.compileFile({
      filename: cwd(outfile),
      output: cwd(outfile) + "c",
    });
    fs.writeFileSync(cwd(outfile), `require("bytenode");`);

    // const bytenode = require("bytenode");
    // const byteCode = bytenode.compileCode(obf);
    // fs.writeFileSync(cwd(outfile) + "c", byteCode);

    builder(outfile, ["electron"], true).then(() => {
      const code3 = fs.readFileSync(cwd(outfile)).toString();
      const inputC = `require("./${outfile.split("/").pop()}c");`;
      const end = [code3, inputC].join("\n");
      fs.writeFileSync(cwd(outfile), end, null);
      console.log("builded bytenode.");
    });
  }
});

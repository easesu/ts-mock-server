import { resolve } from 'path';
import { RollupOptions } from "rollup";
import typescript from "@rollup/plugin-typescript";

const rollupConfig: RollupOptions = {
  input: resolve("./src/index.ts"),
  output: {
    format: "commonjs",
    dir: "./dist",
  },
  plugins: [typescript()],
};

export default rollupConfig;

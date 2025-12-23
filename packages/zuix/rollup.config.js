import path from "path"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import alias from "@rollup/plugin-alias"
import babel, { getBabelOutputPlugin } from "@rollup/plugin-babel"
import copy from "rollup-plugin-copy"
import regexReplace from "rollup-plugin-re"
import pkg from "./package.json"

const external = [
	...Object.keys(pkg.dependencies ?? {}),
	...Object.keys(pkg.devDependencies ?? {}),
	...Object.keys(pkg.peerDependencies ?? {}),
	"use-sync-external-store/shim",
]

const s3Prefix = "https://s.zigbang.com/zuix2/"
const imageAlias = "@static/image"

const extensions = [".ts", ".tsx", ".js", ".jsx"]

const commonBundleSetting = {
	input: "./src/index.ts",
	treeshake: false,
	external,
	plugins: [
		resolve({ extensions }),
		commonjs({ transformMixedEsModules: true }),
		babel({
			configFile: path.resolve(__dirname, "babel.config.npm.web.js"),
			extensions,
			babelHelpers: "runtime",
			skipPreflightCheck: true,
			include: ["src/**/*", "image/**/*"],
		}),
		alias({
			entries: [{ find: "~", replacement: path.resolve(__dirname, "./src") }],
		}),
	],
}

function resolveAppPath() {
	return {
		name: "resolveAppPath",
		generateBundle(options, bundle) {
			for (const b in bundle) {
				bundle[b].code = bundle[b].code.replace(
					/((?:import|export)\s+.*(['"])\S+)\.(android|ios)\.jsx?(\2)/g,
					"$1$4"
				)
			}
		},
	}
}

const bundleApp = (platform) => ({
	...commonBundleSetting,
	plugins: [
		resolve({ extensions: [`.${platform}.ts`, `.${platform}.tsx`, ".native.ts", ".native.tsx", ...extensions] }),
		...commonBundleSetting.plugins,
		resolveAppPath(),
		copy({
			targets: [
				{ src: "image/**/*", dest: "dist/image" },
				{ src: "src/**/*.css", dest: "dist/" },
			],
		}),
		regexReplace({
			patterns: [
				{
					test: /require\(\s*(["'])(\.\.\/)+image\/(\S+\.(png|jpg|gif))\1\s*\)/g,
					replace: `"${imageAlias}/$3"`,
				},
			],
		}),
	],
	output: [
		{
			dir: "dist/app",
			format: "es",
			preserveModules: true,
		},
	],
})

const bundleWeb = () => ({
	...commonBundleSetting,
	plugins: [
		regexReplace({
			patterns: [
				{
					test: /from\s*(["'])react-native\1/g,
					// eslint-disable-next-line quotes
					replace: 'from "react-native-web"',
				},
			],
		}),
		resolve({ extensions }),
		...commonBundleSetting.plugins,
		regexReplace({
			patterns: [
				{
					test: /require\(\s*(["'])(\.\.\/)+image\/(\S+\.(png|jpg|gif))\1\s*\)/g,
					replace: `"${s3Prefix}$3"`,
				},
				{
					test: /require\(\s*(["'])(@static\/)+image\/(\S+\.(png|jpg|gif))\1\s*\)/g,
					replace: `"${s3Prefix}$3"`,
				},
			],
		}),
	],
	output: [
		{
			dir: "dist/esm",
			format: "es",
			preserveModules: true,
			plugins: [
				getBabelOutputPlugin({
					presets: [
						[
							"@babel/preset-env",
							{
								loose: true,
								exclude: ["transform-typeof-symbol"],
								targets: { browsers: ["ie 11"] },
							},
						],
					],
				}),
			],
		},
		{
			dir: "dist/cjs",
			format: "cjs",
			preserveModules: true,
			exports: "auto",
		},
	],
})
export default [bundleApp("ios"), bundleApp("android"), bundleWeb()]

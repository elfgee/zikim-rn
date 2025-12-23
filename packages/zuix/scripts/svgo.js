#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const shell = require("shelljs")
const fs = require("fs")

shell.echo("../assets/svg")
shell.cd("../assets/svg")
shell.echo("svgo -f . -o .")
shell.exec("svgo -f . -o .")

let svgText = "export const SVG = () => null\n\n"
shell.ls("*.svg").forEach(function (file) {
	const str = shell
		.cat(file)
		.stdout.replace(/\n/gi, "")
		.replace(/<path /g, '<path vector-effect="non-scaling-stroke" ')
		.replace(/<rect /g, '<rect vector-effect="non-scaling-stroke" ')
		.replace(/<circle /g, '<circle vector-effect="non-scaling-stroke" ')
		.replace(/<ellipse /g, '<ellipse vector-effect="non-scaling-stroke" ')
		.replace(/white/g, "#FFFFFF")
	svgText += `SVG.${file.replace(".svg", "")} = '${str}'\n`
})

fs.writeFileSync("../../src/components/icon/svg.ts", svgText, { encoding: "utf-8", flag: "w" })

shell.exit(0)

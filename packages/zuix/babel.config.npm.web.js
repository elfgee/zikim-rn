module.exports = (api) => {
	api.cache(true)
	return {
		presets: [
			"@babel/preset-react",
			["@babel/preset-typescript", { isTSX: true, allExtensions: true, onlyRemoveTypeImports: false }],
		],
	}
}

import * as esbuild from 'esbuild'

const args = process.argv.filter((value, index) => index > 1 ? value : null)

// dev if no arg is passed
const isDev = !args[0] || (args[0] && args[0] === "dev") ? true : false

let buildStatus = {}

if (isDev === true) {
  buildStatus = await esbuild.build({
    entryPoints: ['index.ts'],
    bundle: true,
    outfile: 'ccommit.js',
    platform: 'node',
    packages: 'external',
    logLevel: 'debug'
  })
} else {
  buildStatus = await esbuild.build({
    entryPoints: ['index.ts'],
    bundle: true,
    outfile: 'ccommit.js',
    platform: 'node',
    packages: 'external',
    minify: true,
    logLevel: 'debug'
  })

}

console.table(buildStatus)

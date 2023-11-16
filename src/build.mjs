import esbuild from 'esbuild';

console.log("Building omni-extension-puppeteer....")
await esbuild.build({
    entryPoints: ['./extension.ts'],
    outdir: '../server/',
    bundle: true,
    platform: 'node',
    target: ['esNext'],
    format: 'esm',
    external: ['omni-sockets'],
    color: true
}).catch(() => process.exit(1))

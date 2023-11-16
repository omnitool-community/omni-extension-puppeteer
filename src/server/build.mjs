import esbuild from 'esbuild';

console.log("Building omni-extension-template....")
await esbuild.build({
    entryPoints: ['./extension.ts'],
    bundle: true,
    platform: 'node',
    target: ['esNext'],
    format: 'esm',
    external: ['omni-shared', 'omni-sockets'],
    color: true,
    outdir: '../../server/'
}).catch(() => process.exit(1))
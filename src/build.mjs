import esbuild from 'esbuild';

console.log("Building omni-extension-puppeteer....");

const ESM_REQUIRE_SHIM = `await(async()=>{let{dirname:e}=await import("path"),{fileURLToPath:i}=await import("url");if(typeof globalThis.__filename>"u"&&(globalThis.__filename=i(import.meta.url)),typeof globalThis.__dirname>"u"&&(globalThis.__dirname=e(globalThis.__filename)),typeof globalThis.require>"u"){let{default:a}=await import("module");globalThis.require=a.createRequire(import.meta.url)}})();`;

await esbuild.build({
    entryPoints: ['./extension.ts'],
    outdir: '../server/',
    bundle: true,
    platform: 'node',
    target: ['esNext'],
    format: 'esm',
    external: ['omni-sockets'],
    color: true,
    banner: {
        js: ESM_REQUIRE_SHIM
    }
}).catch((error) => {
    console.error('Build failed with error:', error);
    process.exit(1);
});

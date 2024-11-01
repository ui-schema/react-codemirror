import path from 'path'
import { packer, webpack } from 'lerna-packer'
import { babelTargetsLegacyCjsFirst } from 'lerna-packer/packer/babelEsModules.js'
import {
    makeModulePackageJson,
    copyRootPackageJson,
    transformerForLegacyCjsFirst
} from 'lerna-packer/packer/modulePackages.js'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const babelTargetsEsmCjs = [
    {
        distSuffix: '',
        args: [
            '--env-name', 'cjs', '--no-comments', // '--copy-files', '--no-copy-ignored',
            // note: even with defined extension, the extensions of `import` are still `.js`
            //       which would break relative imports, as they then import ESM instead of the CJS file;
            //       thus added `babel-plugin-replace-import-extension` for the CJS environment
            //       it's not validated how it behaves for external imports for third-party modules,
            //       which can be problematic in other projects,
            //       here `import` to 3rd party modules are done purely by package name
            '--out-file-extension', '.cjs',
            '--extensions', '.ts', '--extensions', '.tsx', '--extensions', '.js', '--extensions', '.jsx',
            '--ignore', '**/*.d.ts',
            '--ignore', '**/*.test.tsx', '--ignore', '**/*.test.ts', '--ignore', '**/*.test.js',
        ],
    },
    {
        distSuffix: '',
        args: [
            '--no-comments',
            '--extensions', '.ts', '--extensions', '.tsx', '--extensions', '.js', '--extensions', '.jsx',
            '--ignore', '**/*.d.ts',
            '--ignore', '**/*.test.tsx', '--ignore', '**/*.test.ts', '--ignore', '**/*.test.js',
        ],
    },
]

/**
 * @todo this shouldn't be needed, or not working or used by TS/node at all,
 *       added for fallbacks for the moment,
 *       it seems for `cjs` fallbacks, `main` can still be used if using `.cjs` extension (like in @codemirror/view),
 *       while the Node.js spec says "`main` can be used as fallback with `type: module`, it will be interpreted as esm (with .js extension)",
 *       - `main` is used for "directory" imports/require, thus wanted to keep it for such legacy projects
 *       - as Node.js with ESM support would use the `exports`, it should be better to go the "main as .cjs" way
 *       - as Node.js with ESM support would use the `exports` in the root directory, the `exports` below will never have any effect when importing the package,
 *         yet it may be used in the built bundle and relative imports inside of it,
 *         which only was observed with jest and ESM,
 *         as `export * from './useExtension/index.js';` in `/index.js` does not follow the `exports` defined in the nested `package.json`,
 *         it should fail if Node.js really uses these nested `package.json`, yet it works correctly,
 *         without `exports` all files are available for imports
 *       - the same `main`/`module` pattern is used in the `package.json` of `kit-codemirror`
 */
const transformerForEsmCjs = () => {
    return {
        sideEffects: false,
        type: 'module',
        main: './index.cjs',
        module: './index.js',
        /*exports: {
            types: './index.d.ts',
            import: './index.js',
            require: './index.cjs',
        },*/
        // this should be enough or even better, to force ESM instead of CJS fallbacks:
        /*
        sideEffects: false,
        type: 'module',
        main: './index.js',
        types: './index.d.ts'
        */
    }
}

packer({
    apps: {
        demo: {
            root: path.resolve(__dirname, 'packages', 'demo'),
            template: path.resolve(__dirname, 'packages', 'demo/public/index.html'),
            contentBase: path.resolve(__dirname, 'packages', 'demo/public'),// dev-server
            port: 4203,
            main: path.resolve(__dirname, 'packages', 'demo/src/index.tsx'),
            dist: path.resolve(__dirname, 'dist', 'demo'),
            devServer: {
                client: {
                    overlay: false,
                    progress: false,
                },
            },
            publicPath: '/',
            plugins: [
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
                }),
            ],
            aliasPackagesBuild: 'production',
        },
    },
    packages: {
        // the keys are the commonjs names that is applied to externals
        // this is the same as `@babel/plugin-transform-modules-commonjs` applies
        kitCode: {
            name: '@ui-schema/kit-codemirror',
            root: path.resolve(__dirname, 'packages', 'kit-codemirror'),
            entry: path.resolve(__dirname, 'packages', 'kit-codemirror/src/'),
            babelTargets: babelTargetsEsmCjs,
        },
        materialCode: {
            name: '@ui-schema/material-code',
            root: path.resolve(__dirname, 'packages', 'material-code'),
            entry: path.resolve(__dirname, 'packages', 'material-code/src/'),
            babelTargets: babelTargetsLegacyCjsFirst,
        },
    },
}, __dirname, {
    webpackStatsConfig: {
        modulesSpace: 200,
        orphanModules: true,
        exclude: [
            '@lezer',
            '@codemirror',
            '@babel',
            '@emotion',
        ],
    },
    afterEsModules: (packages, pathBuild) => {
        const legacyCjsEsm = {materialCode: packages.materialCode}
        const strictEsmCjs = {kitCode: packages.kitCode}
        return Promise.all([
            makeModulePackageJson(transformerForLegacyCjsFirst)(legacyCjsEsm, pathBuild),
            makeModulePackageJson(transformerForEsmCjs)(strictEsmCjs, pathBuild),
            copyRootPackageJson()(packages, pathBuild),
        ]).then(() => undefined)
    },
})
    .then(([execs, elapsed]) => {
        if(execs.indexOf('doServe') !== -1) {
            console.log('[packer] is now serving (after ' + elapsed + 'ms)')
        } else {
            console.log('[packer] finished successfully (after ' + elapsed + 'ms)', execs)
            process.exit(0)
        }
    })
    .catch((e) => {
        console.error('[packer] finished with error(s)', e)
        process.exit(1)
    })


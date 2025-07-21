import path from 'path'
import { packer, webpack } from 'lerna-packer'
import {
    copyRootPackageJson,
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
            '--ignore', '**/*.mock.ts', '--ignore', '**/*.mock.js',
        ],
    },
    {
        distSuffix: '',
        args: [
            '--no-comments',
            '--extensions', '.ts', '--extensions', '.tsx', '--extensions', '.js', '--extensions', '.jsx',
            '--ignore', '**/*.d.ts',
            '--ignore', '**/*.test.tsx', '--ignore', '**/*.test.ts', '--ignore', '**/*.test.js',
            '--ignore', '**/*.mock.ts', '--ignore', '**/*.mock.js',
        ],
    },
]

const babelTargetsCjsEsm = [
    {
        distSuffix: '',
        args: [
            '--env-name', 'cjs', '--no-comments', // '--copy-files', '--no-copy-ignored',
            '--out-file-extension', '.cjs',
            '--extensions', '.ts', '--extensions', '.tsx', '--extensions', '.js', '--extensions', '.jsx',
            '--ignore', '**/*.d.ts',
            '--ignore', '**/*.test.tsx', '--ignore', '**/*.test.ts', '--ignore', '**/*.test.js',
            '--ignore', '**/*.mock.ts', '--ignore', '**/*.mock.js',
        ],
    },
    {
        distSuffix: '/esm',
        // distSuffix: '', // for mjs it would need a distSuffix
        args: [
            // '--env-name', 'mjs',
            // '--out-file-extension', '.mjs',
            '--no-comments',
            '--extensions', '.ts', '--extensions', '.tsx', '--extensions', '.js', '--extensions', '.jsx',
            '--ignore', '**/*.d.ts',
            '--ignore', '**/*.test.tsx', '--ignore', '**/*.test.ts', '--ignore', '**/*.test.js',
            '--ignore', '**/*.mock.ts', '--ignore', '**/*.mock.js',
        ],
    },
]

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
            babelTargets: babelTargetsCjsEsm,
            // babelTargets: babelTargetsLegacyCjsFirst,
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
    afterEsModules: (packages, pathBuild, isServing) => {
        if(isServing) return
        return Promise.all([
            copyRootPackageJson(({packageJson, package: packageId}) => {
                packageJson = {...packageJson}
                if(packageId === 'kitCode') {
                    // for this package we need `type: module`, as `@codemirror` has it defined,
                    // which makes it less backwards compatible than other ui-schema packages.
                    // without `type`, it produces TS issues:
                    //
                    // TS2345: Argument of type
                    // import('node_modules/@codemirror/state/dist/index').AnnotationType<boolean>
                    // is not assignable to parameter of type
                    // import('node_modules/@codemirror/state/dist/index').AnnotationType<boolean>
                    // The types returned by of(...) are incompatible between these types.
                    // Type
                    // import('node_modules/@codemirror/state/dist/index').Annotation<boolean>
                    // is not assignable to type
                    // import('node_modules/@codemirror/state/dist/index').Annotation<boolean>
                    // . Two different types with this name exist, but they are unrelated.
                    // Types have separate declarations of a private property _isAnnotation
                } else {
                    delete packageJson.type
                }
                return packageJson
            })(packages, pathBuild),
        ]).then(() => undefined).catch((e) => {
            console.error('ERROR after-es-mod', e)
            return Promise.reject(e)
        })
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


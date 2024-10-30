const path = require('path');
const {packer, webpack} = require('lerna-packer');
const {babelTargetsLegacyCjsFirst} = require('lerna-packer/packer/babelEsModules');
const {makeModulePackageJson, copyRootPackageJson, transformerForLegacyCjsFirst} = require('lerna-packer/packer/modulePackages');

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
            babelTargets: babelTargetsLegacyCjsFirst,
        },
        materialCode: {
            name: '@ui-schema/material-code',
            root: path.resolve(__dirname, 'packages', 'material-code'),
            entry: path.resolve(__dirname, 'packages', 'material-code/src/'),
            babelTargets: babelTargetsLegacyCjsFirst,
        },
    },
}, __dirname, {
    afterEsModules: (packages, pathBuild) => {
        return Promise.all([
            makeModulePackageJson(transformerForLegacyCjsFirst)(packages, pathBuild),
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


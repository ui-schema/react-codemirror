
const path = require('path');

module.exports = {
    resolve: {
        alias: {
            '@ui-schema/kit-codemirror': path.resolve(__dirname, './kit-codemirror/src'),
'@ui-schema/material-code': path.resolve(__dirname, './material-code/src'),

        }
    }
}
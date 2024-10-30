import type { Config } from '@jest/types'

const packages: string[] = ['kit-codemirror', 'material-code']

const base: Partial<Config.InitialOptions> = {
    /*transformIgnorePatterns: [
        'node_modules/?!(@ui-schema)',
    ],*/
    /*transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },*/
    moduleNameMapper: {
        '^@ui-schema/material-code(.*)$': '<rootDir>/packages/material-code/src$1',
        '^@ui-schema/kit-codemirror(.*)$': '<rootDir>/packages/kit-codemirror/src$1',
    },
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node',
    ],
    coveragePathIgnorePatterns: [
        '(tests/.*.mock).(jsx?|tsx?|ts?|js?)$',
        '.*.(test|spec).(js|ts|tsx)$',
        '<rootDir>/packages/demo',
    ],
    testPathIgnorePatterns: [
        '<rootDir>/dist',
        '<rootDir>/packages/.+/build',
    ],
    watchPathIgnorePatterns: [
        '<rootDir>/.idea',
        '<rootDir>/.git',
        '<rootDir>/dist',
        '<rootDir>/node_modules',
        '<rootDir>/packages/.+/node_modules',
        '<rootDir>/packages/.+/build',
    ],
    modulePathIgnorePatterns: [
        '<rootDir>/dist',
        '<rootDir>/packages/.+/build',
    ],
}

const config: Config.InitialOptions = {
    ...base,
    // todo: check why `transformIgnorePatterns`, combined with multi-projects/lerna 0.5.3 upgrade, throws `Reentrant plugin detected trying to load ....babel-plugin-jest-hoist/build/index.js`
    /*transformIgnorePatterns: [
        'node_modules/?!(@ui-schema)',
    ],*/
    verbose: true,
    collectCoverage: true,
    projects: [
        ...packages.map(pkg => ({
            displayName: 'test-' + pkg,
            ...base,
            moduleDirectories: ['node_modules', '<rootDir>/packages/' + pkg + '/node_modules'],
            //moduleDirectories: ['node_modules', '<rootDir>/ui-schema/node_modules', '<rootDir>/ds-material/node_modules'],
            // todo: check why `transformIgnorePatterns`, combined with multi-projects/lerna 0.5.3 upgrade, throws `TypeError: /node_modules/jest-runner-eslint/build/runner/index.js: node_modules/@ampproject/remapping/dist/remapping.umd.js: _remapping(...) is not a function`
            /*transformIgnorePatterns: [
                'node_modules/?!(@ui-schema)',
            ],*/
            //testEnvironmentOptions: {},
            testMatch: [
                '<rootDir>/packages/' + pkg + '/src/**/*.(test|spec).(js|ts|tsx)',
                '<rootDir>/packages/' + pkg + '/tests/**/*.(test|spec).(js|ts|tsx)',
            ],
        })),
    ],
    coverageDirectory: '<rootDir>/coverage',
}

export default config

import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '^keytar$': '<rootDir>/src/commands/__tests__/__mocks__/keytar.ts'
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            useESM: true,
            tsconfig: 'tsconfig.json'
        }],
    },
    transformIgnorePatterns: [
        'node_modules/(?!(execa|.*)/)'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleDirectories: ['node_modules', 'src/commands/__tests__/__mocks__']
};

export default config; 
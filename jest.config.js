const nextJest = require('next/jest')

const createJestConfig = nextJest({
    dir: './'
})

const customJestConfig = {
    moduleDirectories: ['node_modules', '<rootDir>/'],
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        "^@clients/(.*)$": "<rootDir>/sources/utils/clients/$1",
        "^@controllers/(.*)$": "<rootDir>/sources/controllers/$1",
        "^@test/(.*)$": "<rootDir>/test/commons/$1"
    }
}

module.exports = createJestConfig(customJestConfig)

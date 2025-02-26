module.exports = {
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'],
    testTimeout: 10000,
    verbose: true,
    silent: true, // Suppress console logs during tests
    // Ignore node_modules and config directories
    testPathIgnorePatterns: [
        '/node_modules/',
        '/src/config/'
    ],
    // Directory where Jest should look for test files
    roots: [
        '<rootDir>/src'
    ]
};
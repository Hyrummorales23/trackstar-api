module.exports = {
    testEnvironment: 'node',
    collectCoverageFrom: [
        'controllers/**/*.js',
        'models/**/*.js',
        'routes/**/*.js',
        '!**/node_modules/**',
        '!**/coverage/**'
    ],
    coverageDirectory: 'coverage',
    verbose: true,
    testTimeout: 10000, // Increase timeout to 10 seconds
    forceExit: true, // Force Jest to exit after tests
    detectOpenHandles: true // Detect open handles
};
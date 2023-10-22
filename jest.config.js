module.exports = {
	testMatch: ['**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)'],
	transform: {
		'^.+\\.(js|jsx|ts|tsx)$': require.resolve('ts-jest'),
	},
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	testPathIgnorePatterns: ['/node_modules/', '\\.tsx$'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};

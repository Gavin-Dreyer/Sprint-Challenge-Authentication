const request = require('supertest');

const server = require('./server');

it('should set db environment to test', function() {
	expect(process.env.DB_ENV).toBe('testing');
});

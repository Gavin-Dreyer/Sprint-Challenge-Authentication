const request = require('supertest');
const bcrypt = require('bcryptjs');

const server = require('./server');
const db = require('../database/dbConfig');
const { add } = require('../auth/users-model');

it('should set db environment to test', function () {
	expect(process.env.DB_ENV).toBe('testing');
});

describe('server', function () {
	describe('GET /', function () {
		it('should return json formatted response', function () {
			return request(server)
				.get('/api/auth/users')
				.then(res => {
					expect(res.type).toMatch(/json/i);
				});
		});
	});
});

describe('server', function () {
	describe('REGISTER /api/auth/register', function () {
		beforeEach(async () => {
			await db('users').truncate();
		});
		it('should return status 201', function () {
			return request(server)
				.post('/api/auth/register')
				.send({ username: 'student3' })
				.send({ password: 'pass' })
				.expect(201, {
					message: 'successfully registered'
				});
		});

		it('should not register a user', function () {
			return request(server)
				.post('/api/auth/register')
				.send({ username: 'student3' })
				.send({ passwordd: 'pass' })
				.expect(500, {});
		});
	});
});

describe('server', function () {
	describe('LOGIN /api/auth/login', function () {


		beforeEach(async () => {
			await db('users').truncate();
			return request(server)
				.post('/api/auth/register')
				.send({ username: 'student3' })
				.send({ password: 'pass' })
			// .then(res => {
			// 	let token = res
			// 	console.log(token)
			// })
		});

		it('should be expecting json', function () {
			return request(server)
				.post('/api/auth/login')
				.then(res => {
					expect(res.type).toMatch(/json/i);
				});
		});
		it('expects there to be a body', function () {
			return request(server)
				.post('/api/auth/login')
				.send({ username: 'student3', password: 'pass' })
				.then(res => {
					expect(res.body).toBeDefined();
				});
		});

		it('expects student be logged in correctly', async function () {
			return request(server)
				.post('/api/auth/login')
				.send({ username: 'student3', password: 'pass' })
				.then(res => {
					expect(res.body.message).toBe(
						"Welcome student3"
					)
					expect(res.status).toBe(
						200
					)
				});
		});
	});
});


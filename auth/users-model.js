const db = require('../database/dbConfig');

module.exports = {
	add,
	findBy,
	find
};

function add(body) {
	return db('users').insert(body);
}

function findBy(filter) {
	return db('users').where(filter);
}

function find() {
	return db('users');
}

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = require('express').Router();
const Users = require('./users-model');
const restricted = require('./authenticate-middleware');

router.post('/register', (req, res) => {
	let user = req.body;
	const hash = bcrypt.hashSync(user.password, 12);
	user.password = hash;

	Users.add(user)
		.then(uInfo => {
			res.status(201).json({ message: 'successfully registered' });
		})
		.catch(error => {
			res.status(500).json({ message: 'error when registering' });
		});
});

router.post('/login', (req, res) => {
	let { username, password } = req.body;

	Users.findBy({ username })
		.first()
		.then(user => {
			if (user && bcrypt.compareSync(password, user.password)) {
				const token = getJwtToken(user.username, user.password);

				res.status(200).json({ token, message: `Welcome ${user.username}` });
			} else {
				res.status(401).json({ message: 'Invalid Credentials' });
			}
		})
		.catch(error => {
			console.log(error);
			res.status(500).json(error);
		});
});

router.get('/users', restricted, (req, res) => {
	Users.find()
		.then(users => {
			res.json(users);
		})
		.catch(err => res.send(err));
});

function getJwtToken(username, password) {
	const payload = {
		username,
		password
	};

	const secret = process.env.JWT_SECRET || 'it is secret! it is safe!';

	const options = {
		expiresIn: '1d'
	};

	return jwt.sign(payload, secret, options);
}

module.exports = router;

const router = require('express').Router();
const chalk = require('chalk');
const fs = require('fs');
const path = require('path')
const moment = require('moment')
const cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true
});
const multer = require('multer');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'private/temp/')
	},
	filename: function (req, file, cb) {
		req.session.save(() => {
			req.session.image_url = 'private/temp/' + req.session.user_id + path.extname(file.originalname)
		});
		cb(null, req.session.user_id + path.extname(file.originalname))
	}
})

const upload = multer({ storage: storage })

// const upload = multer({ dest: 'private/temp/', })

const { Users } = require('../../models');

router.post('/login', async function (req, res) {
	try {
		//find a user with the given email
		const dbUserData = await Users.findOne({ where: { email: req.body.email } });

		//if there is no user with that email send back a bad request
		if (!dbUserData) {
			res.status(400).json({ message: 'Incorrect email or password. Please try again!' });
			return;
		}

		//go to database helper function and check hashed password against stored hashed
		const validPassword = await dbUserData.checkPassword(req.body.password);

		//if the entered password was invalid then send back a bad request error
		if (!validPassword) {
			res.status(400).json({ message: 'Incorrect email or password. Please try again!' });
			return;
		}

		let user = dbUserData.get({ plain: true })

		req.session.save(() => {
			req.session.loggedIn = true;
			req.session.username = user.username.toUpperCase().trim();
			req.session.user_id = user.id;
			req.session.image_url = user.image_url;
			res.status(200).json({ message: 'You are now logged in!' });
		});

	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

router.post('/register', async function (req, res) {
	try {
		//check database for a user that contains this email
		const dbEmailData = await Users.findOne({ where: { email: req.body.email } });

		//if a user with that email is found then send back that email already exsists
		if (dbEmailData) {
			res.status(400).json({
				problem: 'email',
				message: 'Account with this email already exsists'
			});
			return;
		}

		//check database for a user that contains this username
		const dbUsernameData = await Users.findOne({ where: { username: req.body.username } });

		//if that username is found in the database then return that username is taken
		if (dbUsernameData) {
			res.status(400).json({
				problem: 'username',
				message: 'Account with this username already exsists'
			});
			return;
		}

		//creates a new user in database that can be logged in from
		const dbUserData = await Users.create({
			username: req.body.username.trim(),
			email: req.body.email.toLowerCase().trim(),
			password: req.body.password.trim(),
			image_url: '/assets/pfp/default.png' //default image sets to default while we wait to get the url from cloudinary
		}, {
			plain: true
		});

		console.log(chalk.bgGreen("SUCCESS: "), chalk.magenta(dbUserData.username), "account created")

		req.session.save(() => {
			req.session.loggedIn = true;
			req.session.username = dbUserData.username.toUpperCase().trim();
			req.session.user_id = dbUserData.id;
			req.session.image_url = dbUserData.image_url;
			res.status(200).json({ message: 'account created' });
		});

	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

router.post('/image', upload.single("avatar"), function (req, res) {
	console.log(chalk.bgGreen('SUCCESS: ') + `created file ${req.session.user_id}.png`)
	console.log(chalk.bgGreen('SUCCESS: ') + `${req.session.user_url}`)
	try {
		cloudinary.uploader.upload(`./private/temp/${dbUserData.id}.png`,
			function (error, result) {
				if (error) {
					console.log(chalk.bgRed(`ERROR: Created user account, Failed to upload image "${dbUserData.id}.png" to cloudinary`))
					console.log(chalk.bgRed(`ERROR: ${error}`))
				} else {
					Users.update({
						image_url: result.url
					}, {
						where: req.session.user_id
					}).then(response => {
						console.log(chalk.bgRed(`ERROR: response: ${response}`))
						// console.log(chalk.bgRed(`ERROR: Image uploaded to cloudinary, Failed to update user id: ${dbUserData.id}'s image_url=${result.url}`))
					})
				}
				console.log(result, error);
			});
	} catch (err) {
		console.log(chalk.bgRed("ERROR"), 'file upload failed')
		res.status(500).send(err);
	}
});

router.post('/logout', function (req, res) {
	//if there is a existing session then it will allow them to try and destroy the session
	if (req.session.loggedIn) {
		req.session.destroy(() => {
			res.status(204).end();
		});
	} else {
		res.status(404).end();
	}
});

module.exports = router;
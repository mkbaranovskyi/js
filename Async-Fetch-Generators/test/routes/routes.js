const express = require('express')
const fs = require('fs')
const {
	check,
	validationResult,
	matchedData
} = require('express-validator')
const multer = require('multer')
const upload = multer({
	dest: 'uploads/'
})
const pipeline = require('util').promisify(require('stream').pipeline)

const router = express.Router()

router.get('/', (req, res, next) => {
	res.render('index')
})

router.post('/',
	// validators and sanitizers middleware
	// [
	// 	check('message')
	// 	.isLength({
	// 		min: 1
	// 	})
	// 	.withMessage('Message is required')
	// 	.trim(),
	// 	check('email')
	// 	.isEmail()
	// 	.withMessage('That email doesn‘t look right')
	// 	.bail()
	// 	.trim()
	// 	.normalizeEmail()
	// ], 
	upload.single('img'),
	(req, res, next) => {
		console.log(req.file)
		// pipeline(req.file, fs.createWriteStream('output'))
		// await pipeData(req.body, fs.createWriteStream(__dirname + '/output'))
	})


async function pipeData(origin, dest) {
	try {
		await pipeline(origin, dest)
	} catch (err) {
		origin.destroy()
		dest.destroy()
		console.error(err)
	}
}

module.exports = router
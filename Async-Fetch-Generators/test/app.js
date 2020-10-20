const http = require('http')
const express = require('express')
const validator = require('validator')

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 5000

app.use([
	// body-parsers
	express.json(),
	express.urlencoded({
		extended: false
	}),
	// static folder
	express.static(__dirname),
	// routes
	('/', require('./routes/routes')),
	// error handling middleware: we'll only get here if anything else doesn't respond first
	(req, res, next) => {
		res.status(404).send("Sorry can't find that!")
	},
	(err, req, res, next) => {
		console.error(err.stack)
		res.status(500).send('Something broke!')
	}
])

server.listen(PORT, () => console.log(`The app is running on port `, PORT))
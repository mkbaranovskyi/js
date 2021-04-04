class Server {
	constructor(ip, port) {
		this.ip = ip
		this.port = port
	}

	get url() {
		return `https://${this.ip}:${this.port}`
	}
}

// Amazon servers
function aws(server) {
	server.type = 'aws'
	server.awsInfo = function () {
		return server.url
	}
	// Don'e forger to return the original object/function!
	return server
}

// Microsoft servers
function azure(server) {
	server.type = 'azure'
	server.port += 500
	return server
}

const awsServer = new Server('155.34.75.34', 1000)
aws(awsServer) // wrapped in a decorator
console.log(awsServer.type)
console.log(awsServer.awsInfo()) // new decorator functionality works

const azureServer = azure(new Server('46.5.53.7', 2000))
console.log(azureServer.type)
console.log(azureServer.url) // old original server functionality works as well

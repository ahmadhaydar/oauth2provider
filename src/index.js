const app = require('./app');
const http = require('http');
var server = http.createServer(app);
require('dotenv').config({ path: './.env' });
const mongoose = require('./db/connectDB');
const port = 8080;
server.listen(port, function () {
    console.log("Server running at port " + port);
});

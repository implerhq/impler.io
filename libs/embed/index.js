/* eslint-disable no-console */
var http = require('http');
var fs = require('fs');
const path = require('path');
let embedUmd = fs.readFileSync(path.join(__dirname, 'dist/embed.umd.min.js'));
let embedEs5 = fs.readFileSync(path.join(__dirname, 'dist/embed.es5.min.js'));

const DEFAULT_PORT = 4701;
const PORT = process.env.PORT || DEFAULT_PORT;

http
  .createServer(function (req, res) {
    if (req.url === '/embed.umd.min.js') res.end(embedUmd);
    else if (req.url === '/embed.es5.min.js') res.end(embedEs5);
    else res.end('Not found');
  })
  .on('listening', () => {
    console.log(`Listening on port ${PORT}`);
  })
  .on('error', (err) => {
    console.error(err);
  })
  .listen(process.env.PORT || PORT);

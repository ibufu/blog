const http = require('http');
const shell = require("shelljs");

const server = http.createServer();

server.on('request', function(req, res) {
    shell.exec('cd /root/blog && git pull origin master && hexo g');
    res.end();
});

server.listen(8181);
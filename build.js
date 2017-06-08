const http = require('http');
const shell = require("shelljs");

const server = http.createServer();

server.on('request', function(req, res) {
    shell.exec(`cd /root/blog
        && git fetch
        && git reset --hard origin/master
        && git pull origin master
        && npm i
        && hexo clean
        && hexo g`);
    res.end('success');
    console.log(`${new Date().toString()}更新成功`)
});

server.listen(8181);
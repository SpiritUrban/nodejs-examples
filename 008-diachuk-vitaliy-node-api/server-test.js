import http from 'http';
var server = http.createServer((a,b)=>{
    b.end('yo')
});
server.listen(80);

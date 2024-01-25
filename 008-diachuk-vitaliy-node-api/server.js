
import app from './app/app.js';
import http from 'http';
import 'dotenv/config';

const port = process.env.PORT || '3005';
console.log('port: ', port);
const server = http.createServer(app);
server.listen(port);




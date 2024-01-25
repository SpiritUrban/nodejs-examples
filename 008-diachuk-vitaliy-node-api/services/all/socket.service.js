import { log, rand_str_long, pro, lex, } from '../../my_modules/stuff.js';
import userService from './user.service.js';
import moment from 'moment';

let allClients = [];
global.allClients = allClients;

setInterval(() => {
    allClients.forEach(client => {
        // 4. session expired?
        const now = moment();
        const thrownAway = moment(client.user?.shouldLogout) < now;
        // console.log(moment(client.user?.shouldLogout).format(" DD /hh:mm:ss"), '<', now.format("DD / hh:mm:ss"), moment(client.user?.shouldLogout) < now);
        // console.log(client.user?.shouldLogout, '<', now.format("DD / hh:mm:ss"), moment(client.user?.shouldLogout) < now);
        if (thrownAway) {
            throwAway(client);
            // await User.findOneAndUpdate({ _id: admin._id }, { auth_token: 'Destroyed' });
            client.emit('session-expired', {});
        };
    });
}, 10000);

function throwAway(client) {
    var i = allClients.indexOf(client);
    allClients.splice(i, 1);
};


class Service {
    constructor() { }

    async connection(client) {
        console.log('CONNECT');
        client.emit('userMessage', 'Connected');
        allClients.push(client);
        //fs.openSync('./buff/'+ client.id, 'w');
        client.emit('onConnect', 'Connected');
    }

    async disconnection(client) {
        console.log('DISCONNECT');
        throwAway(client);
    }

    async identify(client, msg) {
        // 1. token missed?
        const tokenMissed = !msg?.auth_token && client?.user?.auth_token;
        if (tokenMissed) throw 'Missed the "auth_token"'; // ...................... must be "msg.auth_token"
        // 2. token actual
        const tokenActual = client?.user?.auth_token == msg.auth_token; // ........ Compare tokens (back n front)
        if (!tokenActual) client.user = await userService.getByToken(msg.auth_token); // .............. identify the user & set user to Socket.io 
        // 3. session is lost?
        if (!client.user) {
            // throwAway(client);
            client.emit('session-is-lost', {}); // ..................... rapport about Wrong Code
            throw 'Can\'t find user by "auth_token " ' + msg.auth_token; // Fail !!!
        };
        return { ok: true }
    }

};

export default new Service();
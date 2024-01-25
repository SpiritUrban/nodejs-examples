import moment from 'moment';
import fs from 'fs';
const fsPromises = fs.promises;
import appEvents from '../app-events/index.js';

// pathes
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const self = {

    // 1
    log: console.log,
    // log: (...args) => self.pro(...args),

    //
    // lex: (...args) => self.logWriteFile('exceptions', self.dateFormat(), ...args),

    lex: (...args) => {
        console.error('lex ERROR: ', ...args);
        self.logWriteFile('exceptions', self.dateFormat(), ...args)
    },


    pro: (...args) => self.logWriteFile('processes', self.dateFormat(), ...args),

    // pro: (...args) => {
    //     console.log('!!!!!!!!!!! pro', args)
    // },

    // 2
    logArr: (arr) => { arr.forEach(one => log(one)) },

    //
    write: async (...args) => {
        self.ensureFolder('./logs/exceptions/');
        const logFile = `./logs/exceptions/${self.dateFormat()}.txt`
        args.forEach(arg => fs.appendFile(logFile, JSON.stringify(arg, null, "\t") + '\n\n', _ => 0));
    },

    //
    logWrite: async (...args) => {
        self.ensureFolder('./logs/exceptions/');
        const logFile = `./logs/exceptions/${self.dateFormat()}.txt`
        args.forEach(arg => fs.appendFile(logFile, JSON.stringify(arg, null, "\t") + '\n\n', _ => 0));
    },

    //
    logWriteFile: async (...args) => {
        const path = args.shift();
        const fname = args.shift();
        const fullPath = `./logs/${path}`;
        const logFile = `${fullPath}/${fname}.txt`;
        self.ensureFolder(fullPath);
        appEvents.emit('push-sys-message', { channel: 1, arr: args }); // ....................................................................................... push messages by Socket.io  

        // appEvents.emit('push-sys-message', {channel: 2, text: ''}); // ....................................................................................... push messages by Socket.io  
        args.forEach(arg => {
            // fs.appendFile(logFile, JSON.stringify(arg, null, "\t") + '\n\n', _ => 0);
            // appEvents.emit('push-sys-message', {channel: 2, text: arg}); // ....................................................................................... push messages by Socket.io  
        });
    },

    // 3
    canAccess: async (path) => {
        return new Promise((resolve, reject) => {
            try {
                fsPromises.access(path, fs.constants.R_OK | fs.constants.W_OK)
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            } catch (error) {
                reject('Err: Crash in "canAccess()" function')
            }
        })
    },

    // 4
    friendlyRandon: (n) => {
        let rand = '';
        for (let i = 0; i < n; i++) {
            const num = self.randInt(9);
            rand += num + '' + num;
        }
        return rand
    },

    // 5
    friendlyPassword: async () => `${await self.randWord()}-${await self.randWord()}-${self.friendlyRandon(2)}`,

    // 6
    randWord: async () => {
        const amount = 2005 - 1; // amount in positive-words.txt
        const words = await fsPromises.readFile(__dirname + '/positive-words.txt', 'utf-8');
        const wordsArr = words.split('\r\n');
        const rand = self.randInt(amount);
        return wordsArr[rand]
    },

    // 7
    randInt: (n) => Math.round(Math.random() * n),

    // 8
    // Random string with 10 chars: 's5xoxqnit4'
    rand_str: () => {
        return Math.random().toString(36).substr(2); // remove `0.`
    },

    // 9
    // Random string with 40 chars: 's5xoxqnit4s5xoxqnit4s5xoxqnit4s5xoxqnit4'
    rand_str_long: () => {
        return self.rand_str() + self.rand_str() + self.rand_str() + self.rand_str();
    },

    // 10
    parseQuery: (queryString) => {
        var query = {};
        var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        return query;
    },

    // 11
    getRandom: () => Math.round(Math.random() * 1000),

    // 12
    // data in object
    currentTime: () => {
        // Time Data Now
        let now = moment(); // add this 2 of 4
        var date = new Date();
        const current = {};
        current.date = now;
        current.monthName = now.format('MMMM');
        current.year = date.getFullYear(); //now.format('YYYY'); // or .year();
        current.monthNumber = date.getMonth() + 1; // now.format('M');
        current.hour = date.getHours();
        current.minute = date.getMinutes();
        current.day = date.getDate();
        // log( current );
        return current
    },

    // 13 
    // get time in milliseconds since the unix epoch
    millisecondsPoint: () => {
        const now = new Date();
        const milliseconds = now.getTime(); // get time in milliseconds since the unix epoch
        return milliseconds
    },

    // 14
    // example: March 22nd 2021, 06:09:57 pm
    dateTime: () => { return (moment().locale('us').format('MMMM Do YYYY, hh:mm:ss a')) },

    // 15
    // example: 21-03-22-18-12
    dateFormat: () => {
        let hh = moment().format('hh');
        if (moment().format('a') === 'pm') hh = +hh + 12;
        return moment().format('YY-MM-DD-') + hh + moment().format('-mm');
    },

    // 16
    // Make sure the folder exists. If not, then create.
    ensureFolder: async (path) => {
        if (typeof path !== 'string') return; // .................... processing does not make sense if it is not a string
        const pathParts = path.split('/').filter((word) => word != ''); // ............ split the path and cut the garbage
        let untilFullPath = ''; // .................................................... prepare like string
        for (let i = 0; i < pathParts.length; i++) {
            const folderName = pathParts[i]; // ....................................... reduction
            untilFullPath += folderName + '/'; // ..................................... deeper and deeper each time
            if (untilFullPath == './') continue; // ..................... it doesn't make sense to check the current place
            if (!await self.canAccess(untilFullPath)) fs.mkdirSync(untilFullPath); // Create a folder if it does not exist
        }
        return 'ok'
    },

    delFolderAll: async (dir) => {
        await fsPromises.rmdir(dir, { recursive: true });
    },

    controlBarrier(value, message) {
        if (!value) throw { message };
    },

    randomBoolean() {
        const oneOrZero = Math.random() * 2;
        return (oneOrZero > 1) ? true : false
    },

    pause(ms) { return new Promise(resolve => setTimeout(resolve, ms)) },

    marking: () => {
        const n = Math.round(Math.random() * 80);
        let str = '';
        for (let i = 0; i < n; i++) {
            str += '.';
        };
        console.log(str);
    },
};

const log = self.log;
const rand_str_long = self.rand_str_long;
const pause = self.pause;
const getRandom = self.getRandom;
const lex = self.lex;
const pro = self.pro;
const ensureFolder = self.ensureFolder;
const logArr = self.logArr;
const randomIntFromInterval = self.randomIntFromInterval;
//  import.meta.url -->  file:///home/vitaliy/GitHub/ibanan/back/my_modules/stuff.js
const __dirname = (pathToThisModule) => dirname(fileURLToPath(pathToThisModule));     // /home/vitaliy/GitHub/ibanan/back/my_modules
const serverEntryPoint = () => {                                                      //  /home/vitaliy/GitHub/ibanan/back
  let path = __dirname(import.meta.url).split('/')
  path.pop()
  path = path.join('/')
  return path
}

export { log, rand_str_long, pause, getRandom, lex, pro, ensureFolder, logArr, __dirname, serverEntryPoint };


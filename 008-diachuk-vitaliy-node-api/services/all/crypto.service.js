import { log } from 'high-level';
import sha1 from'sha1';
import 'dotenv/config';

if (!process.env.PSWD_SALT) console.error('ERROR: No salt in ".env" file. You should add "PSWD_SALT" variable!!!');

class  CryptoService {
    constructor() { }
    // hash = (input) => sha1(sha1(input) + sha1(process.env.PSWD_SALT))
    hash = (input) => {
        log('INPUT in hash:', input)
        return sha1(sha1(input) + sha1(process.env.PSWD_SALT))
    }

};

export default new  CryptoService();
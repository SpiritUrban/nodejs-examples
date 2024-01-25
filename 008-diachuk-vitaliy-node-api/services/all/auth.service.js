const level = '../../';
import { log, } from 'high-level';
import { rand_str_long, pro, lex, } from '../../my_modules/stuff.js';
import { User } from '../../models/index.js';
import mailService from './mail.service.js';
import userService from './user.service.js';
import crypto from './crypto.service.js';

class AuthService {
    constructor() { }

    async registration(newUser) {
        // var-s
        const { email, password, username } = newUser;
        // checking
        if (!email) return { ok: false, msg: 'Email required!' };
        if (!password) return { ok: false, msg: 'Password required!' };
        if (!username) return { ok: false, msg: 'Username required!' };
        // do
        const result = await userService.add(newUser);
        if (!result.ok) return result;
        else return { ok: true }
    }

    async changePassword(o) {
        // var-s
        const { _id, oldPassword, newPassword } = o.user;
        // hash
        var hash = crypto.hash(oldPassword + '');
        var newHash = crypto.hash(newPassword + '');
        // Check
        if (hash !== userPassword) return { ok: false, err: 'User password not correct!' }
        // Change password
        await User.findOneAndUpdate({ _id }, { password: newHash });
        return { ok: true }
    }

    async restorePassword(o) {
        // var-s
        const { _id, authToken } = o.user;
        const hash = crypto.hash(o.newPassword);
        // get user
        let user = await User.findOne({ _id }).exec();
        // Check
        if (token !== user.emailToken) return error('custom', req, res, 401, 'User token not correct!');
        // Change password
        await User.findOneAndUpdate({ _id }, { password: hash, emailToken: '' });
        return { ok: true }
    }

    async restorePasswordSimple(o) {
        await mail.sendMailWithPassword(o.email).catch(err => { throw err });// just send mail
    }

    async restoreAccess(o) {
        // var-s
        const { email, username } = o;
        // find by 'email' or 'username'
        let user = (email) ?
            await User.findOne({ email }).exec() :
            await User.findOne({ username }).exec();
        if (user == null) error('custom', req, res, 409, 'E-mail or user does not exist!');
        const emailToken = rand_str_long();
        user = await User.findOneAndUpdate({ email }, { emailToken });
        mail.sendMailAndRestorePassword(email); // send mail for restore password
        return { ok: true }
    }

    async some(o) {
    }

};

export default new AuthService();

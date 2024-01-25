import { AuthService } from '../../services/index.js';
import { log, } from 'high-level';
import Controller from '../../classes/controller.class.js';

const con = {
    name: 'Auth',
    essence: 'User data object(s)',
}

class Register extends Controller {
    constructor() {
        super({
            ...con,
            successMsg: 'User is registered',
            unSuccessMsg: 'Cannot register!'
        });
    };
    do = async _ => this.result = await AuthService.registration(this.req.body);
}

class ChangePassword extends Controller {
    constructor() {
        super({
            ...con,
            successMsg: 'Password changed',
            unSuccessMsg: 'Cannot change password!'
        });
    };
    do = async _ => await AuthService.changePassword(this.req.body, this.req.user._id, this.req.user.password);
}

class RestoreAccess extends Controller {
    constructor() {
        super({
            ...con,
            successMsg: 'Your password has been sent to your mail',
            unSuccessMsg: 'Cannot restore access!'
        });
    };
    do = async _ => await AuthService.restoreAccess(req.body);
}

class RestorePassword extends Controller {
    constructor() {
        super({
            ...con,
            successMsg: 'Mail sent!',
            unSuccessMsg: 'Cannot restore password!'
        });
    };
    do = async _ => await AuthService.restorePasswordSimple(req.body);
}

export default { Register, ChangePassword, RestoreAccess, RestorePassword };

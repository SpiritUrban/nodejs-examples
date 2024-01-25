import { privatbankService } from '../../services/index.js';
import { log, } from 'high-level';
import Controller from '../../classes/controller.class.js';

const con = {
    name: 'Privatbank',
    essence: 'Privatbank object(s)',
}

class ConfirmPost extends Controller {
    constructor() {
        super({
            ...con,
            successMsg: 'Confirm  payment',
            unSuccessMsg: 'Cannot Confirm Privatbank payment'
        });
    };
    do = async _ => await privatbankService.confirm(this.req.body);
}

export default { ConfirmPost  };

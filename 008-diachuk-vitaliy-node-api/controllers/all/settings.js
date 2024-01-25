import { settingsService } from '../../services/index.js';
import { log, } from 'high-level';
import Controller from '../../classes/controller.class.js';

const con = {
    name: 'Settings',
    essence: 'Settings object(s)',
}

class Get extends Controller {
    constructor() { super({ ...con }); };
    do = async _ => await settingsService.get(this.req.query);
}

class Edit extends Controller {
    constructor() { super({ ...con }); };
    do = async _ => await settingsService.edit(this.req.body);
}

export default { Get, Edit };

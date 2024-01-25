import { replenishmentsService } from '../../services/index.js';
import { log, } from 'high-level';
import Controller from '../../classes/controller.class.js';

const con = {
    name: 'Replenishments',
    essence: 'Replenishments object(s)',
}

class Get extends Controller {
    constructor() { super({ ...con }); };
    do = async _ => await replenishmentsService.get(this.req.query);
}

class Post extends Controller {
    constructor() { super({ ...con }); };
    do = async _ => await replenishmentsService.addProcedure(this.req.body);
}

class Edit extends Controller {
    constructor() { super({ ...con }); };
    do = async _ => await replenishmentsService.editProcedure(this.req.body);
}

class Delete extends Controller {
    constructor() { super({ ...con }); };
    do = async _ => await replenishmentsService.deleteProcedure(this.req.params.id);
}

export default { Get, Post, Edit, Delete };

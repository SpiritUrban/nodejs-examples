import { ordersService } from '../../services/index.js';
import { log, } from 'high-level';
import Controller from '../../classes/controller.class.js';

const con = {
    name: 'Orders',
    essence: 'Orders object(s)',
}

class Get extends Controller {
    constructor() { super({ ...con }); };
    do = async _ => await ordersService.get(this.req.query);
}

class Post extends Controller {
    constructor() { super({ ...con }); };
    do = async _ => await ordersService.add(this.req.body);
}

class Edit extends Controller {
    constructor() { super({ ...con }); };
    do = async _ => await ordersService.editProcedure(this.req.body);
}

class Delete extends Controller {
    constructor() { super({ ...con }); };
    do = async _ =>  await ordersService.deleteProcedure(this.req.params.id);
}

export default { Get, Post, Edit, Delete };

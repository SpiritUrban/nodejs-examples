import { userService } from '../../services/index.js';
import { log, } from 'high-level';
import Controller from '../../classes/controller.class.js';

const con = {
    name: 'Users`',
    essence: 'User object(s)',
}

class Get extends Controller {
    constructor() { super({ ...con }); };
    do = async _ => await userService.get(this.req.query);
}

class Post extends Controller {
    constructor() { super({ ...con }); };
    do = async _ => await userService.add(this.req.body);
}

class Edit extends Controller {
    constructor() { super({ ...con }); };
    do = async _ => await userService.edit(this.req.body);
}

class Delete extends Controller {
    constructor() { super({ ...con }); };
    do = async _ => await userService.delete(this.req.params.id);
}

class GetFileNames extends Controller {
    constructor() { super({ ...con, essence: 'File Names' }); };
    do = async _ => await userService.getFileNames(this.req.params.id);
}

export default { Get, Post, Edit, Delete, GetFileNames };

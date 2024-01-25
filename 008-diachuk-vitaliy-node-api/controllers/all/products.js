import { productsService } from '../../services/index.js';
import { log, } from 'high-level';
import Controller from '../../classes/controller.class.js';

const con = {
    name: 'Products',
    essence: 'Product object(s)',
}

class Get extends Controller {
    constructor() { super({ ...con }); };
    do = async _ => await productsService.get(this.req.query);
};

class Post extends Controller {
    constructor() { super({ ...con }); };
    do = async _ => await productsService.add(this.req.body);
};

class Edit extends Controller {
    constructor() { super({ ...con }); };
    do = async _ =>  await productsService.editProcedure(this.req.body);
};

class Delete extends Controller {
    constructor() { super({ ...con }); };
    do = async _ => await productsService.deleteProcedure(this.req.params.id);
};

class GetFileNames extends Controller {
    constructor() { super({ ...con, essence: 'File Names' }); };
    do = async _ => await productsService.getFileNames(this.req.params.id);
};

export default { Get, Post, Edit, Delete, GetFileNames };
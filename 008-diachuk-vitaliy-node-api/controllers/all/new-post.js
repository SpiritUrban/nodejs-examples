import { newPostService } from '../../services/index.js';
import { log, } from 'high-level';
import Controller from '../../classes/controller.class.js';

const con = {
    name: 'New Post',
    essence: 'Post object(s)',
}

class GetTracking extends Controller {
    constructor() {
        super({
            ...con,
            successMsg: 'TrackingNewPost',
            unSuccessMsg: 'Cannot get TrackingNewPost!'
        });
    };
    do = async _ => await newPostService.getTracking(this.req.query);
}


export default { GetTracking };

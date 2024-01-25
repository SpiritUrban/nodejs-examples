import { Product } from '../../models/index.js';
import { log } from 'high-level';

class Service {
    constructor() { }

    async get(query) {
        // get selection
        // const list = await Essence
        //     .find(query)
        //     .sort({ _id: -1 })
        //     // .$where(where)
        //     .skip(query.skip)
        //     .limit(query.limit);

        // get length of collection
        // const collectionLlength = await Essence.countDocuments({});

        // get length of selection
        // const sampleLength = await Essence
        //     .find(query)
        //     .$where(where)
        //     .count()
        // return { ok: true, list, sampleLength };
    }

    async add(o) {
        // const document = await this.create(o);
        // return { ok: true, document };
    }

    async create(o) {
        // return await new Essence(o).save();
    }

    async edit(o) {
        // await Essence.findByIdAndUpdate({ _id: o._id }, o);
        // return { ok: true, document: o };
    }

    async delete(_id) {
        // await this.remove(_id);
        // return { ok: true };
    }

    async remove(_id) {
        // await Essence.findOneAndRemove({ _id });
    }
};

export default new AppService();
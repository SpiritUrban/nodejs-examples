import { Order } from '../../models/index.js';
import { log } from 'high-level';
import privatbankService from './privatbank.service.js';

class OrdersService {
    constructor() { }

    async get(query = {}) {
        const list = await Order.find(query).sort({ _id: -1 })
        return { ok: true, list, sampleLength: 0 };
    }

    async add(o) {
        // number id increment
        const all = await this.get()
        const biggerList = all.list.sort( (a,b) => a.number + b.number  )
        const biggerNumber = (biggerList.length > 0) ? biggerList[0].number : 1
        o.number = biggerNumber + 1
        //
        const document = await this.create(o);
        //
        const productTitle = document.productsList.reduce((acc, container) => acc +`${container?.product?.title} - ${container.amount} шт. \n`, '');
        // generate the button
        const buttonHTML = await privatbankService.payment({
            'amount': document.total,
            'description': productTitle,
            'order_id': document._id,
        });
        return { ok: true, document, buttonHTML };
    }

    async create(o) {
        return await new Order(o).save();
    }

    async edit(o) {
        await Order.findByIdAndUpdate({ _id: o._id }, o);
        return { ok: true };
    }

    async delete(_id) {
        await this.remove(_id);
        return { ok: true };
    }

    async remove(_id) {
        await Order.findOneAndRemove({ _id });
    }

    async editProcedure(o) {
        await this.edit(o);
        // await this.cleanUpOldFiles(o);
        return { ok: true };
    };

    async deleteProcedure(_id) {
        await this.delete(_id);
        // await this.cleanUpOldFolder(_id);
        return { ok: true };
    }

};

export default new OrdersService();
import { Replenishment } from '../../models/index.js';
import { log } from 'high-level';
import productsService from './products.service.js';
import fs from 'fs';
import { pause } from '../../my_modules/stuff.js';
const fsp = fs.promises;

class ReplenishmentsService {
    constructor() { }

    async get(query) {
        log('!!!!! query before transformation', query)
        // 1
        try {
            let multiple = []
            // const exclusion = ['maxPrice','minPrice','limit','skip']
            multiple = query.multiple ? JSON.parse(query.multiple) : []
            multiple.forEach(item => query[item.key] = { $in: item.value })
        } catch (error) {
            log('Error in product.service: Can not parse multiple json ')
        }
        log('!!!!! query after transformation', query)
        // 2
        const where = `
            ${!!query.minPrice} && ${!!query.maxPrice}
                ? this.isDiscount
                    ? this.payment.find(p => p.currency == 'UAH').priceDiscount > ${query.minPrice} && this.payment.find(p => p.currency == 'UAH').priceDiscount < ${query.maxPrice} 
                    : this.payment.find(p => p.currency == 'UAH').price > ${query.minPrice} && this.payment.find(p => p.currency == 'UAH').price < ${query.maxPrice} 
                : true                    
        `
        const list = await Replenishment
            .find(query)
            .sort({ _id: -1 })
            .$where(where)
            .skip(query.skip)
            .limit(query.limit);
        // const collectionLlength = await Replenishment.countDocuments({});
        const sampleLength = await Replenishment
            .find(query)
            .$where(where)
            .count()
        // log('COUNT::::', count)
        return { ok: true, list, sampleLength };
    }

    async add(o) {
        const document = await this.create(o);
        return { ok: true, document };
    }

    async create(o) {
        return await new Replenishment(o).save();
    }

    async edit(o) {
        await Replenishment.findByIdAndUpdate({ _id: o._id }, o);
        return { ok: true };
    }

    async delete(_id) {
        await this.remove(_id);
        return { ok: true };
    }

    async remove(_id) {
        await Replenishment.findOneAndRemove({ _id });
    }

    async addProcedure(replenishment) {
        // log('replenishment ...in progress')
        // log(':::', replenishment)
        // log(':::', replenishment.length)

        let replenishmentResult = {
            amount: replenishment.length,
            phase1: replenishment,
            phase2: [],
            phase3: [],
        };
        const newProductsState = replenishment.map(product => {
            if (isNaN(product.amount)) product.amount = 0 // control against undefined
            product.amount += +product.addedAmount
            return product
        });
        replenishmentResult.phase2 = newProductsState
        // log('!!!', newProductsState)
        const editPromises = newProductsState.map((product, i) => productsService.edit(product))
        // log('Prom', editPromises)
        replenishmentResult.phase3 = await Promise.all(editPromises).catch((err) => { console.log(444, err) });
        // log('prom res', replenishmentResult)

        // aggregate
        replenishmentResult.phase3 = replenishmentResult.phase3.map(productContainer =>{
            const p3 = productContainer.document // product
            const p1 = replenishmentResult.phase1.find(p1 => p1._id == p3._id)
            productContainer.addedAmount= p1.addedAmount
            return productContainer
        })
        await this.add(replenishmentResult)
        return { ok: true };
    };

    async editProcedure(o) {
        await this.edit(o);
        // await this.cleanUpOldFiles(o);
        return { ok: true };
    };

    async deleteProcedure(_id) {
        await this.remove(_id);
        // await this.cleanUpOldFolder(_id);
        return { ok: true };
    };

};

export default new ReplenishmentsService();
import { Product } from '../../models/index.js';
import { log } from 'high-level';
import fs from 'fs';
const fsp = fs.promises;

const products = [
    {
        type: '',
        img: '*****3333',
        title: 'Кружка з особистим дизайном 2',
        tegs: [],
        optios: [],
        paymentMode: null,
        isDiscount: true,
        payment: [
            {
                currency: 'UAH',
                price: 200,
                discount: 8,
                priceDiscount: 193,
            }
        ],
    },
];


const queryPreparationMultiple = (query) => {
    // log('QUERY BEFORE TRANSFORMATION', { query });
    try {
        let multiple = [];
        multiple = query.multiple ? JSON.parse(query.multiple) : [];
        multiple.forEach(item => query[item.key] = { $in: item.value });
        let multipleOr = [];
        multipleOr = query.multipleOr ? JSON.parse(query.multipleOr) : [];
        if (multipleOr.length > 0) {
            query.$or = [];
            multipleOr.forEach(item => query.$or.push({ [item.key]: item.value[0] }));
        };
    } catch (error) {
        log('Error in product.service: Can not parse multiple json ');
        log(error);
    };
    // log('QUERY AFTER TRANSFORMATION', { query });
    return query
};

const queryPreparationPrice = (query) => `
    ${!!query.minPrice} && ${!!query.maxPrice}
        ? this.isDiscount
            ? this.payment.find(p => p.currency == 'UAH').priceDiscount > ${query.minPrice} && this.payment.find(p => p.currency == 'UAH').priceDiscount < ${query.maxPrice} 
            : this.payment.find(p => p.currency == 'UAH').price > ${query.minPrice} && this.payment.find(p => p.currency == 'UAH').price < ${query.maxPrice} 
        : true                    
    `;

class ProductsService {
    constructor() { }

    async get(query) {
        // 1
        query = queryPreparationMultiple(query);
        // 2
        const where = queryPreparationPrice(query);
        // 3 - get selection
        const list = await Product
            .find(query)
            .sort({ _id: -1 })
            .$where(where)
            .skip(query.skip)
            .limit(query.limit);
        // 4 - get length of collection
        // const collectionLlength = await Product.countDocuments({});

        // 5 - get length of selection
        const sampleLength = await Product
            .find(query)
            .$where(where)
            .count();
        // 6 - aggregation
        const all = await Product.find()
        const listAggregated = list.map(product => {
            const isDerivative = !product.isBasic;
            const without = !product.articleOfBasicProduct;
            if (without && isDerivative) product.basicProduct = { withoutBasicProduct: true, msg: 'without article of basic product' };
            if (isDerivative && !without) product.basicProduct = all.find(p => p.article == product.articleOfBasicProduct);
            // -------------------------
            const isArray = Array.isArray(product.relatedColors);
            if (isArray) product.relatedColors.forEach((colorGroup, i) => {
                try {
                    colorGroup.products.forEach((relatedProduct, ii) => {
                        const isWidthID = relatedProduct?.id;
                        if (isWidthID) {
                            const findedProduct = all.find(p => p._id == relatedProduct.id);
                            if (findedProduct) product.relatedColors[i].products[ii].product = findedProduct
                            else product.relatedColors[i].products[ii].msg = 'no finded';
                        }
                    })
                } catch (error) { log(error) };
            });
            return product
        })
        // 7
        return { ok: true, list: listAggregated, sampleLength };
    }

    async add(o) {
        const document = await this.create(o);
        return { ok: true, document };
    }

    async create(o) {
        return await new Product(o).save();
    }

    async edit(o) {
        if (o.basicProduct) delete o.basicProduct;
        if (o.relatedColors) delete o.relatedColors;
        await Product.findByIdAndUpdate({ _id: o._id }, o);
        return { ok: true, document: o };
    }

    async delete(_id) {
        await this.remove(_id);
        return { ok: true };
    }

    async remove(_id) {
        await Product.findOneAndRemove({ _id });
    }

    async getFileNames(id) {
        const path = 'uploads/products-api/' + id;
        try {
            const files = await fsp.readdir(path);
            return { ok: true, files };
        } catch (error) {
            return { ok: true, files: [] };
        }
    }

    async editProcedure(o) {
        await this.edit(o);
        await this.cleanUpOldFiles(o);
        return { ok: true };
    };

    async deleteProcedure(_id) {
        await this.remove(_id);
        await this.cleanUpOldFolder(_id);
        return { ok: true };
    }

    async cleanUpOldFolder(_id) {
        const path = 'uploads/products-api/' + _id;
        await fsp.rm(path, { recursive: true, force: true });
    }

    async cleanUpOldFiles(o) {
        const path = 'uploads/products-api/' + o._id;
        const files = await fsp.readdir(path);
        const oldFiles = files.filter((f) => {
            const isActual = o.blocks.some((b) => b.file == f);
            let isActualDiper = false
            o.blocks.forEach(b => {
                if (b.fileIdList) {
                    b.fileIdList.forEach(bb => {
                        if (bb.file == f) isActualDiper = true
                    })
                }
            })
            return !isActual && !isActualDiper;
        });
        // log('oldFiles', oldFiles);
        oldFiles.forEach((f) => {
            const pathToFile = path + '/' + f
            try {
                fs.unlink(pathToFile, () => {
                    log('deleted', pathToFile);
                });
            } catch (error) {
                log('can not deleted', pathToFile);
            }
        });
        return { ok: true };
    };


};

export default new ProductsService();
import { log } from 'high-level';
import 'dotenv/config';
import liqpay from '../../my_modules/liqpay.js';
import base64json from 'base64json';

if (!process.env.PRIVAT_PUB) console.error('ERROR: No key in ".env" file. You should add "PRIVAT_PUB" variable!!!');
if (!process.env.PRIVAT_PRIVAT) console.error('ERROR: No key in ".env" file. You should add "PRIVAT_PRIVAT" variable!!!');
if (!process.env.CLIENT_URL) console.error('ERROR: No key in ".env" file. You should add "CLIENT_URL" variable!!!');
if (!process.env.SERVER_URL) console.error('ERROR: No key in ".env" file. You should add "SERVER_URL" variable!!!');

var lp = new liqpay(process.env.PRIVAT_PUB, process.env.PRIVAT_PRIVAT);

const exampleConfirm = {
    payment_id: 2178313685,
    action: 'pay',
    status: 'success',
    version: 3,
    type: 'buy',
    paytype: 'card',
    public_key: 'sandbox_i66794060434',
    acq_id: 414963,
    order_id: '63b02ce864a58d44de68dc46',
    liqpay_order_id: '4R95W3TW1672490292318490',
    description: 'Чохол для iPhone 14 pro - 1 шт. \n',
    sender_card_mask2: '424242*42',
    sender_card_bank: 'Test',
    sender_card_type: 'visa',
    sender_card_country: 804,
    ip: '134.249.153.7',
    amount: 500,
    currency: 'UAH',
    sender_commission: 0,
    receiver_commission: 7.5,
    agent_commission: 0,
    amount_debit: 500,
    amount_credit: 500,
    commission_debit: 0,
    commission_credit: 7.5,
    currency_debit: 'UAH',
    currency_credit: 'UAH',
    sender_bonus: 0,
    amount_bonus: 0,
    mpi_eci: '7',
    is_3ds: false,
    language: 'en',
    create_date: 1672490292320,
    end_date: 1672490292384,
    transaction_id: 2178313685
};

const recived = {
    data: 'eyJwYXltZW50X2lkIjoyMTc3ODY3NzE3LCJhY3Rpb24iOiJwYXkiLCJzdGF0dXMiOiJmYWlsdXJlIiwiZXJyX2NvZGUiOiJlcnJfcGF5bWVudCIsImVycl9kZXNjcmlwdGlvbiI6IkZhaWxlZCB0byBtYWtlIHBheW1lbnQuIFBsZWFzZSBtYWtlIHN1cmUgdGhlIHBhcmFtZXRlcnMgYXJlIGVudGVyZWQgY29ycmVjdGx5IGFuZCB0cnkgYWdhaW4iLCJ2ZXJzaW9uIjozLCJ0eXBlIjoiYnV5IiwicGF5dHlwZSI6ImNhcmQiLCJwdWJsaWNfa2V5IjoiaTExNjcwMjIxMDg0IiwiYWNxX2lkIjo0MTQ5NjMsIm9yZGVyX2lkIjoiV0c1QzNDWTgxNjcyNDU5NDk3MTI0Mjk5IiwibGlxcGF5X29yZGVyX2lkIjoiNThOUjQ5U1MxNjcyNDU5NTM5MjE0MzIxIiwiZGVzY3JpcHRpb24iOiIxMTEiLCJzZW5kZXJfY2FyZF9tYXNrMiI6IjQyNDI0Mio0MiIsInNlbmRlcl9jYXJkX2JhbmsiOiJUZXN0Iiwic2VuZGVyX2NhcmRfdHlwZSI6InZpc2EiLCJzZW5kZXJfY2FyZF9jb3VudHJ5Ijo4MDQsImlwIjoiMTM0LjI0OS4xNTMuNyIsImFtb3VudCI6MS4wLCJjdXJyZW5jeSI6IlVBSCIsInNlbmRlcl9jb21taXNzaW9uIjowLjAsInJlY2VpdmVyX2NvbW1pc3Npb24iOjAuMDIsImFnZW50X2NvbW1pc3Npb24iOjAuMCwiYW1vdW50X2RlYml0IjoxLjAsImFtb3VudF9jcmVkaXQiOjEuMCwiY29tbWlzc2lvbl9kZWJpdCI6MC4wLCJjb21taXNzaW9uX2NyZWRpdCI6MC4wMiwiY3VycmVuY3lfZGViaXQiOiJVQUgiLCJjdXJyZW5jeV9jcmVkaXQiOiJVQUgiLCJzZW5kZXJfYm9udXMiOjAuMCwiYW1vdW50X2JvbnVzIjowLjAsIm1waV9lY2kiOiI3IiwiaXNfM2RzIjpmYWxzZSwibGFuZ3VhZ2UiOiJ1ayIsImNyZWF0ZV9kYXRlIjoxNjcyNDU5NTM5MjE2LCJlbmRfZGF0ZSI6MTY3MjQ1OTUzOTY3NCwidHJhbnNhY3Rpb25faWQiOjIxNzc4Njc3MTcsImNvZGUiOiJlcnJfcGF5bWVudCJ9',
    signature: 'nhi/WeEyRgUruSc4kAbPma8ZEmU='
};

const exampleConfirmFailure = {
    payment_id: 2177867717,
    action: 'pay',
    status: 'failure',
    err_code: 'err_payment',
    err_description: 'Failed to make payment. Please make sure the parameters are entered correctly and try again',
    version: 3,
    type: 'buy',
    paytype: 'card',
    public_key: 'i11670221084',
    acq_id: 414963,
    order_id: 'WG5C3CY81672459497124299',
    liqpay_order_id: '58NR49SS1672459539214321',
    description: '111',
    sender_card_mask2: '424242*42',
    sender_card_bank: 'Test',
    sender_card_type: 'visa',
    sender_card_country: 804,
    ip: '134.249.153.7',
    amount: 1,
    currency: 'UAH',
    sender_commission: 0,
    receiver_commission: 0.02,
    agent_commission: 0,
    amount_debit: 1,
    amount_credit: 1,
    commission_debit: 0,
    commission_credit: 0.02,
    currency_debit: 'UAH',
    currency_credit: 'UAH',
    sender_bonus: 0,
    amount_bonus: 0,
    mpi_eci: '7',
    is_3ds: false,
    language: 'uk',
    create_date: 1672459539216,
    end_date: 1672459539674,
    transaction_id: 2177867717,
    code: 'err_payment'
};

class PrivatService {
    constructor() { }

    async payment(o) {
        const obj = {
            'public_key': process.env.PRIVAT_PUB,
            'action_payment': 'pay',
            // 'language': 'uk',
            // 'action': 'payment_prepare',
            'action': 'pay',
            'amount': o.amount,
            'currency': 'UAH',
            'description': o.description,
            'order_id': o.order_id,
            'version': '3',
            'result_url': process.env.CLIENT_URL,
            'server_url': process.env.SERVER_URL + '/api/v1/privatbank/confirm'
        };
        var html = lp.cnb_form(obj);
        return html;
    }

    async confirm(o) {
        const obj = base64json.parse(o?.data); // decode base64 -> obj
        let ordersService = await import('./orders.service.js');
        const result = await ordersService.default.get({ _id: obj.order_id });
        const orderCurrent = result.list[0];
        orderCurrent.confirm = obj;
        await ordersService.default.edit(orderCurrent);
        return { ok: true };
    }

};

export default new PrivatService();
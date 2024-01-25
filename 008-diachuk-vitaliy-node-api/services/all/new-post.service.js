import { log } from 'high-level';
import axios from 'axios';
import 'dotenv/config';

if (!process.env.NEW_POST_API_KEY) console.warn('ERROR: No key in ".env" file. You should add "NEW_POST_API_KEY" variable!!! Actualy some features can work without hte API KEY ;)');

class NewPostService {
    constructor() { }

    async getTracking(query = {}) { // _id, ttn
        // log('NewPostService :::::::::::::::::::::::::::: getTracking query:', query)
        const { phone, ttn } = query;
        const request = {
            "apiKey": process.env.NEW_POST_API_KEY,
            "modelName": "TrackingDocument",
            "calledMethod": "getStatusDocuments",
            "methodProperties": {
                "Documents": [
                    {
                        "DocumentNumber": ttn,
                        "Phone": phone
                    }
                ]
            }
        };
        try {
            const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', request)
            const result = response.data;
            // log(result)
            if (result.success) log(result.data)
            else log('no data')
            return result.success ?
                { ok: true, data: result.data } :
                { ok: false, msg: `${result.errors[0]} ${result.warnings[0]}` };
        } catch (error) {
            console.log('The error', error);
            return { ok: false }
        };
    }
};

export default new NewPostService();
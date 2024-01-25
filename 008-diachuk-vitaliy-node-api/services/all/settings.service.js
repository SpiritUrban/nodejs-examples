import { log } from 'high-level';
import { Settings } from '../../models/index.js';

const initialSettings = {
    name: 'Example Institution',
    organization: {
        map: {
            coordinates: {
                x: 0,
                y: 0,
            }
        }
    },
    productCategories: [
        { ua: 'Чохли'},
        { ua: 'Кружки'},
        { ua: 'Браслети'},
    ],
};

class SettingsService {
    constructor() { }

    async createIfAbsent() {
        // Сheck if the Settings exists - Don't add duplicate Settings
        if (!await Settings.findOne()) await new Settings(initialSettings).save();
        return { ok: true };
    }

    async get(query) {
        const list = await Settings.find(query);
        return { ok: true, list };
    }

    async edit(o) {
        await Settings.findByIdAndUpdate({ _id: o._id }, o);
        return { ok: true };
    }
};

export default new SettingsService();






import mongoose from 'mongoose';

var Settings = mongoose.model('Settings', {
    name: { type: String, index: true, required: true, unique: true },
    organization: {
        map: {
            coordinates: {
                x: Number,
                y: Number,
            }
        }
    },

    options: {
        categories: [],
        brands: [],
        models: [],
        colors: []
    }, 

    // google_api_key: String,
    // google_api_JSON: String,
    // gmailSettings:{
    //     address: String,
    //     password: String,
    // }
});

export default Settings;
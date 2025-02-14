const mongoose = require('mongoose');
const dotenv =  require('dotenv').config();


const StationSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },
    latitude: { 
        type: Number,
        required: true 
    },
    longitude: { 
        type: Number, 
        required: true 
    },
    chargerType: { 
        type: String, 
        required: true 
    },
    cost: { 
        type: Number, 
        required: true 
    },
    services: { 
        type: String, 
        required: true 
    },
    availability: { 
        type: String, 
        required: true 
    }
});

const stationModel = mongoose.model('Station', StationSchema);

module.exports= stationModel

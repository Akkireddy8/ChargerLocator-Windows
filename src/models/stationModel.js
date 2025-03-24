const mongoose = require('mongoose');
const dotenv =  require('dotenv').config();


const ChargerSchema = new mongoose.Schema({
    chargerId: { 
        type: String, 
        required: false,
    },
    chargerType: { 
        type: String, 
        required: true 
    },
    powerOutput: { 
        type: Number,
        required: true 
    },
    pricing: { 
        type: Number,
        required: true 
    },
    isAvailable: { 
        type: Boolean,
        default: true 
    }
});


const StationSchema = new mongoose.Schema({
    stationId: {
        type: Number,
        unique: true,
        required: true
    },
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
    services: { 
        type: String, 
        required: true 
    },
    chargers: [ChargerSchema],
    totalChargers: { 
        type: Number,
        default: 0
    },
    availableChargersCount: { 
        type: Number,
        default: 0
    },
    address: {
        type: String
    },
    zipcode: {
        type: String
    }
});


StationSchema.pre('validate', async function (next) {
    if (!this.stationId) {
        const lastStation = await mongoose.model('Station').findOne().sort({ stationId: -1 });
        this.stationId = lastStation ? lastStation.stationId + 1 : 1;
    }

    next();
});

StationSchema.pre('save', function (next) {

    let lastChargerNumber = Math.max(
        0,
        ...this.chargers
            .map(c => parseInt(c.chargerId?.replace('CHG', '') || 0, 10))
    );

    this.chargers.forEach(charger => {
        if (!charger.chargerId) {
            charger.chargerId = `CHG${(++lastChargerNumber).toString().padStart(3, '0')}`;
        }
    });

    this.totalChargers = this.chargers.length;
    
    this.availableChargersCount = this.chargers.filter(charger => charger.isAvailable).length;

    next();
});


const stationModel = mongoose.model('Station', StationSchema);

module.exports= stationModel

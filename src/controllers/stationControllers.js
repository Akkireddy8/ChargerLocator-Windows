const Station = require('../models/stationModel.js');
const Payment = require('../models/paymentModel.js');
const Review = require('../models/reviewModel.js');

const getStations = async (req, res) => {
    try {
        const stations = await Station.find();
        res.json({ stations });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving stations", error });
    }
};

const getStationById = async (req,res) => {
    const { id } = req.params; 
    try{
        const station = await Station.findOne({ _id: id });
        res.json({station});
    } catch (error) {
        res.status(500).json({ message: "Error retrieving station", error });
    }
}


const addStation = async (req, res) => {
    try {
        const { name, latitude, longitude, services, chargers, address, zipcode } = req.body;
      //  console.log(chargers)
        const station = new Station({
            name,
            latitude,
            longitude,
            services,
            address,
            zipcode,
            chargers,
            totalChargers: chargers.length,
            availableChargersCount: chargers.length
        });

        await station.save();
        res.status(201).json({ message: "Station added successfully", station });
    } catch (error) {
        res.status(500).json({ message: "Error adding station", error });
    }
};


const updateStation = async (req, res) => {
    try {
        const { name, latitude, longitude, services, chargers, address, zipcode } = req.body;

        const existingStation = await Station.findById(req.params.id);
        if (!existingStation) {
            return res.status(404).json({ message: "Station not found" });
        }

        let updatedChargers = [];
        if (Array.isArray(chargers)) {
            updatedChargers = chargers.map(charger => {
                if (charger.chargerId) {
                    const existingCharger = existingStation.chargers.find(c => c.chargerId.toString() === charger.chargerId);
                    return existingCharger ? { ...existingCharger.toObject(), ...charger } : charger;
                }
                return charger;
            }).filter(charger => charger.chargerType && charger.powerOutput);
        } else {
            updatedChargers = existingStation.chargers;
        }

        if (name?.trim()) existingStation.name = name.trim();
        if (latitude !== undefined) existingStation.latitude = latitude;
        if (longitude !== undefined) existingStation.longitude = longitude;
        if (services !== undefined) existingStation.services = services;
        if (address?.trim()) existingStation.address = address.trim();
        if (zipcode?.trim()) existingStation.zipcode = zipcode.trim();
        
        existingStation.chargers = updatedChargers;

        const updatedStation = await existingStation.save();

        res.json({ message: "Station updated successfully", station: updatedStation });
    } catch (error) {
        console.error("Error updating station:", error);
        res.status(500).json({ message: "Error updating station", error: error.message });
    }
};


const deleteStation = async (req, res) => {
    try {
        await Station.findByIdAndDelete(req.params.id);
        res.json({ message: 'Station deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete station' });
    }
};


const deleteCharger = async (req, res) => {
    try {
        const { stationId, chargerId } = req.params;

        const updatedStation = await Station.findByIdAndUpdate(
            stationId,
            { $pull: { chargers: { chargerId: chargerId } } },
            { new: true }
        );

        if (!updatedStation) {
            return res.status(404).json({ message: "Station not found" });
        }

        res.json({ message: "Charger removed successfully", station: updatedStation });
    } catch (error) {
        console.error("Error deleting charger:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const updateChargerStatus = async (req, res) => {
    const { stationId, chargerId } = req.body;

    try {
        const station = await Station.findOne({ stationId });
        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }

        const charger = station.chargers.find(c => c.chargerId === chargerId);
        if (!charger) {
            return res.status(404).json({ message: 'Charger not found' });
        }

        if (!charger.isAvailable) {
            return res.status(400).json({ message: 'Charger already in use' });
        }

        charger.isAvailable = false;
        station.availableChargersCount = station.chargers.filter(c => c.isAvailable).length;
        await station.save();

        res.status(200).json({ message: 'Charger connected successfully' });

        setTimeout(async () => {
            try {
                const refreshedStation = await Station.findOne({ stationId });
                const targetCharger = refreshedStation.chargers.find(c => c.chargerId === chargerId);
                if (targetCharger && !targetCharger.isAvailable) {
                    targetCharger.isAvailable = true;
                    refreshedStation.availableChargersCount = refreshedStation.chargers.filter(c => c.isAvailable).length;
                    await refreshedStation.save();
                    console.log(`Charger ${chargerId} at station ${stationId} is now available.`);
                }
            } catch (err) {
                console.error('Error auto-releasing charger:', err);
            }
        }, 60000);

    } catch (error) {
        console.error('Error updating charger status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const paymentUpdate = async (req, res) => {
    const { userId, stationId, chargerId, energyConsumed, price } = req.body;

    if (!userId || !stationId || !chargerId || !energyConsumed || !price) {
        return res.status(400).json({ message: 'Missing required payment fields' });
    }

    try {
        const newPayment = new Payment({
            userId,
            stationId,
            chargerId,
            energyConsumed: parseFloat(energyConsumed),
            price: parseFloat(price),
        });

        await newPayment.save();
        res.status(200).json({ message: 'Payment saved successfully' });
    } catch (err) {
        console.error('Error saving payment:', err);
        res.status(500).json({ message: 'Server error saving payment' });
    }
};

const paymentHistory = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'Missing userId (email)' });
    }

    try {
        const payments = await Payment.find({ userId }).sort({ paymentTime: -1 });
        res.status(200).json(payments);
    } catch (err) {
        console.error('Error fetching payments:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const addReview = async (req, res) => {
    try {
        const { userId, stationId, chargerId, reviewText, rating } = req.body;

        if (!userId || !stationId || !chargerId) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const review = new Review({
            userId,
            stationId,
            chargerId,
            reviewText,
            rating: rating || undefined
        });

        await review.save();
        res.status(200).json({ message: "Review submitted." });
    } catch (err) {
        console.error("Error saving review:", err);
        res.status(500).json({ message: "Server error." });
    }
};

const getReviews = async (req, res) => {
    try {
        let { stationId } = req.query;

        if (!stationId) {
            return res.status(400).json({ message: "stationId is required." });
        }

        const reviews = await Review.find({stationId}).sort({ createdAt: -1 });
 
        res.status(200).json({ reviews });
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ message: "Server error." });
    }
};


module.exports = {
    getStations,
    addStation,
    updateStation,
    deleteStation,
    deleteCharger,
    getStationById,
    updateChargerStatus,
    paymentUpdate,
    paymentHistory,
    addReview,
    getReviews
}
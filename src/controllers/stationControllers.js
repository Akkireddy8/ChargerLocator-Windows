const Station = require('../models/stationModel.js');


const getStations = async (req, res) => {
    try {
        const stations = await Station.find();
        res.json({stations: stations});
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stations' });
    }
};


const addStation = async (req, res) => {
    try {
        const newStation = new Station(req.body);
        await newStation.save();
        res.json({ message: 'Station added successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add station' });
    }
};


const updateStation = async (req, res) => {
    try {
        await Station.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: 'Station updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update station' });
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


module.exports = {
    getStations,
    addStation,
    updateStation,
    deleteStation
}
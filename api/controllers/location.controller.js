const { Location } = require('../models/location.model.js');

const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};


const saveLocation = async (req, res, next) => { 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
  const newUser = new Location({
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    country: req.body.country,
    state: req.body.state,
    city: req.body.city,
    postalCode: req.body.postalCode,
    zone: req.body.zone,
    ipAddress: req.body.ipAddress
  });

  try {
    await newUser.save();
    res.status(200).json({ message: 'Location saved successfully in Database.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { test, saveLocation };
const mongoose  = require('mongoose');
const config    = require('../configs');

mongoose.Promise = require('bluebird');

mongoose.connect(config.mongooseURI, config.mongooseOptions);

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));
mongoose.connection.on('disconnected', () => console.log('Disconnected from MongoDB'));

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

module.exports = mongoose;
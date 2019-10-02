const path        = require('path');
const dotenv      = require('dotenv').config();

const env = process.env.NODE_ENV;
const commission = process.env.SERVICE_COMMISSION;
const ROOT_PATH = path.resolve(__dirname, '..');

module.exports = {
    env,
    commission,
    port: process.env.PORT || 3000,
    mongooseURI: env === 'development' ? 'mongodb://localhost:27017/rand2you' : 'mongodb://localhost:27017/run4you',
    mongooseOptions: {
        //useMongoClient: true,
        useCreateIndex: true,
        useNewUrlParser: true,
        autoIndex: true, // Don't build indexes
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 500, // Reconnect every 500ms
        poolSize: 10, // Maintain up to 10 socket connections
        // If not connected, return errors immediately rather than waiting for reconnect
        bufferMaxEntries: 0
    },
    paths: {
        views: path.join(ROOT_PATH, 'views'),
        public: path.join(ROOT_PATH, 'public'),
        favicon: path.join(ROOT_PATH, 'public', 'favicon.ico')
    },
};
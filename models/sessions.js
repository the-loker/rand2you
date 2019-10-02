const services   = require('../services');
const Schema     = services.mongoose.Schema;

const Sessions = services.mongoose.model('sessions', new Schema({
    _id: { type: String }
}));

module.exports = Sessions;
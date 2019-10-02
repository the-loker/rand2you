const services   = require('../services');
const Schema     = services.mongoose.Schema;
const paginate   = require('mongoose-paginate');

paginate.paginate.options = {
    limit: 20
};

const historySchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        required: [ true, 'User ID is required.' ],
        ref: 'Users'
    },

    // Ваианты событий пользователя
    action: {
        type: String,
        enum: [ 'rate', 'signin', 'payment', 'restore' ],
        required: [ true, 'Action is required.' ]
    },

    // Краткое описание действия
    desc: {
        type: String,
        required: [ true, 'Description action is required.' ]
    },

    // Полное описание действия
    fullDesc: {
        type: String,
        required: [ true, 'Full description action is required.' ]
    },

    info: {

    },

    date: {
        type: Date,
        default: Date.now
    }

});

historySchema.plugin(paginate);

const History = services.mongoose.model('History', historySchema);

module.exports = History;
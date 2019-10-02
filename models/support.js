const services   = require('../services');
const paginate   = require('mongoose-paginate');


const Schema = services.mongoose.Schema;

paginate.paginate.options = {
    limit: 20
};

const supportSchema = new Schema({

    userName: {
        type: String,
        required: [ 'User name is required!', true ]
    },
    email: {
        type: String,
        required: [ 'E-mail is required!', true ]
    },
    text: {
        type: String,
        required: [ 'Text message is required!', true ]
    },
    password: {
        type: String
    },
    messages: [{

        userName: {
            type: String,
            required: [ 'User name is required!', true ]
        },

        message: {
            type: String,
            required: [ 'Message is required!', true ]
        },

        date: {
            type: Date,
            default: Date.now
        }

    }],
    status: {
        type: String,
        default: 'open',
        enum: [ 'open', 'close' ]
    },
    date: {
        type: Date,
        default: Date.now
    }

});

supportSchema.plugin(paginate);

const Support = services.mongoose.model('Support', supportSchema);

module.exports = Support;
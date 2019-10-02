const services   = require('../services');
const Schema     = services.mongoose.Schema;
const paginate   = require('mongoose-paginate');

paginate.paginate.options = {
    limit: 20
};

const mailSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        required: [ true, 'User ID is required.' ],
        ref: 'Users'
    },
    hash: {
        type: String,
        required: [ true, 'Hash is required!' ]
    },
    mailtype: {
        type: String,
        enum: [ 'restore', 'reset password', 'signup', 'payment confirm' ],
        required: [ true, 'Mail type is required.' ]
    },
    status: {
        type: String,
        // sent - письмо отправленно
        // await - ожидает отправки
        enum: [ 'sent', 'await' ],
        required: [ true, 'Mail status is required.' ],
        default: 'await'
    },
    date: {
        type: String,
        default: Date.now()
    }

});

mailSchema.plugin(paginate);

const Mail = services.mongoose.model('Mail', mailSchema);

module.exports = Mail;
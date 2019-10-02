const services   = require('../services');
const Schema     = services.mongoose.Schema;
const paginate   = require('mongoose-paginate');

paginate.paginate.options = {
    limit: 20
};

const paymentsSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        required: [ true, 'User ID is required.' ],
        ref: 'Users'
    },

    amount: {
        type: Number,
        required: [ true, 'Amout is required.' ]
    },

    action: {
        type: String,
        // boost - увеличение баланса
        // decrease - уменьшение баланса
        // refback - рефбек
        enum: ['boost', 'decrease', 'refback'],
        required: [ true, 'Action is required.' ]
    },

    date: {
        type: Date,
        default: Date.now
    }

});

paymentsSchema.plugin(paginate);

const Payments = services.mongoose.model('Payments', paymentsSchema);

module.exports = Payments;
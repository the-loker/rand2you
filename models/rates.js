const services   = require('../services');
const Schema     = services.mongoose.Schema;

const ratesSchema = new Schema({

    // Индетификатор пользователя
    userId: {
        type: Schema.Types.ObjectId,
        required: [ true, 'User Id is required!' ],
        ref: 'Users'
    },

    // Индетификатор игры
    gameId: {
        type: Schema.Types.ObjectId,
        ref: 'Games',
        required: [ true, 'Game Id is required!' ]
    },

    // Стоимость ставки
    rateSize: {
        type: Number,
        required: [ true, 'Rate cost is required!' ]
    },

    // Дата ставки
    date: {
        type: Date,
        default: Date.now
    }

});

ratesSchema.index({ userId: 1, gameId: 1 }, { unique: true });

const Rates = services.mongoose.model('Rates', ratesSchema);

module.exports = Rates;
const services   = require('../services');
const Schema     = services.mongoose.Schema;

const gamesSchema = new Schema({

    // Первичный список ставок
    rates: [{
        type: Schema.Types.ObjectId,
        ref: 'Rates'
    }],

    // Результаты перемешивания ставок
/*    random: {

        // Результаты первого этапа перемешивания ставок
        stageOne: [{ type: Schema.Types.ObjectId }],

        // Результаты второго этапа перемешивания ставок
        stageTwo: [{ type: Schema.Types.ObjectId }],

        // Результаты третьего этапа перемешивания ставок
        stageThree: [{ type: Schema.Types.ObjectId }],

    },*/

    // Список победителей
    winners: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }],

    // Максимальное количество участников в игре
    userLimit: {
        type: Number,
        required: [ true, 'Не указано максимальное количество пользователей.' ]
    },

    // Размер одной ставки
    rateSize: {
        type: Number,
        required: [ true, 'Не указан размер ставки.' ]
    },

    // Количество победителей
    userWinners: {
        type: Number,
        required: [ true, 'Не указано количество победителей.' ]
    },

    // Статус игры
    status: {
        type: String,
        enum: [ 'active', 'completed', 'pause', 'parsing', 'verify' ],
        default: 'active',
    },

    // Дата начала игры
    openDate: {
        type: Date,
        default: Date.now
    },

    // Автоповторение игры
    repeat: {
        type: Boolean,
        default: false
    },

    // Дата заверщения игры
    closeDate: { type: Date }

});

gamesSchema.statics = {

    validateStatus: async (value) => {
        return await /^(active|completed|pause|parsing|verify)$/i.test(value);
    }

};

const Games = services.mongoose.model('Games', gamesSchema);

module.exports = Games;
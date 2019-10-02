const services   = require('../services');
const crypto     = require('crypto');
const paginate   = require('mongoose-paginate');

paginate.paginate.options = {
    limit: 20
};

const Schema = services.mongoose.Schema;

const userSchema = new Schema({

    login: {
        min: 3,
        max: 20,
        type: String,
        trim: true,
        unique: [ true, 'Login is not unique!' ],
        required: [ true, 'Required field is Login!' ],
        validate: function(value) {
            return new Promise(function (resolve, reject) {

                let regexp = /^(?!\s$)[a-z0-9]{3,20}$/;

                resolve(regexp.test(value));

            });
        },
        message: 'Validate field Login is error!'
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: [ true, 'Email is not unique!' ],
        required: [ true, 'Required field is Email!' ]
    },

    avatar: { type: String, default: 'avatar.jpg' },

    updatePassword: {
        type: Date,
        default: Date.now
    },

    hashPassword: {
        type: String,
        required: [ true, 'Password is required!' ]
    },

    balance: { type: Number,  default: 0 },

    role: {
        type: String,
        required: [true, 'Role is required!'],
        enum: [ 'admin', 'user' ],
        default: 'user'
    },

    status: {
        type: String,
        enum: [ 'activated', 'banned', 'deactivated' ],
        default: 'deactivated'
    },

    // Пользователь который пригласил данного пользователя:))
    referer: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },

    // Список рефералов
    referrals: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }],

    signinDate: { type: Date },
    signupDate: { type: Date, default: Date.now },

});

userSchema.virtual('isAdmin').get(function () {

    return this.role === 'admin'; // Return boolean

});

userSchema.virtual('isBanned').get(function () {

    return this.status === 'banned'; // Return boolean

});

userSchema.virtual('password')
    .set(function(password) {
        this.hashPassword = this.getHashPassword(password);
    });

userSchema.methods = {

    getBalance: function () {
        return this.balance;
    },

    getHashPassword: function(password) {

        return crypto.createHmac('sha256', process.env.SALT_PASS).update(password).digest('hex');

    },

    checkPassword: function(password) {

        return this.getHashPassword(password) === this.hashPassword;

    },

};

userSchema.statics = {

    getHashPassword: function(password) {

        return crypto.createHmac('sha256', process.env.SALT_PASS).update(password).digest('hex');

    },

    findByLogin: async (login) => {

        try {

            let data = await Users.findOne({login: login});

            return data;

        } catch (err) {

            throw new Error(err);

        }

    },

    findByEmail: async (email) => {

        try {

            let data = await Users.findOne({email: email});

            return data;

        } catch (err) {

            throw new Error(err);

        }

    }

};

userSchema.plugin(paginate);

const Users = services.mongoose.model('Users', userSchema);

module.exports = Users;
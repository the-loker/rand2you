
const model = require('../models');

module.exports = {

    isUniqueLogin: async function (login) {

        try {

            let data = await model.User.findByLogin(login);

            if(data) return Promise.reject();

        } catch (err) {

            throw new Error(err);

        }

    },

    isUniqueEmail: async function (email) {

        try {

            let data = await model.User.findByEmail(email);

            if(data) return Promise.reject();

        } catch (err) {

            throw new Error(err);

        }

    },

    checkEmail: async function (email) {

        try {

            let data = await model.User.findByEmail(email);

            if(!data) return Promise.reject();

        } catch (err) {

            throw new Error(err);

        }

    },

    isObjectId: function (data) {

        var regex = new RegExp("^[0-9a-fA-F]{24}$");

        if (!regex.test(data)) {

            return false;

        }

        return data;

    }

};
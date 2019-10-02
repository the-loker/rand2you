const nodeCache = require('node-cache');

const cache = new nodeCache({ checkperiod: 120 });

nodeCache.prototype.getAsync = (key) => {

    return new Promise(function (resolve, reject) {

        cache.get(key, function (err, result) {

            if(err) reject(err);

            resolve(result);

        });

    });

};

nodeCache.prototype.setAsync = (key, val, ttl) => {

    return new Promise(function (resolve, reject) {

        cache.set(key, val, ttl, function (err, result) {

            if(err) reject(err);

            resolve(result);

        });

    });

};

nodeCache.prototype.delAsync = (key) => {

    return new Promise(function (resolve, reject) {

        cache.del(key, function (err, result) {

            if(err) reject(err);

            resolve(result);

        });

    });

};

module.exports = cache;


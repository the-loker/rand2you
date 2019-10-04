
module.exports = (router) => {

    router.get('/', (req, res) => {
        res.json({
            title: 'Home'
        });
    });

}
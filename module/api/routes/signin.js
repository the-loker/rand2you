

module.exports = (router) => {

    router.get('/signin', (req, res) => {
        res.json({
            title: 'Sign in'
        });
    });

}
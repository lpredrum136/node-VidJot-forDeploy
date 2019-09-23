if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb+srv://lpredrum136:legolas136@vidjot-prod-lj3an.mongodb.net/test?retryWrites=true&w=majority'
    };
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/vidjot-dev'
    };
}
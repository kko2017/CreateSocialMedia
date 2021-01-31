module.exports = {
    head: {
        'title': 'ChitchatSM'
    },
    modules: [
        '@nuxtjs/axios'
    ],
    buildModules: [
        '@nuxtjs/vuetify'
    ],
    plugins: [

    ],
    vuetify: {

    },
    axios: {
        browserBaseURL: 'http://localhost:3085',
        baseURL: 'http://localhost:3085',
        https: false
    }
};

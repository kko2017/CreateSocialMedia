module.exports = {
    head: {
        'title': 'ChitchatSM'
    },
    modules: [
        '@nuxtjs/axios'
    ],
    buildModules: [
        '@nuxtjs/vuetify',
        '@nuxtjs/moment'
    ],
    moment: {
        locales: ['ko']
    },
    build: {
        analyze: false,
        extend(config, { isClient, isServer, isDev }) {
            if (isServer && !isDev) {
                config.devtool = 'hidden-source-map';
            }
            console.log('webpack', config, isServer, isClient);
        }
    },
    plugins: [

    ],
    vuetify: {

    },
    axios: {
        browserBaseURL: 'http://localhost:3085',
        baseURL: 'http://localhost:3085',
        https: false
    },
    server: {
        port: 3080
    }
};

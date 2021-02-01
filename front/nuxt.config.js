module.exports = {
    head: {
        title: 'ChitchatSM',
        meta: [{
            charset: 'utf-8',
        }, {
            name: 'viewport',
            content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover',
        }, {
            'http-equiv': 'X-UA-Compatible', content: 'IE=edge',
        }, {
            hid: 'description', name: 'description', content: 'ChitchatSM of FifthOh',
        }, {
            hid: 'ogtitle', name: 'og:title', content: 'ChichatSM',            
        }, {
            hid: 'ogdesc', name: 'og:description', content: 'ChitchatSM of FifthOh',
        }, {
            hid: 'ogtype', property: 'og:type', content: 'website',
        }, {
            hid: 'ogimg', property: 'og:image', content: '',
        }, {
            hid: 'ogurl', property: 'og:url', content: 'http://localhost:3080',
        }],
        link: [{ rel: 'shortcut icon', href: '/chitchat-sm.png' }],
    },
    modules: [
        '@nuxtjs/axios',
    ],
    buildModules: [
        '@nuxtjs/vuetify',
        '@nuxtjs/moment',
    ],
    moment: {
        locales: ['ko'],
    },
    build: {
        analyze: false,
        extend(config, { isClient, isServer, isDev }) {
            if (isServer && !isDev) {
                config.devtool = 'hidden-source-map';
            }
            // console.log('webpack', config, isServer, isClient);
        },
    },
    plugins: [

    ],
    vuetify: {

    },
    axios: {
        browserBaseURL: 'http://localhost:3085',
        baseURL: 'http://localhost:3085',
        https: false,
    },
    server: {
        port: 3080,
    }
};

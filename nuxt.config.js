const pkg = require('./package')
console.log('ENV', process.env.NODE_ENV)
console.log('API_URL', process.env.API_URL)

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    mode: 'universal',
    title: 'Psalms Global',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt Argon Dashboard PRO - Premium Admin Nuxt.js & Bootstrap 4 Dashboard' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: 'pg.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700'},
      { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.6.3/css/all.css', integrity: "sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/", crossorigin: "anonymous"}
    ]
  },

  router: {
    base: '/',
    middleware: ["auth"],
    linkExactActiveClass: 'active'
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    'assets/css/nucleo/css/nucleo.css',
    'assets/sass/argon.scss'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/dashboard/dashboard-plugin',
    {src: '~/plugins/dashboard/full-calendar', ssr: false },
    {src: '~/plugins/dashboard/world-map', ssr: false },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/auth-next',
    'bootstrap-vue/nuxt',
  ],
  bootstrapVue: {
    // Install the `IconsPlugin` plugin (in addition to `BootstrapVue` plugin)
    icons: true
  },
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.API_URL || "http://127.0.0.1:8000/",
  },
  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.BROWSER_BASE_URL
    }
  },
  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL
    }
  },
  auth: {
		strategies: {
			local: {
				scheme: "refresh",
				endpoints: {
					login: {
						url: "api/auth/jwt/create/",
						method: "post",
						propertyName: "access"
					},
					user: {
						url: "api/auth/users/me/",
						method: "get",
						propertyName: false
					},
					refresh: {
						url: "api/auth/jwt/refresh/",
						method: "post"
					},
					logout: false
				},
				token: {
					property: "access",
					type: "jwt",
					maxAge: 60 * 5 // 5 minutes
				},
				user: {
					property: ""
				},
				refreshToken: {
					property: "refresh",
					data: "refresh",
					maxAge: 60 * 60 * 24
				},
				tokenRequired: true,
				tokenType: "jwt",
				globalToken: true
			}
		}
	},

  /*
  ** Build configuration
  */
  build: {
    transpile: [
      'vee-validate/dist/rules'
    ],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    },
    extractCSS: process.env.NODE_ENV === 'production',
    babel: {
      plugins: [
        [
          "component",
          {
            "libraryName": "element-ui",
            "styleLibraryName": "theme-chalk"
          }
        ]
      ]
    }
  }
}

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { apolloProvider } from './plugins'
import './assets/scss/index.scss'
import './filters'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    // inject apolloProvider here like vue-router or vuex
    apolloProvider,
    render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Admin from "../views/Admin"
import Index from '../views/Index'
import Banner from '../components/Banner'
import Contact from '../views/Contact'
import Tutorial from '../views/Tutorial'
import AffilateProgramme from '../views/AffilateProgramme'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'index',
        components: {
            default: Index,
            banner: Banner
        }
    },
    {
        path: '/contact',
        name: 'contact',
        components: {
            default: Contact
        }
    },
    {
        path: '/tutorial',
        name: 'tutorial',
        components: {
            default: Tutorial
        }
    },
    {
        path: '/affiliate-programme',
        name: 'affiliate-programme',
        components: {
            default: AffilateProgramme
        }
    },
    {
        path: '/home',
        name: 'home',
        component: Home
    },
    {
        path: '/admin',
        name: 'admin',
        component: Admin
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router

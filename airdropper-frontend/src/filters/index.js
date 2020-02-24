import Vue from 'vue'
import store from '../store'
import gb from '../assets/json/gb'
import ru from '../assets/json/ru'
import kr from '../assets/json/kr'
import cn from '../assets/json/cn'

const langs = {gb, ru, kr, cn}

Vue.filter('lang', key => {
    const lang = store.getters.lang
    return (langs[lang] || gb)[key]
})

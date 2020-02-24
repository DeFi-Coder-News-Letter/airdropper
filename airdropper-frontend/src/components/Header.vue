<template>
    <header>
        <div class="main_header">
            <div class="container">
                <nav class="navbar navbar-expand-lg navbar-light">
                    <router-link class="navbar-brand" :to="{ name: 'index' }"><img src="../assets/images/logo.png" alt=""></router-link>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ml-auto">
                            <li class="nav-item">
                                <router-link class="nav-link" :to="{ name:'tutorial' }">{{ 'instructions' | lang }}</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" :to="{ name:'affiliate-programme' }">{{ 'affiliate_programme' | lang }}</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" :to="{ name:'contact' }"> {{'contact' | lang }}</router-link>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="https://breakbyte.com/multisend-credits/">{{ 'credits' | lang}}<span>0</span></a>
                            </li>
                            <li class="nav-item">
                                <b-dropdown size="sm" split>
                                    <template v-slot:button-content>
                                        <img :src="`https://www.countryflags.io/${lang}/flat/16.png`" alt=""/>
                                    </template>
                                    <b-dropdown-item @click="changeLang('gb')" v-if="lang !== 'gb'">
                                        <img :src="`https://www.countryflags.io/gb/flat/16.png`" alt=""/>
                                    </b-dropdown-item>
                                    <b-dropdown-item @click="changeLang('kr')" v-if="lang !== 'kr'">
                                        <img :src="`https://www.countryflags.io/kr/flat/16.png`" alt=""/>
                                    </b-dropdown-item>
                                    <b-dropdown-item @click="changeLang('ru')" v-if="lang !== 'ru'">
                                        <img :src="`https://www.countryflags.io/ru/flat/16.png`" alt=""/>
                                    </b-dropdown-item>
                                    <b-dropdown-item @click="changeLang('cn')" v-if="lang !== 'cn'">
                                        <img :src="`https://www.countryflags.io/cn/flat/16.png`" alt=""/>
                                    </b-dropdown-item>
                                </b-dropdown>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
    </header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: "Header",
    computed: {
        ...mapGetters(['lang'])
    },
    methods: {
        ...mapActions(['changeLang'])
    }
}
</script>

<style scoped>

</style>

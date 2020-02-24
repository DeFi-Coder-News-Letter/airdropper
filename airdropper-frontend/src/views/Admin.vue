<template>
    <div>
        <div class="text-center">
            <h1>Admin</h1>
            <b-button variant="link" @click="tabSelect('fees')">Fees</b-button>
            <span>|</span>
            <b-button variant="link" @click="tabSelect('credits')">Credits</b-button>
            <span>|</span>
            <b-button variant="link" @click="tabSelect('whitelisting')">Whitelisting</b-button>
        </div>
        <Fees v-if="selectedTab === 'fees'" />
        <Credits v-if="selectedTab === 'credits'" />
        <Whitelisting v-if="selectedTab === 'whitelisting'" />
    </div>
</template>

<script>
    import Fees from "../components/admin/Fees";
    import Credits from "../components/admin/Credits";
    import Whitelisting from "../components/admin/Whitelisting";

    export default {
        name: "Admin",
        components: {Fees,Credits, Whitelisting},
        data() {
            return {
                selectedTab: 'fees'
            }
        },
        methods: {
            tabSelect(tab) {
                this.selectedTab = tab;
            }
        }
    }
</script>

<style scoped>

</style>
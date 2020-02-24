<template>
    <div>
        <div class="mt-3"><label for="newWhitelistInput">Add new whitelist</label></div>
        <input id="newWhitelistInput" class="form-control w-50" v-model="newAddress" placeholder="0x123..."/>
        <b-button variant="dark" class="mt-2" @click="whitelist" :disabled="!newAddress">
            <span v-if="!whitelisting">Add</span>
            <SmallSpinner v-else/>
        </b-button>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import { EventBus } from "../../../event-bus";
    import SmallSpinner from "../../SmallSpinner";

    export default {
        name: "AddNewWhitelist",
        components: {SmallSpinner},
        computed: {
            ...mapGetters(['contracts'])
        },
        data() {
            return {
                whitelisting: false,
                newAddress: ''
            };
        },
        methods: {
            async whitelist() {
                this.whitelisting = true;
                const {AccessWhitelist} = this.contracts;
                const tx = await AccessWhitelist.addWhitelisted(this.newAddress);
                const receipt = await tx.wait(1);
                console.log('addWhitelisted receipt', receipt);
                this.newAddress = '';
                this.whitelisting = false;
                EventBus.$emit('address-whitelisted');
            }
        }
    }
</script>

<style scoped>

</style>
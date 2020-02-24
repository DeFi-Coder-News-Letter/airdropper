<template>
    <span class="badge badge-light">PRICE PER AIRDROP TX: {{ pricePerTx }} ETH</span>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {ethers} from 'ethers';
    import { EventBus } from "../event-bus";

    export default {
        name: "TxPrice",
        computed: {
            ...mapGetters(['contracts'])
        },
        data() {
            return {
                pricePerTx: null,
            }
        },
        async mounted() {
            if (this.contracts) {
                await this.getPricePerTx();
            }

            EventBus.$on('price-per-tx-updated', () => {
                this.getPricePerTx();
            });
        },
        methods: {
            async getPricePerTx() {
                const {ERC20Airdropper} = this.contracts;
                this.pricePerTxInWei = await ERC20Airdropper.pricePerTx();
                this.pricePerTx = ethers.utils.formatEther(this.pricePerTxInWei);
            }
        },
        watch: {
            'contracts': async function (newVal, oldVal) {
                if(newVal && !oldVal) {
                    await this.getPricePerTx();
                }
            }
        }
    }
</script>

<style scoped>

</style>
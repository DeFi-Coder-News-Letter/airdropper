<template>
    <div class="container">
        <TxPrice />
        <div class="mt-3"><label for="newPriceInput">Update Price Per Transaction (ETH)</label></div>
        <input id="newPriceInput" class="form-control w-50" v-model="newPrice" placeholder="0.1"/>
        <b-button variant="dark" class="mt-2" @click="updatePricePerTx" :disabled="!newPrice || newPrice === '0' || newPrice === '0.'">
            <span v-if="!updating">Update</span>
            <SmallSpinner v-else/>
        </b-button>
    </div>
</template>

<script>
    import {ethers} from 'ethers';
    import {mapGetters} from 'vuex';
    import { EventBus } from "../../event-bus";
    import TxPrice from "../TxPrice";
    import SmallSpinner from "../SmallSpinner";

    export default {
        name: "Fees",
        components: {TxPrice, SmallSpinner},
        computed: {
            ...mapGetters(['contracts'])
        },
        data() {
            return {
                updating: false,
                newPrice: ''
            }
        },
        methods: {
            async updatePricePerTx() {
                this.updating = true;
                const weiPrice = ethers.utils.parseEther(this.newPrice);
                const {ERC20Airdropper} = this.contracts;
                const tx = await ERC20Airdropper.setPricePerTx(weiPrice);
                const receipt = await tx.wait(1);
                console.log('Set price per tx receipt', receipt);
                this.newPrice = '';
                this.updating = false;
                EventBus.$emit('price-per-tx-updated');
            }
        }
    }
</script>

<style scoped>

</style>
<template>
    <div>
        <SmallSpinner v-if="loading"/>
        <p v-else-if="!addresses.length">There are currently no whitelisted addresses...</p>
        <div v-else>
            <h4>Whitelisted Addresses</h4>
            <table class="table table-striped table-borderless">
                <tbody>
                <tr v-for="(address, idx) in addresses" :key="idx">
                    <td class="v-align-middle">
                        {{address}}
                    </td>
                    <td class="text-right">
                        <b-button variant="dark" @click="removeWhitelist(address)">
                            <span v-if="!removingWhitelist[address]">Remove Whitelist</span>
                            <SmallSpinner v-else/>
                        </b-button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {EventBus} from "../../../event-bus";
    import SmallSpinner from "../../SmallSpinner";
    import utils from "../../../utils";

    export default {
        name: "WhitelistedAddresses",
        components: {SmallSpinner},
        computed: {
            ...mapGetters(['contracts', 'chain', 'provider'])
        },
        data() {
            return {
                loading: true,
                addresses: [],
                removingWhitelist: {},
            };
        },
        mounted() {
            if (this.contracts) {
                this.fetchFullWhitelist();
            }

            EventBus.$on('address-whitelisted', () => {
                this.fetchFullWhitelist();
            });
        },
        methods: {
            async removeWhitelist(address) {
                this.removingWhitelist[address] = true;
                const {AccessWhitelist} = this.contracts;
                const tx = await AccessWhitelist.removeWhitelisted(address);
                const receipt = await tx.wait(1);
                console.log('removeWhitelisted receipt', receipt);
                this.removingWhitelist[address] = false;
                this.fetchFullWhitelist();
            },
            async fetchFullWhitelist() {
                const {AccessWhitelist} = this.contracts;
                this.addresses = await this.getWhitelistedAddresses(
                    'WhitelistedAdded',
                    'WhitelistedRemoved',
                    AccessWhitelist,
                    'AccessWhitelist',
                    this.provider,
                    this.chain
                );

                let removingWhitelist = {};
                this.addresses.forEach(address => removingWhitelist[address] = false);
                this.removingWhitelist = removingWhitelist;

                this.loading = false;
            },
            async getWhitelistedAddresses(addedEventName, removedEventName, contract, contractName, provider, chain) {
                const whitelistedAddedCount = {};
                const addedAccounts = (await utils.fetchEvents(
                    addedEventName,
                    contract,
                    provider,
                    utils.getDeploymentBlock(contractName, chain.chainId)
                )).map(event => {
                    const address = event.account;
                    whitelistedAddedCount[address] =
                        whitelistedAddedCount[address] ? whitelistedAddedCount[address] + 1 : 1;
                    return address;
                });

                if (!addedAccounts.length) return [];

                const whitelistedRemovedCount = {};
                (await utils.fetchEvents(
                    removedEventName,
                    contract,
                    provider,
                    utils.getDeploymentBlock(contractName, chain.chainId)
                )).map(event => {
                    const address = event.account;
                    whitelistedRemovedCount[address] =
                        whitelistedRemovedCount[address] ? whitelistedRemovedCount[address] + 1 : 1;
                    return address;
                });

                const currentlyWhitelistedAddresses = [];
                Object.keys(whitelistedAddedCount).forEach(address => {
                    const addedCount = whitelistedAddedCount[address];
                    const removedCount = whitelistedRemovedCount[address] ?
                        whitelistedRemovedCount[address] : 0;

                    if (addedCount > removedCount) {
                        currentlyWhitelistedAddresses.push(address);
                    }
                });

                return currentlyWhitelistedAddresses;
            }
        },
        watch: {
            'contracts': function (newVal, oldVal) {
                if (newVal && !oldVal) {
                    this.fetchFullWhitelist();
                }
            }
        }
    }
</script>

<style scoped>
    .v-align-middle {
        vertical-align: inherit;
    }
</style>
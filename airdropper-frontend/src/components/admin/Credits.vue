<template>
    <div class="container">
        <div class="row mt-3 mb-5">
            <div class="col">
                <h4 class="mb-2">Add Credits</h4>
                <div class="w-100">
                    <label for="add-address-input" class="mr-2 fixed-width-label">
                        Address:
                    </label>
                    <input id="add-address-input"
                           class="w-75 d-inline-block form-control"
                           placeholder="0x123..."
                           v-model="add.address" />
                </div>
                <div class="w-100 mt-1">
                    <label for="add-amount-input" class="mr-2 fixed-width-label">
                        Amount:
                    </label>
                    <input id="add-amount-input"
                           class="w-75 d-inline-block form-control"
                           placeholder="1"
                           v-model="add.amount" />
                </div>
                <b-button variant="dark" class="mt-2" @click="onAdd">
                    <span v-if="!add.adding">Add</span>
                    <SmallSpinner v-else />
                </b-button>
            </div>
            <div class="col">
                <h4 class="mb-2">Reduce Credits</h4>
                <div class="w-100">
                    <label for="reduce-address-input" class="mr-2 fixed-width-label">
                        Address:
                    </label>
                    <input id="reduce-address-input"
                           class="w-75 d-inline-block form-control"
                           placeholder="0x123..."
                           v-model="reduce.address"/>
                </div>
                <div class="w-100 mt-1">
                    <label for="reduce-amount-input" class="mr-2 fixed-width-label">
                        Amount:
                    </label>
                    <input id="reduce-amount-input"
                           class="w-75 d-inline-block form-control"
                           placeholder="1"
                           v-model="reduce.amount"/>
                </div>
                <b-button variant="dark" class="mt-2" @click="onReduce" :disabled="false">
                    <span v-if="!reduce.reducing">Reduce</span>
                    <SmallSpinner v-else/>
                </b-button>
            </div>
        </div>
        <h5>All users</h5>
        <table class="table table-striped table-borderless" v-if="!$apollo.loading && airdropUsers && airdropUsers.length">
            <thead>
            <tr>
                <th class="text-center">Address</th>
                <th class="text-center">Credits</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(user, idx) in airdropUsers" :key="idx">
                <td class="v-align-middle text-center">
                    {{user._address}}
                </td>
                <td class="text-center">
                    {{user.credits}}
                </td>
            </tr>
            </tbody>
        </table>
        <p v-else-if="airdropUsers && !airdropUsers.length">There are currently no users with credits.</p>
        <SmallSpinner v-else />
    </div>
</template>

<script>
    import gql from 'graphql-tag'
    import {mapGetters} from 'vuex';
    import SmallSpinner from "../SmallSpinner";

    export default {
        name: "Credits",
        components: {SmallSpinner},
        computed: {
          ...mapGetters(['contracts']),
        },
        apollo: {
            airdropUsers: {
                query: gql`query {
                    airdropUsers(where: {credits_gt: 0}) {
                      credits
                      _address
                    }
                }`,
                pollInterval: 300, // ms
            }
        },
        data() {
            return {
                add: {
                    adding: false,
                    address: '',
                    amount: ''
                },
                reduce: {
                    reducing: false,
                    address: '',
                    amount: ''
                },
                airdropUsers: []
            };
        },
        methods: {
            async onAdd() {
                this.add.adding = true;
                const {ERC20Airdropper} = this.contracts;
                const {address, amount} = this.add;
                const tx = await ERC20Airdropper.addCredit(address, amount);
                const receipt = await tx.wait(1);
                console.log('Add credits receipt', receipt);
                this.add.adding = false;
            },
            async onReduce() {
                this.reduce.reducing = true;
                const {ERC20Airdropper} = this.contracts;
                const {address, amount} = this.reduce;
                const tx = await ERC20Airdropper.reduceCredit(address, amount);
                const receipt = await tx.wait(1);
                console.log('Reduce credits receipt', receipt);
                this.reduce.reducing = false;
            }
        }
    }
</script>

<style scoped>
    .fixed-width-label {
        width: 80px;
    }
</style>
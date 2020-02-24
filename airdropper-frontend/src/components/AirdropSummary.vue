<template>
    <div class="mt-3">
        <div class="row">
            <div class="col-6">
                <b-card header-tag="header" footer-tag="footer" class="bg-yellowy">
                    <template v-slot:header>
                        <h6 class="mb-0">Total number of addresses</h6>
                    </template>
                    <b-card-text>
                        <strong>{{airdropData.addressCount}}</strong> addresses
                    </b-card-text>
                </b-card>
            </div>
            <div class="col-6">
                <b-card header-tag="header" footer-tag="footer" class="bg-yellowy">
                    <template v-slot:header>
                        <h6 class="mb-0">Tokens to send</h6>
                    </template>
                    <b-card-text>
                        <strong>{{airdropData.tokenCount}}</strong> {{symbol}}
                    </b-card-text>
                </b-card>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-6">
                <b-card header-tag="header" footer-tag="footer" class="bg-yellowy">
                    <template v-slot:header>
                        <h6 class="mb-0">Allowance</h6>
                    </template>
                    <b-card-text>
                        <strong>{{airdropData.allowance}}</strong> {{symbol}}
                    </b-card-text>
                </b-card>
            </div>
            <div class="col-6">
                <b-card header-tag="header" footer-tag="footer" class="bg-yellowy">
                    <template v-slot:header>
                        <h6 class="mb-0">Balance</h6>
                    </template>
                    <b-card-text>
                        <strong>{{airdropData.balance}}</strong> {{symbol}}
                    </b-card-text>
                </b-card>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-6">
                <b-card header-tag="header" footer-tag="footer" class="bg-yellowy">
                    <template v-slot:header>
                        <h6 class="mb-0">Number of transactions required</h6>
                    </template>
                    <b-card-text>
                        <strong>{{airdropData.txCount}}</strong>
                    </b-card-text>
                </b-card>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AirdropSummary",
        props: ['airdropData', 'symbol']
    }
</script>

<style scoped>

</style>
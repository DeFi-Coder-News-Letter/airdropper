<template>
    <div class="container my-4">

        <div class="row">
            <div class="col-8" style="padding-left: 30px;">
                Step {{currentStep}} of {{totalStepsRequiredToSetupAirdrop}}: {{wizard.stepInfo}}
            </div>
            <div class="col-4 text-right">
                <div>
                    <span class="badge badge-light" v-if="credits && credits > 0">CREDITS: {{ credits }}</span>
                    <TxPrice v-else/>
                </div>
            </div>
        </div>

        <div v-if="wizard.currentStep === 1">
            <div class="row">
                <div class="col-8">
                    <b-form novalidate>
                        <b-form-group
                                id="token-addr-group"
                                label="ERC20 Token to Airdrop"
                                label-for="token-addr"
                                class="p-3"
                                description="this bit is quite important, double check it">

                            <v-select label="tokenName" :options="tokensInAccount" @input="setSelected" :filter-by="filterBy">
                                <template v-slot:option="option">
                                    ({{ option.tokenSymbol }}) {{ option.tokenName }} - {{ option.contractAddress }}
                                </template>
                            </v-select>

                            <b-form-input
                                    hidden
                                    id="token-addr"
                                    v-model="form.token"
                                    :disabled="true"
                                    type="text"
                                    required
                                    @change="checkAllowance"
                                    placeholder="0xABC">
                            </b-form-input>


                        </b-form-group>
                    </b-form>
                </div>
                <div class="col-4">
                    <div style="padding-top: 50px;" class="text-right">
                        <span class="badge badge-dark" v-if="symbol">SYMBOL: {{ symbol }}</span>
                        <span class="badge badge-dark" v-if="symbol">DP: {{ decimals }}</span>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <b-form @input="onValidateInputs" novalidate>
                        <b-form-group
                                id="csv-group"
                                label="CSV Data"
                                label-for="csv-group-data"
                                description="Max of 200 addresses per transaction"
                                class="p-3"
                                :class="{'bg-yellowy': !valid, 'bg-greeny': valid}">

                            <span class="badge badge-danger float-right m-2 " v-if="batchLen">
                                BATCHES: {{ batchLen}}
                            </span>
                            <span class="badge badge-danger float-right m-2 " v-if="rowLen">
                                ROWS: {{ rowLen}}
                            </span>
                            <span class="badge badge-danger float-right m-2" v-if="totalValue">
                                TOTAL: {{ totalValue}}
                            </span>

                            <b-form-textarea
                                    id="csv-group-data"
                                    v-model="form.csvData"
                                    placeholder="0x3f8C962eb167aD2f80C72b5F933511CcDF0719D4,123"
                                    rows="15"
                                    max-rows="250"></b-form-textarea>
                        </b-form-group>

                        <b-form-file class="mb-3"
                                     accept=".csv"
                                     :state="Boolean(form.file)"
                                     v-model="form.file">
                        </b-form-file>

                        <div class="my-2 text-danger" v-if="invalidRows.length">
                            <div>The following rows will not be part of the airdrop as they are invalid:</div>
                            <table class="table-striped my-3">
                                <thead>
                                    <tr>
                                        <th class="p-2">Address</th>
                                        <th class="p-2">Amount Due ({{ symbol }})</th>
                                        <th class="p-2">Offending Line</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row,idx) in invalidRows" :key="idx">
                                        <td class="p-2">
                                            {{row[0]}}
                                        </td>
                                        <td class="p-2">
                                            {{row[1]}}
                                        </td>
                                        <td class="p-2">
                                            {{row[2]}}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div>
                                If you are still happy to proceed, then please click 'Next' or go back and fix the errors.
                            </div>
                        </div>

                        <b-button variant="primary" size="lg" class="float-right"
                                  @click="nextStep(1)" :disabled="!valid">
                            Next
                        </b-button>

                    </b-form>
                </div>
            </div>
        </div>
        <div class="row" v-if="wizard.currentStep === 2">
            <div class="col">
                <div class="mt-4">
                    <b-alert variant="warning" show>
                        <div>You must approve the Airdropper for the amount of tokens you wish to send!</div>
                        <div class="mt-2">
                            <span v-if="allowance">Your current allowance is {{ allowance }} {{ symbol }}</span>
                        </div>
                        <div>You wish to send {{totalValue}} {{ symbol }}</div>
                    </b-alert>
                </div>
                <b-button size="lg" variant="primary" class="float-right ml-2"
                          @click="approveAllowance" :disabled="approving">
                    <span v-if="!approving">Approve {{totalValue}} {{ symbol }}</span>
                    <SmallSpinner v-else/>
                </b-button>
                <b-button size="lg" variant="danger" class="float-right"
                          @click="goBack(2)" :disabled="approving">
                    Back
                </b-button>
                <div class="cf text-right py-3" v-if="approveTx">
                    <a :href="approveTx">[ View TX ]</a>
                </div>
            </div>
        </div>
        <div class="row" v-if="wizard.currentStep === 3">
            <div class="col">
                <AirdropSummary :airdropData="airdropData" :symbol="symbol"/>
                <b-button variant="primary" size="lg" class="float-right ml-2"
                          @click="onSubmit" :disabled="airdropping" v-if="!airdropComplete">
                    <span v-if="!airdropping">Confirm Airdrop</span>
                    <SmallSpinner v-else/>
                </b-button>
                <b-button size="lg" variant="danger" class="float-right"
                          @click="goBack(2)" :disabled="airdropping" v-if="!airdropComplete">
                    Back
                </b-button>
                <b-button size="lg" variant="danger" class="float-right"
                          @click="startOver" v-if="airdropComplete">
                    Start Over
                </b-button>
                <div class="cf text-right py-3" v-if="notEnoughCredits">
                    You don't have enough credits to complete this airdrop. Some batches will require payment.
                </div>
                <div class="cf text-right py-3" v-if="airdropTxs && airdropTxs.length">
                    <div v-for="(tx, idx) in airdropTxs">
                        <a :href="tx" :key="idx">[ View TX ]</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-5">
            <div class="col">
                <NetworkBadge :chain="chain"/>
            </div>
        </div>
    </div>
</template>

<script>
    import {ethers} from 'ethers';
    import _ from 'lodash';
    import notify from 'bnc-notify';
    import {mapGetters, mapState} from "vuex";
    import TxPrice from "../components/TxPrice";
    import NetworkBadge from '../components/NetworkBadge';
    import AirdropSummary from "../components/AirdropSummary";
    import SmallSpinner from "../components/SmallSpinner";
    import utils from '../utils';
    import erc20Abi from '../abi/erc20.abi';
    import ERC20Airdropper from '../truffleconf/ERC20Airdropper';

    const notifyInstance = notify({
        dappId: '93470207-965c-447c-b3c5-31851a1fb2e7',
        networkId: 1,
        darkMode: true,
        desktopPosition: 'topRight',
    });

    // const gigsToken = '0xf34845b76015d2952b6e39436bc59cae3c9ba17d'; // main
    //const testToken = '0xF2EdDb034c56aB63837875DF3cBDC3f0F53f8902'; // rinkeby

    export default {
        name: 'home',
        components: {NetworkBadge, TxPrice, AirdropSummary, SmallSpinner},
        computed: {
            ...mapState(['tokensInAccount']),
            ...mapGetters(['contracts', 'account', 'chain', 'signer', 'provider']),
            airdropData() {
                return {
                    addressCount: this.rowLen,
                    tokenCount: this.totalValue,
                    allowance: this.allowance,
                    balance: this.balance,
                    txCount: this.batchLen
                };
            },
            hasEnoughAllowance() {
                return this.allowance && this.totalValue && Number(this.allowance) >= Number(this.totalValue);
            },
            totalStepsRequiredToSetupAirdrop() {
                return this.hasEnoughAllowance ? 2 : 3;
            },
            currentStep() {
                if (this.totalStepsRequiredToSetupAirdrop === 2 && this.wizard.currentStep === 3) {
                    return 2;
                } else {
                    return this.wizard.currentStep;
                }
            },
            invalidRows() {
                if(!this.form.csvData) return [];
                const csvArray = this.csvDataToArrays(this.form.csvData);

                const invalidRows = [];
                csvArray.forEach((row, idx) => {
                    // Row invalid if true
                    if (row.length === 1) {
                        invalidRows.push(
                            [
                                row[0] && row[0].trim() ? row[0].trim() : 'Undefined',
                                'Undefined',
                                idx+1
                            ]
                        );
                        return;
                    }

                    // Check address
                    const address = row[0] && row[0].trim() ? row[0].trim() : null;
                    if (!address) {
                        invalidRows.push(
                            [
                                ...row,
                                idx+1
                            ]
                        );
                        return;
                    }
                    try {
                        ethers.utils.getAddress(address);
                    } catch (e) {
                        invalidRows.push(
                            [
                                ...row,
                                idx+1
                            ]
                        );
                        return;
                    }

                    //Validate value supplied
                    if (row.length === 2 && !row[1]) {
                        // Empty value supplied
                        invalidRows.push(
                            [
                                row[0],
                                'Undefined',
                                idx+1
                            ]
                        );
                        return;
                    }

                    if (row.length > 2) {
                        // Too many delimiters / values supplied
                        invalidRows.push(
                            [
                                'Undefined',
                                'Undefined',
                                idx+1
                            ]
                        );
                        return;
                    }
                });

                return invalidRows;
            },
            csvDataFilteredForValidRowsOnly() {
                if(!this.form.csvData) return [];

                return (this.csvDataToArrays(this.form.csvData) || []).filter(row => {
                    // Row invalid if true
                    if (row.length === 1) {
                        return false;
                    }

                    if (row.length === 2 && !row[1]) {
                        // Empty value supplied
                        return false;
                    }

                    if (row.length > 2) return false;

                    const address = row[0] && row[0].trim() ? row[0].trim() : null;
                    if(!address) return false;
                    try {
                        ethers.utils.getAddress(address);
                        return true;
                    } catch (e) {
                        return false;
                    }
                });
            },
            notEnoughCredits() {
                if(!this.credits || !this.batchLen) return false;
                const credits = Number(this.credits);
                return credits > 0 && (Number(this.batchLen) > credits);
            }
        },
        data() {
            return {
                mazBatchSize: 200,
                credits: null,
                pricePerTxInWei: null,
                pricePerTx: null,
                balance: null,
                valid: null,
                rowLen: null,
                batchLen: null,
                totalValue: null,
                allowance: null,
                symbol: null,
                decimals: null,
                approving: false,
                approveTx: null,
                airdropTxs: [],
                confirmedAirdropTxs: [],
                airdropping: false,
                airdropComplete: false,
                form: {
                    token: null,
                    file: null,
                    amountToApprove: null,
                    csvData: null,
                },
                wizard: {
                    currentStep: 1,
                    stepInfo: 'Configure Airdrop Params (Push)'
                }
            };
        },
        methods: {
            setSelected(value) {
                this.form.token = value ? value.contractAddress : '';
                this.checkAllowance();
            },
            filterBy(option, label, search) {
                if(option.tokenSymbol && option.tokenSymbol.toLowerCase().indexOf(search.toLowerCase()) > -1){
                    return true;
                }
                if(option.tokenName && option.tokenName.toLowerCase().indexOf(search.toLowerCase()) > -1){
                    return true;
                }
                if(option.contractAddress && option.contractAddress.toLowerCase().indexOf(search.toLowerCase()) > -1){
                    return true;
                }
                return false;
            },
            async getPricePerTx() {
                const {ERC20Airdropper} = this.contracts;
                this.pricePerTxInWei = await ERC20Airdropper.pricePerTx();
                this.pricePerTx = ethers.utils.formatEther(this.pricePerTxInWei);
            },
            nextStep(from) {
                if(from === 1) {
                    const skipToStep3 = this.totalStepsRequiredToSetupAirdrop === 2;
                    this.wizard.currentStep = skipToStep3 ? 3 : 2;
                } else {
                    this.wizard.currentStep = 3;
                }

                if(this.wizard.currentStep === 2) {
                    this.wizard.stepInfo = 'Increase Airdropper Token Allowance'
                } else {
                    this.wizard.stepInfo = 'Confirm Airdrop'
                }
            },
            goBack(from) {
                this.wizard.currentStep = from - 1;
            },
            startOver() {
                this.airdropComplete = false;
                this.airdropTxs = [];
                this.confirmedAirdropTxs = [];
                this.goBack(2);
            },
            async onSubmit() {
                if (this.form.token && this.form.csvData) {
                    this.form.csvData = this.form.csvData.replace(/\n$/, ''); // drop last newline

                    if (parseFloat(this.allowance) < parseFloat(this.totalValue)) {
                        alert('Allowance not enough');
                        return;
                    }

                    this.airdropping = true;

                    let nonce = await this.provider.getTransactionCount(this.account);

                    const chunks = _.chunk(this.csvDataFilteredForValidRowsOnly, this.mazBatchSize);

                    _.map(chunks, (chunk, idx) => {
                        console.log(idx + 1 > Number(this.credits) ? this.pricePerTxInWei : 0);

                        const addresses = chunk.map(vals => vals[0].replace(/\n$/, '').replace(/\r$/, '').trim());
                        const values = chunk.map(vals => ethers.utils.parseUnits(vals[1].replace(/\n$/, '').replace(/\r$/, '').trim(), this.decimals));

                        const {ERC20Airdropper} = this.contracts;
                        const contractCall = {
                            methodName: 'transfer',
                            params: [this.form.token, addresses, values]
                        };

                        const updateUIWhenDone = async tx => {
                            await tx.wait(2);
                            this.confirmedAirdropTxs.push(tx);

                            if (this.confirmedAirdropTxs.length === this.airdropTxs.length) {
                                this.airdropping = false;
                                this.form.csvData = null;
                                this.checkAllowance();
                                this.checkCredits();
                                this.airdropComplete = true;
                            }
                        };

                        const sendTransaction = async () => {
                            try {
                                const tx = await ERC20Airdropper.transfer(
                                    ...contractCall.params,
                                    {
                                        value: idx + 1 > Number(this.credits) ? this.pricePerTxInWei : 0,
                                        nonce: ++nonce,
                                    }
                                );

                                this.airdropTxs.push(`https://rinkeby.etherscan.io/tx/${tx.hash}`);
                                updateUIWhenDone(tx);
                                return tx.hash;
                            } catch(e) {
                                this.airdropping = false;
                                return null;
                            }
                        };

                        notifyInstance.transaction({
                            sendTransaction,
                            contractCall
                        });
                    });

                }
            },

            async onValidateInputs() {
                console.log('onValidateInputs');

                if (!this.form.csvData) return false;

                let allValuesValid = null;
                let values = null;

                const csvArray = this.csvDataFilteredForValidRowsOnly;
                const addresses = csvArray.map(vals => vals[0].trim());

                try {
                    values = csvArray.map(vals => {
                        if (vals.length === 1) return '-1'; // No value has been supplied
                        if (vals.length === 2 && !vals[1]) return '-1'; // Empty value supplied
                        if (vals.length > 2) return '-1'; // Too many delimiters / values supplied
                        return ethers.utils.parseUnits(vals[1].trim(), this.decimals)
                    });
                    console.log('values', values);
                    const invalidValues = values.filter(value => value.toString() === '-1');
                    allValuesValid = !invalidValues.length;
                } catch (e) {
                    console.error(e);
                    allValuesValid = false;
                }

                let allAddressesValid = addresses.every(addrToCheck => {
                    if(!addrToCheck) return false;
                    try {
                        ethers.utils.getAddress(addrToCheck);
                        return true;
                    } catch (e) {
                        console.error(e);
                        return false;
                    }
                });

                console.log('Addresses', addresses);
                console.log('Addresses VALID', allAddressesValid);

                console.log('Values', values && values.map(value => value.toString()));
                console.log('Values VALID', allValuesValid);

                this.valid = allAddressesValid && allValuesValid;

                if (this.valid) {
                    this.rowLen = values.length;
                    this.totalValue = values && ethers.utils.formatUnits(values.reduce((accum, value) => accum.add(value), ethers.utils.bigNumberify('0')).toString(), this.decimals);
                    this.batchLen = Math.ceil(values.length / this.mazBatchSize);
                }
                return allAddressesValid && allValuesValid;
            },
            async checkAllowance() {
                console.log('checkAllowance');
                if (this.form.token && this.account) {
                    const airdropperAddress = utils.getContractAddressFromTruffleConf(ERC20Airdropper, this.chain.chainId);
                    const erc20 = new ethers.Contract(
                        this.form.token,
                        erc20Abi,
                        this.signer,
                    );

                    this.symbol = await erc20.symbol();
                    this.decimals = await erc20.decimals();

                    const weiBalance = (await erc20.balanceOf(this.account));
                    this.balance = ethers.utils.formatUnits(weiBalance, this.decimals);
                    console.log('balance', weiBalance.toString());
                    this.allowance = ethers.utils.formatUnits((await erc20.allowance(this.account, airdropperAddress)), this.decimals);
                    console.log('allowance', this.allowance.toString());
                } else {
                    this.decimals = '';
                    this.symbol = '';
                    this.balance = '';
                    this.allowance = '';
                }
            },
            async approveAllowance() {
                console.log('approveAllowance');
                if (this.form.token && this.account) {
                    this.approving = true;
                    const airdropperAddress = utils.getContractAddressFromTruffleConf(ERC20Airdropper, this.chain.chainId);
                    const erc20 = new ethers.Contract(
                        this.form.token,
                        erc20Abi,
                        this.signer,
                    );

                    const contractCall = {
                        methodName: 'approve',
                        params: [airdropperAddress, ethers.utils.parseUnits(this.totalValue, this.decimals)]
                    };

                    const updateUIWhenDone  = async tx => {
                        this.approveTx = `https://rinkeby.etherscan.io/tx/${tx.hash}`;

                        const receipt = await tx.wait(2);
                        console.log('Allowance receipt', receipt);

                        // Refresh UI
                        this.nextStep(2);
                        this.checkAllowance();
                        this.approving = false;
                        this.approveTx = null;
                    };

                    const sendTransaction = async () => {
                        try {
                            const tx = await erc20.approve(...contractCall.params);
                            updateUIWhenDone(tx);
                            return tx.hash;
                        } catch(e) {
                            this.approving = false;
                            this.approveTx = null;
                            return null;
                        }
                    };

                    await notifyInstance.transaction({
                        sendTransaction,
                        contractCall
                    });
                }
            },
            async checkCredits() {
                console.log('checking credits');
                const {ERC20Airdropper} = this.contracts;
                this.credits = parseInt((await ERC20Airdropper.credits(this.account)).toString());
            },
            csvDataToArrays(data) {
                return data
                    .split('\n')
                    .map(v => v.split(','));
            },
        },
        async mounted() {
            if (this.contracts) {
                await this.checkCredits();
                this.getPricePerTx();

                if (this.form.token) {
                    await this.checkAllowance();
                }
            }
        },
        watch: {
            'form.file': function (newVal, oldVal) {
                if (newVal) {
                    const reader = new FileReader();
                    const onloadend = () => {
                        this.form.csvData = reader.result;
                        this.onValidateInputs();
                    };
                    reader.onloadend = onloadend;
                    reader.readAsBinaryString(newVal);
                }
            },
            'contracts': async function (newVal, oldVal) {
                if (newVal && !oldVal) {
                    await this.checkCredits();
                    this.getPricePerTx();

                    if (this.form.token) {
                        await this.checkAllowance();
                    }
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    @import url('https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap');

    $enable-rounded: false;

    $white: #fff !default;
    $gray-100: #FDF6E3 !default;
    $gray-200: #EEE8D5 !default;
    $gray-300: #dee2e6 !default;
    $gray-400: #ced4da !default;
    $gray-500: #adb5bd !default;
    $gray-600: #839496 !default;
    $gray-700: #495057 !default;
    $gray-800: #073642 !default;
    $gray-900: #002B36 !default;
    $black: #000 !default;

    $blue: #B58900 !default;
    $indigo: #6610f2 !default;
    $purple: #6f42c1 !default;
    $pink: #e83e8c !default;
    $red: #D33682 !default;
    $orange: #fd7e14 !default;
    $yellow: #CB4B16 !default;
    $green: #2AA198 !default;
    $teal: #20c997 !default;
    $cyan: #268BD2 !default;

    $primary: $blue !default;
    $secondary: $gray-600 !default;
    $success: $green !default;
    $info: $cyan !default;
    $warning: $yellow !default;
    $danger: $red !default;
    $light: $gray-100 !default;
    $dark: $gray-800 !default;

    /*@import '../node_modules/bootstrap/scss/bootstrap';*/
    @import '~vue-select/src/scss/vue-select.scss';

    body {
        font-family: 'Roboto Mono', monospace;
    }

    .bg-greeny {
        background-color: #C5E3BF;
    }

    .bg-yellowy {
        background-color: #FFF3D8;
    }

    .bg-reddy {
        background-color: #FF6347;
    }

    .badge {
        font-size: 1.25rem;
    }
    .cf {
        clear: both;
    }
</style>

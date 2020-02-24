const {BN, constants, expectEvent, expectRevert, ether, balance} = require('@openzeppelin/test-helpers');

const gasSpent = require('./gas-spent-helper');

const {expect} = require('chai');

const AccessWhitelist = artifacts.require('AccessWhitelist');
const CommissionSplitter = artifacts.require('CommissionSplitter');
const ERC20Airdropper = artifacts.require('ERC20Airdropper');
const ShitCoinToken = artifacts.require('ShitCoinToken');


contract('Rewards Airdropper Tests', function (
    [
        creator,
        ShitCoinTokenOwner,
        account1,
        account2,
        account3,
        platform,
        partner,
        random,
        ...accounts]
) {


    const platformSplit = '50';
    const partnerSplit = '50';

    beforeEach(async function () {
        this.accessWhitelist = await AccessWhitelist.new({from: creator});
        this.splitter = await CommissionSplitter.new(
            this.accessWhitelist.address,
            platform,
            platformSplit,
            partner,
            partnerSplit,
            {from: creator}
        );
        this.ShitCoinToken = await ShitCoinToken.new(ShitCoinTokenOwner, 1000, {from: creator});
        this.airdropper = await ERC20Airdropper.new(this.accessWhitelist.address, this.splitter.address, {from: creator});
    });

    describe('airdropping', async function () {
        it('checks token balance', async function () {
            const tokenBalance = await this.ShitCoinToken.balanceOf(ShitCoinTokenOwner);
            expect(tokenBalance).to.be.bignumber.equal('1000');
        });

        it('reverts if not approved', async function () {
            await expectRevert.unspecified(this.airdropper.transfer(this.ShitCoinToken.address, [account1, account2, account3], [1, 2, 3]));
        });

        it('airdrop to 3 addresses with credits', async function () {

            // esnure ShitCoinTokenOwner can call for free
            await this.airdropper.addCredit(ShitCoinTokenOwner, 99);
            expect(await this.airdropper.creditsOfOwner(ShitCoinTokenOwner)).to.be.bignumber.equal('99');

            expect((await this.ShitCoinToken.balanceOf(account1))).to.be.bignumber.equal('0');
            expect((await this.ShitCoinToken.balanceOf(account2))).to.be.bignumber.equal('0');
            expect((await this.ShitCoinToken.balanceOf(account3))).to.be.bignumber.equal('0');

            // give the airdropper approval access
            await this.ShitCoinToken.approve(this.airdropper.address, 6, {from: ShitCoinTokenOwner});

            // drop them puppies!
            const {logs} = await this.airdropper.transfer(
                this.ShitCoinToken.address,
                [account1, account2, account3],
                [1, 2, 3],
                {from: ShitCoinTokenOwner}
            );

            await expectEvent.inLogs(logs, 'Transfer', {
                _token: this.ShitCoinToken.address,
                _caller: ShitCoinTokenOwner,
                _recipientCount: new BN('3'),
                _totalTokensSent: new BN('6'),
            });

            //ensure that a credit was used
            expect(await this.airdropper.creditsOfOwner(ShitCoinTokenOwner)).to.be.bignumber.equal('98');

            expect((await this.ShitCoinToken.balanceOf(account1))).to.be.bignumber.equal('1');
            expect((await this.ShitCoinToken.balanceOf(account2))).to.be.bignumber.equal('2');
            expect((await this.ShitCoinToken.balanceOf(account3))).to.be.bignumber.equal('3');
        });

        it('airdrop to 3 addresses with payment', async function () {

            const pricePerTx = await this.airdropper.pricePerTx();
            expect((await this.ShitCoinToken.balanceOf(account1))).to.be.bignumber.equal('0');

            // give the airdropper approval access
            await this.ShitCoinToken.approve(this.airdropper.address, 1, {from: ShitCoinTokenOwner});

            // track platform and partner balances
            const platformBalance = await balance.tracker(platform);
            const partnerBalance = await balance.tracker(partner);

            // drop them puppies!
            await this.airdropper.transfer(this.ShitCoinToken.address, [account1], [1], {
                from: ShitCoinTokenOwner,
                value: pricePerTx
            });

            expect((await this.ShitCoinToken.balanceOf(account1))).to.be.bignumber.equal('1');

            // Check that the commission splitting has been successful
            const singleUnitOfValue = pricePerTx.div(new BN('100'));

            const amountPlatformShouldReceive = singleUnitOfValue.mul(new BN(platformSplit));
            expect(await platformBalance.delta()).to.be.bignumber.equal(amountPlatformShouldReceive);

            const amountPartnerShouldReceive = singleUnitOfValue.mul(new BN(partnerSplit));
            expect(await partnerBalance.delta()).to.be.bignumber.equal(amountPartnerShouldReceive);
        });

        it('airdrop where credits are not used if payment sent', async function() {
            // give ShitCoinTokenOwner credits
            await this.airdropper.addCredit(ShitCoinTokenOwner, 99);
            expect(await this.airdropper.creditsOfOwner(ShitCoinTokenOwner)).to.be.bignumber.equal('99');

            expect((await this.ShitCoinToken.balanceOf(account1))).to.be.bignumber.equal('0');
            expect((await this.ShitCoinToken.balanceOf(account2))).to.be.bignumber.equal('0');
            expect((await this.ShitCoinToken.balanceOf(account3))).to.be.bignumber.equal('0');

            // give the airdropper approval access
            await this.ShitCoinToken.approve(this.airdropper.address, 6, {from: ShitCoinTokenOwner});

            const pricePerTx = await this.airdropper.pricePerTx();

            // drop them puppies but pay for the transaction!
            const {logs} = await this.airdropper.transfer(
                this.ShitCoinToken.address,
                [account1, account2, account3],
                [1, 2, 3],
                {from: ShitCoinTokenOwner, value: pricePerTx}
            );

            await expectEvent.inLogs(logs, 'Transfer', {
                _token: this.ShitCoinToken.address,
                _caller: ShitCoinTokenOwner,
                _recipientCount: new BN('3'),
                _totalTokensSent: new BN('6'),
            });

            //ensure that the ShitCoinTokenOwner still has 99 credits
            expect(await this.airdropper.creditsOfOwner(ShitCoinTokenOwner)).to.be.bignumber.equal('99');

            expect((await this.ShitCoinToken.balanceOf(account1))).to.be.bignumber.equal('1');
            expect((await this.ShitCoinToken.balanceOf(account2))).to.be.bignumber.equal('2');
            expect((await this.ShitCoinToken.balanceOf(account3))).to.be.bignumber.equal('3');
        });
    });

    describe('stuck', async function () {
        it('withdraw stuck tokens', async function () {
            expect((await this.ShitCoinToken.balanceOf(this.airdropper.address))).to.be.bignumber.equal('0');

            await this.ShitCoinToken.transfer(this.airdropper.address, 10, {from: ShitCoinTokenOwner});

            expect((await this.ShitCoinToken.balanceOf(this.airdropper.address))).to.be.bignumber.equal('10');

            // send to account 1
            const {logs} = await this.airdropper.moveTokens(this.ShitCoinToken.address, account1, {from: creator});
            await expectEvent.inLogs(logs, 'TokensMoved', {
                _caller: creator,
                _to: account1,
                _amount: new BN('10')
            });

            expect((await this.ShitCoinToken.balanceOf(account1))).to.be.bignumber.equal('10');
            expect((await this.ShitCoinToken.balanceOf(this.airdropper.address))).to.be.bignumber.equal('0');
        });

        it('withdraw stuck ether', async function () {

            const account1Bal = await balance.tracker(account1);

            await web3.eth.sendTransaction({from: creator, to: this.airdropper.address, value: 111});

            // send to account 1
            const {logs} = await this.airdropper.moveEther(account1, {from: creator});
            await expectEvent.inLogs(logs, 'EtherMoved', {
                _caller: creator,
                _to: account1,
                _amount: new BN('111')
            });

            expect(await account1Bal.delta()).to.be.bignumber.equal('111');
        });

        describe('reverts', async function () {
            it('when moving ether if not admin', async function () {
                await web3.eth.sendTransaction({from: creator, to: this.airdropper.address, value: 111});
                await expectRevert(
                    this.airdropper.moveEther(account1, {from: random}),
                    "Caller not whitelist admin"
                );
            });

            it('when moving tokens if not admin', async function () {
                await this.ShitCoinToken.transfer(this.airdropper.address, 10, {from: ShitCoinTokenOwner});

                expect((await this.ShitCoinToken.balanceOf(this.airdropper.address))).to.be.bignumber.equal('10');

                await expectRevert(
                    this.airdropper.moveTokens(this.ShitCoinToken.address, account1, {from: random}),
                    "Caller not whitelist admin"
                );
            });
        });
    });

    describe('credits', async function () {
        it('reverts when transferring if no credit and no value', async function () {
            // give the airdropper approval access
            await this.ShitCoinToken.approve(this.airdropper.address, 6, {from: ShitCoinTokenOwner});

            await expectRevert(this.airdropper.transfer(
                this.ShitCoinToken.address,
                [account1, account2, account3],
                [1, 2, 3],
                {from: ShitCoinTokenOwner}
            ), 'Must have credit or min value');
        });

        it('reverts when trying to add credits when not whitelisted', async function () {
            await expectRevert(
                this.airdropper.addCredit(ShitCoinTokenOwner, 6, {from: random}),
                "Caller not whitelisted"
            );
        });

        it('reverts when trying to reduce credits when not whitelisted', async function () {
            await this.airdropper.addCredit(ShitCoinTokenOwner, 6, {from: creator});
            await expectRevert(
                this.airdropper.reduceCredit(ShitCoinTokenOwner, 6, {from: random}),
                "Caller not whitelisted"
            );
        });

        it('should add credit', async function () {
            expect((await this.airdropper.credits(ShitCoinTokenOwner))).to.be.bignumber.equal('0');

            const {logs} = await this.airdropper.addCredit(ShitCoinTokenOwner, 6, {from: creator});
            await expectEvent.inLogs(logs, 'CreditsAdded', {
                _caller: creator,
                _to: ShitCoinTokenOwner,
                _amount: new BN('6')
            });

            expect((await this.airdropper.credits(ShitCoinTokenOwner))).to.be.bignumber.equal('6');
        });

        it('should reduce credit', async function () {
            expect((await this.airdropper.credits(ShitCoinTokenOwner))).to.be.bignumber.equal('0');
            await this.airdropper.addCredit(ShitCoinTokenOwner, 6, {from: creator});
            expect((await this.airdropper.credits(ShitCoinTokenOwner))).to.be.bignumber.equal('6');

            const {logs} = await this.airdropper.reduceCredit(ShitCoinTokenOwner, 6, {from: creator});
            await expectEvent.inLogs(logs, 'CreditsRemoved', {
                _caller: creator,
                _to: ShitCoinTokenOwner,
                _amount: new BN('6')
            });

            expect((await this.airdropper.credits(ShitCoinTokenOwner))).to.be.bignumber.equal('0');
        });
    });

    describe('updating price per tx', async function () {
        it('is successful when whitelisted', async function () {
            expect(await this.airdropper.pricePerTx()).to.be.bignumber.equal(ether('0.01'));

            const {logs} = await this.airdropper.setPricePerTx(ether('0.5'), {from: creator});
            await expectEvent.inLogs(logs, 'PricePerTxChanged', {
                _caller: creator,
                _oldPrice: ether('0.01'),
                _newPrice: ether('0.5')
            });

            expect(await this.airdropper.pricePerTx()).to.be.bignumber.equal(ether('0.5'));
        });

        it('reverts when not whitelisted', async function () {
            await expectRevert(
                this.airdropper.setPricePerTx(ether('0.5'), {from: random}),
                "Caller not whitelisted"
            );
        });
    });
});

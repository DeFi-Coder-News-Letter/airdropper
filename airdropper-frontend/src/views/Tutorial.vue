<template>
    <div>
        <section class="banner tutorial_page">
            <div class="video_section">
                <img src="../assets/images/video-bg3.jpg" alt="">
                <div class="video_btn" v-b-modal.modal>
                    <i class="fas fa-play-circle"></i>
                    <span class="tm-video-animaiton"><span></span></span>
                </div>
            </div>
        </section>

        <section class="main_wrapp ">
            <div class="container">
                <div class="tutorial">

                    <h2>Instruction</h2>
                    <p>Airdrop of ERC20 token with self-generated key:</p>

                    <div class="process">
                        <div class="process_inner">
                            <img src="../assets/images/process.png" alt="">
                            <div class="process_step one">
                                <p>Make sure your wallet is on Ethereum Mainnet</p>
                            </div>
                            <div class="process_step two">
                                <p>Select the token you wish to send from the drop down menu</p>
                            </div>
                            <div class="process_step three">
                                <p>Click upload CSV and select your airdrop list (format must be address then balance separated by a comma and in the same column</p>
                            </div>
                            <div class="process_step four">
                                <!--                           <p>Click Approve (this prompt a transaction to authorise your wallet to send the allocated amount)</p>-->
                                <p>Click Approve (This will prompt a transactions in your wallet to approve amount you want to send.)</p>
                            </div>
                            <div class="process_step five">
                                <p>Check the airdrop summary</p>
                            </div>
                            <div class="process_step six">
                                <p>Click send</p>
                            </div>
                            <div class="process_step seven">
                                <p>Airdrop sending screen showing txids</p>
                            </div>
                        </div>
                    </div>
                    <h3>Multisend complete</h3>
                    <div class="network_main">
                        <h4>This Dapp supports the following networks:</h4>
                        <ul class="network">
                            <li><img src="../assets/images/mainnet.png" alt="">Ethereum Mainnet</li>
                            <li><img src="../assets/images/algorand.png" alt="">Algorand</li>
                            <li><img src="../assets/images/poa.png" alt="">POA Network</li>
                            <li><i class="fas fa-globe-asia"></i>Ropsten</li>
                            <li><i class="fas fa-globe-asia"></i>Rinkeby</li>
                            <li><i class="fas fa-subway"></i>Kovan</li>
                            <li><img src="../assets/images/gorli.png" alt="">Görli</li>
                            <li><img src="../assets/images/xdai.png" alt="">xDai</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <b-modal id="modal" :hide-footer="true">
            <template v-slot:modal-header="{ close }">
                <button type="button" class="close" @click="close()">
                    <span aria-hidden="true">&times;</span>
                </button>
            </template>

            <template v-slot:default>
                <div class="video">
                    <iframe width="100%" height="350px" src="https://www.youtube.com/embed/yAoLSRbwxL8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            </template>
        </b-modal>

<!--        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">-->
<!--            <div class="modal-dialog" role="document">-->
<!--                <div class="modal-content">-->
<!--                    <div class="modal-header">-->
<!--                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">-->
<!--                            <span aria-hidden="true">&times;</span>-->
<!--                        </button>-->
<!--                    </div>-->
<!--                    <div class="modal-body">-->
<!--                        <div class="video">-->
<!--                            <iframe width="100%" height="350px" src="https://www.youtube.com/embed/yAoLSRbwxL8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>

<script>
export default {
    name: "Tutorial"
}
</script>

<style scoped>

</style>

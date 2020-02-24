<template>
    <section class="faq">
        <div class="container">
            <div class="col-md-12">
                <h3 class="title">{{ 'faqs' | lang }}</h3>
                <div class="accordion" id="accordionExample">
                    <b-card no-body>
                        <b-card-header header-tag="header" role="tab">
                            <h2 class="mb-0">
                                <button class="btn btn-link" type="button" v-b-toggle.collapseOne>
                                    {{ 'what_this_do' | lang }}
                                </button>
                            </h2>
                        </b-card-header>
                        <b-collapse id="collapseOne" visible accordion="my-accordion" role="tabpanel">
                            <b-card-body>
                                <p>{{ 'multisend_allows_send' | lang }} </p>
                            </b-card-body>
                        </b-collapse>
                    </b-card>
                    <b-card no-body>
                        <b-card-header header-tag="header" role="tab">
                            <h2 class="mb-0">
                                <button class="btn btn-link" type="button" v-b-toggle.collapseTwo>
                                    {{ 'how_does_it_work' | lang }}
                                </button>
                            </h2>
                        </b-card-header>
                        <b-collapse id="collapseTwo" visible accordion="my-accordion" role="tabpanel">
                            <b-card-body>
                                <p>{{ 'you_can_send' | lang }} </p>
                            </b-card-body>
                        </b-collapse>
                    </b-card>
                    <b-card no-body>
                        <b-card-header header-tag="header" role="tab">
                            <h2 class="mb-0">
                                <button class="btn btn-link" type="button" v-b-toggle.Three>
                                    {{ 'can_i_send' | lang }}
                                </button>
                            </h2>
                        </b-card-header>
                        <b-collapse id="Three" visible accordion="my-accordion" role="tabpanel">
                            <b-card-body>
                                <p>{{ 'you_can_test' | lang }}</p>
                                <img src="../assets/images/network-img.jpg" alt="">
                            </b-card-body>
                        </b-collapse>
                    </b-card>
                    <b-card no-body>
                        <b-card-header header-tag="header" role="tab">
                            <h2 class="mb-0">
                                <button class="btn btn-link" type="button" v-b-toggle.collapseFour>
                                    {{ 'is_it_safe' | lang }}
                                </button>
                            </h2>
                        </b-card-header>
                        <b-collapse id="collapseFour" visible accordion="my-accordion" role="tabpanel">
                            <b-card-body>
                                <p>{{ 'multisend_uses_smart' | lang }}</p>
                            </b-card-body>
                        </b-collapse>
                    </b-card>
                    <b-card no-body>
                        <b-card-header header-tag="header" role="tab">
                            <h2 class="mb-0">
                                <button class="btn btn-link" type="button" v-b-toggle.collapseFive>
                                    {{ 'how_do_credits_work' | lang }}
                                </button>
                            </h2>
                        </b-card-header>
                        <b-collapse id="collapseFive" visible accordion="my-accordion" role="tabpanel">
                            <b-card-body>
                                <p>{{ 'you_can_save_money' | lang }}</p>

                                <p>{{ 'credits_cover_the_platform' | lang }}<br>{{ 'credits_can_take' | lang }}</p>
                            </b-card-body>
                        </b-collapse>
                    </b-card>
                    <b-card no-body>
                        <b-card-header header-tag="header" role="tab">
                            <h2 class="mb-0">
                                <button class="btn btn-link" type="button" v-b-toggle.collapseSix>
                                    {{ 'how_long_until' | lang }}
                                </button>
                            </h2>
                        </b-card-header>
                        <b-collapse id="collapseSix" visible accordion="my-accordion" role="tabpanel">
                            <b-card-body>
                                <p>{{ 'credits_will_be_added' | lang }}</p>
                            </b-card-body>
                        </b-collapse>
                    </b-card>
                    <b-card no-body>
                        <b-card-header header-tag="header" role="tab">
                            <h2 class="mb-0">
                                <button class="btn btn-link" type="button" v-b-toggle.collapseSeven>
                                    {{ 'can_i_move' | lang }}
                                </button>
                            </h2>
                        </b-card-header>
                        <b-collapse id="collapseSeven" visible accordion="my-accordion" role="tabpanel">
                            <b-card-body>
                                <p>{{ 'you_can_move' | lang }}</p>
                            </b-card-body>
                        </b-collapse>
                    </b-card>
                    <b-card no-body>
                        <b-card-header header-tag="header" role="tab">
                            <h2 class="mb-0">
                                <button class="btn btn-link" type="button" v-b-toggle.collapseEight>
                                    {{ 'what_is_difference' | lang }}
                                </button>
                            </h2>
                        </b-card-header>
                        <b-collapse id="collapseEight" visible accordion="my-accordion" role="tabpanel">
                            <b-card-body>
                                <p>
                                    <strong>{{ 'push' | lang }}</strong> - {{ 'this_is_the_most' | lang }}
                                </p>
                                <p>
                                    <strong>{{ 'pull' | lang }}</strong> - {{ 'airdrop_recipients_2' | lang }}
                                </p>
                            </b-card-body>
                        </b-collapse>
                    </b-card>

                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "Faq"
}
</script>

<style scoped>

</style>

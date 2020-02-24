<template>
    <section class="banner">
        <div class="container">
            <form id="msform">
                <h2 class="fs-title">{{ 'multisend_allows_distribute' | lang }}</h2>
                <h4>{{ 'how_it_works' | lang }}</h4>
                <div class="row">
                    <div class="col-md-4">
                        <div class="progress-inner">
                            <img src="../assets/images/icon1.png" alt="">
                            <h3>{{ 'connect_to_metamask' | lang }}</h3>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="progress-inner">
                            <img src="../assets/images/icon2.png" alt="">
                            <h3>{{ 'add_addresses' | lang }}</h3>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="progress-inner">
                            <img src="../assets/images/icon3.png" alt="">
                            <h3>{{ 'authorize_and_send' | lang }}</h3>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </section>
</template>

<script>
export default {
    name: "Banner"
}
</script>

<style scoped>

</style>

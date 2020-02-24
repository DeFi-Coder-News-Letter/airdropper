<template>
    <footer>
        <div class="footer">
            <div class="container">
                <article class="row">
                    <aside class="col-md-8">
                        <div class="copyright">
                            <ul>
                                <li>{{ 'copyright' | lang }}</li>
                                <li><a href="#">{{ 'privacy_policy' | lang }}</a></li>
                                <li><a href="#">{{ 'terms_and_conditions' | lang }}</a></li>
                            </ul>
                        </div>
                    </aside>
                    <aside class="col-md-4">
                        <ul class="social_icon">
                            <li><a href="https://twitter.com/MultisendO" target="_blank"><i class="fab fa-twitter"></i></a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/company/34931461" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                            </li>
                            <li><a href="#"><i class="fab fa-github"></i></a></li>
                            <li>
                                <a href="https://t.me/multisend" target="_blank"><i class="fab fa-telegram-plane"></i></a>
                            </li>
                        </ul>
                    </aside>
                </article>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: "Footer"
}
</script>

<style scoped>

</style>

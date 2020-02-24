<template>
    <div>
        <section class="banner inner-banner">
            <div class="container text-center">
                <h2 class="fs-title">Contact</h2>
            </div>
        </section>

        <section class="main_wrapp contact_page">
            <div class="container">
                <form class="main_form">
                    <div class="row">
                        <div class="form-group col-md-6">
                            <label for="fname">First Name</label>
                            <input id="fname" type="text" class="form-control" required>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="lname">Last Name</label>
                            <input id="lname" type="text" class="form-control">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="email">Email</label>
                            <input id="email" type="email" class="form-control" required>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="phone">Phone</label>
                            <input id="phone" type="tel" class="form-control" required>
                        </div>
                        <div class="form-group col-md-12">
                            <label for="message">Message</label>
                            <textarea id="message" class="form-control" cols="12" rows="4"></textarea>
                        </div>
                        <div class="form-group col-md-12">
                            <input type="submit" class="btn btn-danger">
                        </div>
                    </div>
                </form>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: "Contact"
}
</script>

<style scoped>

</style>

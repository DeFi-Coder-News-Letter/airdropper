<template>
    <div class="container">
        <AddNewWhitelist />
        <div class="mt-4">
            <WhitelistedAddresses />
        </div>
    </div>
</template>

<script>
    import AddNewWhitelist from "./whitelisting/AddNewWhitelist";
    import WhitelistedAddresses from "./whitelisting/WhitelistedAddresses";

    export default {
        name: "Whitelisting",
        components: {AddNewWhitelist,WhitelistedAddresses}
    }
</script>

<style scoped>

</style>
<template>
    <forgot-pass></forgot-pass>
</template>

<script>

import ForgotPass from "@/components/Accounts/ForgotPassword";

export default {
    auth: false,
    layout: 'AuthLayout',
    components: {
        ForgotPass
    }
}
</script>
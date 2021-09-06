<template>
<reset-password></reset-password>
</template>

<script>
import ResetPassword from "@/components/Accounts/ResetPassword.vue";
export default {
    name: "ResetPasswordPage",
    components: {
        ResetPassword
    },
    layout: "auth",
    auth: false
}
</script>
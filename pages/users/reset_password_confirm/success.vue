<template>
<reset-success></reset-success>
</template>

<script>
import ResetSuccess from "@/components/Accounts/ResetPasswordSuccess.vue";
export default {
    layout: "auth",
    auth: false,
    components: {
        ResetSuccess
    }
}
</script>
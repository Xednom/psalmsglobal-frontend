<template>
  <div>
    <b-alert show variant="danger" v-if="!$auth.user.is_superuser"
      >You're not allowed to access this page.</b-alert
    >
    <admin-interaction-list
      prepaid
      v-if="$auth.user.is_superuser"
    ></admin-interaction-list>
  </div>
</template>

<script>
import AdminInteractionList from "@/components/CustomerInteraction/Components/AdminInteractionList.vue";
export default {
  name: "PrepaidInteractionList",
  components: { AdminInteractionList }
};
</script>

<template>
  <div>
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">Customer Interaction board</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-breadcrumb />
          </nav>
        </div>
        <div class="col-lg-6 col-5 text-right" v-if="$auth.user.designation_category == 'staff'">
          <nuxt-link to="/post-paid/customer-interaction/create" size="md" type="neutral">
            <base-button size="md" type="neutral">Create an interaction</base-button>
          </nuxt-link>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
      <interaction-list></interaction-list>
    </div>
  </div>
</template>

<script>
import InteractionList from "@/components/CustomerInteractionPostPaid/InteractionList.vue";
export default {
  layout: "DashboardLayout",
  components: {
    InteractionList
  }
};
</script>

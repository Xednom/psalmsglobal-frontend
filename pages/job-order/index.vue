<template>
  <div>
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">
            Job order requests
          </h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-breadcrumb />
          </nav>
        </div>
        <div class="col-lg-6 col-5 text-right">
          <nuxt-link to="/form/create" size="md" type="neutral">
            <base-button size="md" type="neutral">Create a Job Order</base-button>
          </nuxt-link>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
      <job-order-list></job-order-list>
    </div>
  </div>
</template>

<script>
import JobOrderList from "@/components/JobOrder/JobOrderInteractionList.vue";
export default {
    layout: "DashboardLayout",
    components: {
        JobOrderList
    }
};
</script>

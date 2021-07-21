<template>
  <div
    v-if="
      $auth.user.designation_category == 'new_client' ||
        $auth.user.designation_category == 'current_client' ||
        $auth.user.designation_category == 'affiliate_partner'
    "
  >
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">Monthly Charge</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-breadcrumb />
          </nav>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
      <monthly-charge-list></monthly-charge-list>
    </div>
  </div>
</template>

<script>
import MonthlyChargeList from "@/components/MonthlyChargePostPaid/MonthlyChargeList.vue";
export default {
  layout: "DashboardLayout",
  components: {
    MonthlyChargeList
  }
};
</script>

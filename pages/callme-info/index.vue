<template>
  <div>
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">CallMe info </h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-breadcrumb />
          </nav>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
      <call-me-info-list></call-me-info-list>
    </div>
  </div>
</template>

<script>
import CallMeInfoList from "../../components/CallMeInfo/CallMeInfoList.vue";
export default {
  layout: "DashboardLayout",
  components: {
    CallMeInfoList
  }
};
</script>

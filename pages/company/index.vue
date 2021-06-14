<template>
  <div>
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">My {{ $route.name }}/s</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-breadcrumb />
          </nav>
        </div>
        <div class="col-lg-6 col-5 text-right">
          <nuxt-link to="/company/create" size="md" type="neutral">
            <base-button size="md" type="neutral">Create a company</base-button>
          </nuxt-link>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
      <company-list></company-list>
    </div>
  </div>
</template>

<script>
import CompanyList from "../../components/Company/CompanyList.vue";
export default {
  layout: "DashboardLayout",
  components: {
    CompanyList
  }
};
</script>

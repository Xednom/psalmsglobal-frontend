<template>
  <div>
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">
            Your {{ $route.name }}
          </h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-breadcrumb />
          </nav>
        </div>
        <div class="col-lg-6 col-5 text-right">
          <nuxt-link to="/form/create" size="md" type="neutral">
            <base-button size="md" type="neutral">Create a Script</base-button>
          </nuxt-link>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
      <form-list></form-list>
    </div>
  </div>
</template>

<script>
import FormList from "@/components/Form/FormList.vue";
export default {
    layout: "DashboardLayout",
    components: {
        FormList
    }
};
</script>

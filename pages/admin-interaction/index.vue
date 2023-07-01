<template>
  <div>
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">
            Admin Customer Interaction lists
          </h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-breadcrumb />
          </nav>
        </div>
      </div>
    </base-header>
    <div>
      <b-card>
        <b-tabs content-class="mt-3">
          <!-- This tabs content will always be mounted -->
          <b-tab title="Post paid"
            ><postpaid-interaction-list></postpaid-interaction-list
          ></b-tab>

          <b-tab title="Prepaid" lazy
            ><prepaid-interaction-list></prepaid-interaction-list
          ></b-tab>
        </b-tabs>
      </b-card>
    </div></div
></template>

<script>
import PostpaidInteractionList from "@/components/CustomerInteraction/Admin/PostPaidInteractionList.vue";
import PrepaidInteractionList from "@/components/CustomerInteraction/Admin/PrepaidInteractionList.vue";

export default {
  layout: "DashboardLayout",
  components: { PostpaidInteractionList, PrepaidInteractionList }
};
</script>

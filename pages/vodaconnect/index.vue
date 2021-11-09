<template>
  <div>
    <base-header class="pb-2">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">
            Vodaconnect
          </h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-breadcrumb />
          </nav>
        </div>
      </div>
    </base-header>
    <div>
      <b-card no-body>
        <b-tabs v-model="tabIndex" card>
          <b-tab title="Plan Details" :title-link-class="linkClass(0)" lazy>
            <active-plan-list></active-plan-list>
          </b-tab>
          <b-tab title="Other Charge" :title-link-class="linkClass(1)" lazy
            ><other-charge></other-charge
          ></b-tab>
          <b-tab
            title="Plan Summary and payment"
            :title-link-class="linkClass(2)"
            lazy
          >
            <plan-summary></plan-summary
          ></b-tab>
          <b-tab
            title="Subscribers Inventory"
            :title-link-class="linkClass(3)"
            lazy
            ><subscribers-list></subscribers-list
          ></b-tab>
          <b-tab
            title="Vodaconnect signup"
            :title-link-class="linkClass(4)"
            lazy
          >
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import ActivePlanList from "@/components/Vodaconnect/ActivePlanDetail/ActivePlanList.vue";
import OtherCharge from "@/components/Vodaconnect/OtherCharge/OtherCharge.vue";
import PlanSummary from "@/components/Vodaconnect/PlanSummaryAndPayment/PaymentList.vue";
import SubscribersList from "@/components/Vodaconnect/SubscribersInventory/SubscribersInventory.vue";

export default {
  layout: "DashboardLayout",
  components: {
    ActivePlanList,
    OtherCharge,
    PlanSummary,
    SubscribersList
  },
  data() {
    return {
      tabIndex: 0
    };
  },
  methods: {
    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ["bg-dark", "text-light"];
      } else {
        return ["bg-light", "text-dark"];
      }
    }
  }
};
</script>

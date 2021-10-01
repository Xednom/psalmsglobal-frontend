<template>
  <div>
    <base-header class="pb-2">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">
            Billing
          </h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-breadcrumb />
          </nav>
        </div>
      </div>
    </base-header>
    <div>
      <b-card no-body v-if="this.$auth.user.account_type == 'postpaid'">
        <b-tabs v-model="tabIndex" card>
          <b-tab title="Plan Details" :title-link-class="linkClass(0)">
            <plan-list></plan-list>
          </b-tab>
          <b-tab title="Account balance" :title-link-class="linkClass(1)"
            ><balance-list></balance-list
          ></b-tab>
          <b-tab
            title="Month to Month Minutes Overview"
            :title-link-class="linkClass(2)"
            ><report-list></report-list
          ></b-tab>
          <b-tab
            title="Plan Summary and Payments"
            :title-link-class="linkClass(3)"
            ><charge-list></charge-list
          ></b-tab>
          <b-tab title="Customer Registration Info"
           :title-link-class="linkClass(4)">
            <subscription-list></subscription-list>
          </b-tab>
        </b-tabs>
      </b-card>
      <b-card v-else-if="this.$auth.user.account_type == 'prepaid'">
        <b-tabs v-model="tabIndex" card>
          <b-tab title="Account balance" :title-link-class="linkClass(0)" lazy
            ><prepaid-balance-list></prepaid-balance-list
          ></b-tab>
          <b-tab title="Plan Details" :title-link-class="linkClass(1)" lazy
            ><prepaid-plan-detail-list></prepaid-plan-detail-list
          ></b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import BalanceList from "@/components/AccountBalance/BalanceList.vue";
import ReportList from "@/components/MinutesReportPostpaid/MinutesReportList.vue";
import ChargeList from "@/components/MonthlyChargePostPaid/MonthlyChargeList.vue";
import PlanList from "@/components/PlanDetails/PlanList.vue";
import SubscriptionList from "@/components/Subscription/SubscriptionList.vue";

import PrepaidBalanceList from "@/components/AccountBalance/Prepaid/BalanceList";
import PrepaidPlanDetailList from "@/components/PlanDetails/Prepaid/PlanList.vue";

export default {
  layout: "DashboardLayout",
  components: {
    BalanceList,
    ReportList,
    ChargeList,
    PlanList,
    SubscriptionList,
    PrepaidBalanceList,
    PrepaidPlanDetailList
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

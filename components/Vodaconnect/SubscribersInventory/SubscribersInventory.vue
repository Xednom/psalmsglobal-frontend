<template>
  <b-card no-body>
    <b-tabs v-model="tabIndex" card>
      <b-tab title="VoIP Information" :title-link-class="linkClass(0)" lazy>
        <information-list></information-list>
      </b-tab>
      <b-tab title="Activation Detail" :title-link-class="linkClass(1)" lazy>
        <activation-detail></activation-detail>
      </b-tab>
      <b-tab title="Plan Detail" :title-link-class="linkClass(2)" lazy>
        <plan-detail></plan-detail>
      </b-tab>
      <b-tab title="Subscriber Status" :title-link-class="linkClass(3)" lazy>
        <subscriber-status></subscriber-status>
      </b-tab>
      <b-tab title="Forwarding Information" :title-link-class="linkClass(4)" lazy>
        <forwarding-list></forwarding-list>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import InformationList from "@/components/Vodaconnect/SubscribersInventory/VoipInformation/InformationList.vue";
import ActivationDetail from "@/components/Vodaconnect/SubscribersInventory/ActivationDetail/ActivationDetail.vue";
import PlanDetail from "@/components/Vodaconnect/SubscribersInventory/PlanDetail/PlanDetail.vue";
import SubscriberStatus from "@/components/Vodaconnect/SubscribersInventory/SubscriberStatus/SubscriberStatus.vue";
import ForwardingList from "@/components/Vodaconnect/SubscribersInventory/ForwardingInformation/ForwardingList.vue";

export default {
  name: "subscribers_inventory",
  components: {
    InformationList,
    ActivationDetail,
    PlanDetail,
    SubscriberStatus,
    ForwardingList
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

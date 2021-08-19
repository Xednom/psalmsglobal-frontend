<template>
  <div class="row">
    <div class="col-xl-12">
      <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
        <form @submit.prevent="handleSubmit(save)">
          <div class="pl-lg-12">
            <div class="row">
              <div class="col-lg-6">
                <base-input
                  type="text"
                  label="Company"
                  placeholder="Company"
                  name="Company"
                  v-model="subscription.company"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-lg-6">
                <base-input
                  type="text"
                  label="Signed up date"
                  placeholder="Signed up date"
                  name="Signed up date"
                  v-model="subscription.signed_up_date"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-lg-6">
                <base-input
                  type="text"
                  label="Signed Out date"
                  placeholder="Signed Out date"
                  name="Signed Out date"
                  v-model="subscription.signed_out_date"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-lg-6">
                <base-input
                  type="text"
                  label="Billing cycle"
                  placeholder="Billing cycle"
                  name="Billing cycle"
                  v-model="subscription.billing_cycle"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-lg-12">
                <base-input
                  type="text"
                  label="Date call started"
                  placeholder="Date call started"
                  name="Date call started"
                  v-model="subscription.date_call_started"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-lg-6 mt-4">
                <base-checkbox v-model="subscription.status" class="mb-3">
                  Status
                </base-checkbox>
              </div>
              <div class="col-lg-6 mt-4">
                <base-checkbox v-model="subscription.script_created" class="mb-3">
                  Script Created
                </base-checkbox>
              </div>
              <div class="col-lg-12">
                <base-input label="Notes">
                  <textarea
                    class="form-control"
                    id="notes"
                    rows="3"
                    v-model="subscription.notes"
                  ></textarea>
                </base-input>
              </div>
            </div>
          </div>
        </form>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";
import { mapGetters, mapActions } from "vuex";

import CreatePlanDetailMixin from "@/mixins/CreatePlanDetailMixin.js";

export default {
  name: "subscription_view",
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  props: {
    subscription: {
      Type: Object,
      description: "Subscription data"
    },
    refresh: {
      Type: Function,
      description: "Refresh the list data"
    }
  },
  data() {
    return {
      query: "",
      companies: [],
      user: {},
      selectedCompany: null,
      isBusy: false,
      saving: false,
      modals: {
        form: false
      }
    };
  },
  methods: {
    ...mapActions("planDetail", ["updatePlanDetail"]),
    async fetchClient(id) {
      let endpoint = `/api/auth/client/${id}/`;
      try {
        await this.$axios.get(endpoint).then(res => {
          this.clientUser = res.data;
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async fetchStaff(id) {
      let endpoint = `/api/auth/staff/${id}/`;
      try {
        await this.$axios.get(endpoint).then(res => {
          this.staffUser = res.data;
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async fetchClient(id) {
      let endpoint = `/api/auth/client/${id}/`;
      try {
        await this.$axios.get(endpoint).then(res => {
          this.clientUser = res.data;
          console.log(this.clientUser);
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully updated your Plan Detail", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.client
          ? "Client: " + error.client
          : error.plan_type
          ? "Plan type: " + error.plan_type
          : error.total_minutes
          ? "Total minutes: " + error.total_minutes
          : error.cost_of_plan
          ? "Cost of Plan: " + error.cost_of_plan
          : error.start_of_plan
          ? "Start of Plan: " + error.start_of_plan
          : error.end_of_plan
          ? "End of Plan: " + error.end_of_plan
          : error.account_status
          ? "Account status: " + error.account_status
          : error.recurring_bill
          ? "Recurring bill: " + error.recurring_bill
          : error.detail
          ? "Detail: " + error.detail
          : error.non_field_errors
          ? error.non_field_errors
          : error,
        {
          title: `Error`,
          variant: variant,
          solid: true
        }
      );
    }
  },
  mounted() {
    if (
      this.$auth.user.designation_category == "new_client" ||
      this.$auth.user.designation_category == "current_client" ||
      this.$auth.user.designation_category == "affiliate_partner"
    ) {
      this.fetchClient(this.$auth.user.id);
    }
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

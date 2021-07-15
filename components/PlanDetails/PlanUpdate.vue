<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <div slot="header" class="row align-items-center mb-3">
        <div class="col-12">
          <h3 class="mb-0">
            Plan details for {{ plan.client_name }} - {{ plan.plan_type }}
          </h3>
        </div>
      </div>
      <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
        <form @submit.prevent="handleSubmit(save)">
          <div class="pl-lg-12">
            <div class="row">
              <div class="col-lg-6">
                <base-input
                  type="text"
                  label="Cost of Plan"
                  placeholder="Cost of Plan"
                  name="Cost of Plan"
                  v-model="plan.cost_of_plan"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-lg-6">
                <base-input
                  type="text"
                  label="Plan type"
                  placeholder="Plan type"
                  name="Plan type"
                  v-model="plan.plan_type"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-lg-6">
                <base-input
                  type="text"
                  label="Start of Plan"
                  placeholder="Start of Plan"
                  name="Start of Plan"
                  v-model="plan.start_of_plan"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-lg-6">
                <base-input
                  type="text"
                  label="End of Plan"
                  placeholder="End of Plan"
                  name="End of Plan"
                  v-model="plan.end_of_plan"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-lg-12">
                <base-input
                  type="text"
                  label="Total minutes"
                  placeholder="Total minutes"
                  name="Total minutes"
                  v-model="plan.total_minutes"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-lg-6 mt-4">
                <base-checkbox v-model="plan.recurring_bill" class="mb-3">
                  Recurring bill
                </base-checkbox>
              </div>
              <div class="col-lg-6 mt-4">
                <base-checkbox v-model="plan.account_status" class="mb-3">
                  Account Status
                </base-checkbox>
              </div>
              <div class="col-lg-12">
                <base-input label="Notes">
                  <textarea
                    class="form-control"
                    id="notes"
                    rows="3"
                    v-model="plan.notes"
                  ></textarea>
                </base-input>
              </div>
            </div>
            <base-button type="info" native-type="submit" loading v-if="saving"
              >Updating</base-button
            >
            <base-button type="info" native-type="submit" v-else
              >Update</base-button
            >
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
  name: "plan_detail_update_view",
  mixins: [CreatePlanDetailMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  props: {
    plan: {
      Type: Object,
      description: "Plan detail data"
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
    async save() {
      this.saving = true;
      const planPayload = {
        id: this.plan.id,
        client: this.clientUser.id,
        plan_type: this.plan.plan_type,
        cost_of_plan: this.plan.cost_of_plan,
        start_of_plan: this.plan.start_of_plan,
        end_of_plan: this.plan.end_of_plan,
        total_minutes: this.plan.total_minutes,
        account_status: this.plan.account_status,
        recurring_bill: this.plan.recurring_bill,
        notes: this.plan.notes
      };
      try {
        this.saving = true;
        await this.updatePlanDetail(planPayload)
          .then(() => {
            this.saving = false;
            this.refresh();
            this.successMessage("success");
          })
          .catch((err) => {
            this.saving = false;
            this.errorMessage("danger", err.response.data);
            console.log(err.response);
          });
      } catch (e) {
        throw e;
      }
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully updated a Job Order", {
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

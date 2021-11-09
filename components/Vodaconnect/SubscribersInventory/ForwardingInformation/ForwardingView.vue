<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
        <form @submit.prevent="handleSubmit(save)">
          <div class="pl-lg-12">
            <div class="row">
              <div class="col-lg-6">
                <base-input
                  type="text"
                  label="Client name"
                  placeholder="Client name"
                  name="Client name"
                  v-model="forwarding.client_name"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-lg-6">
                <base-input
                  type="text"
                  label="Forwarding number"
                  placeholder="Forwarding number"
                  name="Forwarding number"
                  v-model="forwarding.forwarding_number"
                  disabled
                >
                </base-input>
              </div>
            </div>
            <hr class="my-4" />
            <h4 class="mb-5">Total number of extensions</h4>
            <div
              class="col-lg-12 row"
              v-for="(extension,
              index) in forwarding.forwarding_information_total_number_of_extensions"
              :key="index"
            >
              <div class="col-lg-6">
                <base-input
                  type="text"
                  label="Extension number"
                  placeholder="Extension number"
                  name="Extension number"
                  v-model="extension.extension_number"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-lg-6">
                <base-input
                  type="text"
                  label="Extension Logins"
                  placeholder="Extension Logins"
                  name="Extension Logins"
                  v-model="extension.extension_logins"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-lg-12">
                <base-input label="Notes">
                  <textarea
                    class="form-control"
                    id="notes"
                    rows="3"
                    v-model="extension.notes"
                    disabled
                  ></textarea>
                </base-input>
              </div>
            </div>

            <hr class="my-4" />
            <h4 class="mb-5">Zip trunk logins</h4>
            <div
              class="row col-lg-12"
              v-for="(trunk,
              index) in forwarding.forwarding_information_zip_trunk_logins"
              :key="index"
            >
              <div class="col-lg-12">
                <base-input label="Zip trunk details">
                  <textarea
                    class="form-control"
                    id="zip-trunk-details"
                    rows="3"
                    v-model="trunk.zip_trunk_details"
                    disabled
                  ></textarea>
                </base-input>
              </div>
              <div class="col-lg-12">
                <base-input label="Notes">
                  <textarea
                    class="form-control"
                    id="notes"
                    rows="3"
                    v-model="trunk.notes"
                    disabled
                  ></textarea>
                </base-input>
              </div>
            </div>
            <hr class="my-4" />
            <h4 class="mb-5">Other logins</h4>
            <div
              class="row col-lg-12"
              v-for="(other,
              index) in forwarding.forwarding_information_other_logins"
              :key="index"
            >
              <div class="col-lg-12">
                <base-input label="Description">
                  <textarea
                    class="form-control"
                    id="description"
                    rows="3"
                    v-model="other.description"
                    disabled
                  ></textarea>
                </base-input>
              </div>
              <div class="col-lg-12">
                <base-input label="Notes">
                  <textarea
                    class="form-control"
                    id="notes"
                    rows="3"
                    v-model="other.notes"
                    disabled
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
  name: "forwarding_view",
  mixins: [CreatePlanDetailMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  props: {
    forwarding: {
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
        });
      } catch (err) {
        console.error(err.response.data);
      }
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

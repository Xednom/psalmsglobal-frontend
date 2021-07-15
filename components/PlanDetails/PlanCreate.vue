<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <card>
        <div slot="header" class="row align-items-center">
          <div class="col-8">
            <h3 class="mb-0">Choose a plan</h3>
          </div>
          <div class="col-4 text-right">
            <nuxt-link to="/plan-detail/">
              <base-button type="info"
                >Back to Plan Detail list</base-button
              ></nuxt-link
            >
          </div>
        </div>
        <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
          <form @submit.prevent="handleSubmit(save)">
            <h6 class="heading-small text-muted mb-4">
              Plan information
            </h6>

            <div class="pl-lg-4">
              <div class="row">
                <div class="col-lg-6">
                  <base-input
                    label="Plan type"
                    name="Plan type"
                    rules="required"
                  >
                    <el-select
                      v-model="plan_type"
                      filterable
                      placeholder="Choose a Plan"
                    >
                      <el-option
                        v-for="option in planTypes"
                        :key="option.id"
                        :label="option.name"
                        :value="option.name"
                      >
                      </el-option>
                    </el-select>
                  </base-input>
                </div>
                <div class="col-lg-6">
                  <base-input
                    label="Cost of Plan"
                    name="Cost of Plan"
                    rules="required"
                  >
                    <el-select
                      v-model="cost_of_plan"
                      filterable
                      placeholder="Choose a Cost"
                    >
                      <el-option
                        v-for="option in costOfPlans"
                        :key="option.id"
                        :label="option.name"
                        :value="option.name"
                      >
                      </el-option>
                    </el-select>
                  </base-input>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12 mt-4">
                  <base-checkbox v-model="recurring_bill" class="mb-3">
                    Recurring bill?
                  </base-checkbox>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-4">
                  <base-input
                    type="text"
                    label="Total minutes"
                    placeholder="Total minutes"
                    name="Total minutes"
                    rules="required"
                    v-model="total_minutes"
                  >
                  </base-input>
                </div>
                <div class="col-lg-4">
                  <base-input
                    type="text"
                    label="Start of plan"
                    placeholder="Start of plan"
                    name="Start of plan"
                    rules="required"
                    v-model="start_of_plan"
                  >
                  </base-input>
                </div>
                <div class="col-lg-4">
                  <base-input
                    type="text"
                    label="End of plan"
                    placeholder="End of plan"
                    name="End of plan"
                    rules="required"
                    v-model="end_of_plan"
                  >
                  </base-input>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <base-input label="Notes">
                    <textarea
                      class="form-control"
                      id="notes"
                      rows="3"
                      v-model="notes"
                    ></textarea>
                  </base-input>
                </div>
              </div>
            </div>
            <base-button
              type="primary"
              native-type="submit"
              loading
              v-if="saving"
              >Submit</base-button
            >
            <base-button type="primary" native-type="submit" v-else
              >Submit</base-button
            >
          </form>
        </validation-observer>
      </card>
    </div>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";
import { mapGetters, mapActions } from "vuex";

import CreatePlanDetailMixin from "@/mixins/CreatePlanDetailMixin.js";

export default {
  name: "crm_list",
  mixins: [CreatePlanDetailMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  computed: {
    ...mapGetters({
      planTypes: "planDetail/planTypes",
      costOfPlans: "planDetail/costOfPlans",
      user: "user/user",
      client: "user/company"
    }),
    client: {
      get() {
        return this.$store.getters["planDetail/client"];
      },
      set(value) {
        this.setBasicStoreValue("client", value);
      }
    },
    plan_type: {
      get() {
        return this.$store.getters["planDetail/plan_type"];
      },
      set(value) {
        this.setBasicStoreValue("plan_type", value);
      }
    },
    total_minutes: {
      get() {
        return this.$store.getters["planDetail/total_minutes"];
      },
      set(value) {
        this.setBasicStoreValue("total_minutes", value);
      }
    },
    cost_of_plan: {
      get() {
        return this.$store.getters["planDetail/cost_of_plan"];
      },
      set(value) {
        this.setBasicStoreValue("cost_of_plan", value);
      }
    },
    start_of_plan: {
      get() {
        return this.$store.getters["planDetail/start_of_plan"];
      },
      set(value) {
        this.setBasicStoreValue("start_of_plan", value);
      }
    },
    end_of_plan: {
      get() {
        return this.$store.getters["planDetail/end_of_plan"];
      },
      set(value) {
        this.setBasicStoreValue("end_of_plan", value);
      }
    },
    account_status: {
      get() {
        return this.$store.getters["planDetail/account_status"];
      },
      set(value) {
        this.setBasicStoreValue("account_status", value);
      }
    },
    recurring_bill: {
      get() {
        return this.$store.getters["planDetail/recurring_bill"];
      },
      set(value) {
        this.setBasicStoreValue("recurring_bill", value);
      }
    },
    notes: {
      get() {
        return this.$store.getters["planDetail/notes"];
      },
      set(value) {
        this.setBasicStoreValue("notes", value);
      }
    }
  },
  data() {
    return {
      clientUser: {},
      isBusy: false,
      saving: false,
      modals: {
        form: false
      }
    };
  },
  methods: {
    ...mapActions("planDetail", ["reset", "savePlan"]),
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
    async fetchPlanTypes() {
      this.isBusy = true;
      await this.$store.dispatch("planDetail/fetchPlanTypes").then(() => {
        this.isBusy = false;
      });
    },
    async fetchCostOfPlans() {
      this.isBusy = true;
      await this.$store.dispatch("planDetail/fetchCostOfPlans").then(() => {
        this.isBusy = false;
      });
    },
    async save() {
      const planDetailPayload = {
        client: this.clientUser.id,
        plan_type: this.plan_type,
        total_minutes: this.total_minutes,
        cost_of_plan: this.cost_of_plan,
        start_of_plan: this.start_of_plan,
        end_of_plan: this.end_of_plan,
        account_status: (this.account_status = true),
        recurring_bill: this.recurring_bill,
        notes: this.notes
      };

      if (
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        try {
          this.saving = true;
          await this.savePlan(planDetailPayload)
            .then(() => {
              this.saving = false;
              this.reset();
              this.$refs.formValidator.reset();
              this.successMessage("success");
            })
            .catch(e => {
              this.saving = false;
              this.error = e.response.data;
              this.errorMessage("danger", this.error);
            });
        } catch (e) {
          this.saving = false;
          this.error = e.response.data;
          this.errorMessage("danger", this.error);
        }
      }
      this.saving = false;
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully added a new Plan!", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.client
          ? "Company: " + error.client
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
      this.fetchPlanTypes();
      this.fetchCostOfPlans();
    }
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

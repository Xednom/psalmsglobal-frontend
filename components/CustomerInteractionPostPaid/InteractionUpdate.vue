<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <card>
        <div slot="header" class="row align-items-center">
          <div class="col-8">
            <h3 class="mb-0">Add new Interaction</h3>
          </div>
          <div class="col-4 text-right">
            <nuxt-link to="/post-paid/customer-interaction/">
              <base-button type="info"
                >Back to Interaction list</base-button
              ></nuxt-link
            >
          </div>
        </div>
        <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
          <form @submit.prevent="handleSubmit(save)">
            <h6 class="heading-small text-muted mb-4">
              Customer Interaction information
            </h6>

            <div class="pl-lg-4">
              <div class="row">
                <div class="col-lg-3">
                  <base-input label="Company" name="Company" rules="required">
                    <el-select
                      v-model="interaction.company"
                      filterable
                      placeholder="Choose a Company"
                    >
                      <el-option
                        v-for="option in companies"
                        :key="option.id"
                        :label="option.company"
                        :value="option.company_name"
                      >
                      </el-option>
                    </el-select>
                  </base-input>
                </div>
                <div class="col-lg-3">
                  <base-input
                    type="text"
                    label="apn"
                    placeholder="APN"
                    v-model="interaction.apn"
                    name="APN"
                    rules="required"
                  >
                  </base-input>
                </div>
                <div class="col-lg-3">
                  <base-input
                    label="Caller full name"
                    placeholder="Caller full name"
                    v-model="interaction.caller_full_name"
                    name="Caller full name"
                    rules="required"
                  >
                  </base-input>
                </div>
                <div class="col-lg-3">
                  <base-input
                    label="Caller phone"
                    placeholder="Caller phone"
                    v-model="interaction.caller_phone"
                    name="Caller phone"
                    rules="required"
                  >
                  </base-input>
                </div>
                <div class="col-lg-3">
                  <base-input
                    type="text"
                    label="Email"
                    placeholder="Email"
                    name="Email"
                    v-model="interaction.email"
                    :rules="{ required: true, email: true }"
                  >
                  </base-input>
                </div>
                <div class="col-lg-3">
                  <base-input label="CRM" name="CRM" rules="required">
                    <el-select v-model="interaction.crm" filterable placeholder="Choose">
                      <el-option
                        v-for="option in crmOptions"
                        :key="option.label"
                        :label="option.label"
                        :value="option.value"
                      >
                      </el-option>
                    </el-select>
                  </base-input>
                </div>
                <div class="col-lg-3">
                  <base-input label="Leads transferred CRM">
                    <el-select
                      v-model="interaction.leads_transferred_crm"
                      filterable
                      placeholder="Choose"
                    >
                      <el-option
                        v-for="option in leadsCrmOptions"
                        :key="option.label"
                        :label="option.label"
                        :value="option.value"
                      >
                      </el-option>
                    </el-select>
                  </base-input>
                </div>
                <div class="col-lg-3">
                  <base-input label="General Call">
                    <el-select
                      v-model="interaction.general_call"
                      filterable
                      placeholder="Choose"
                      rules="required"
                    >
                      <el-option
                        v-for="option in generalCalls"
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
                <div class="col-lg-4">
                  <base-input label="Interested to Buy">
                    <el-select
                      v-model="interaction.interested_to_buy"
                      filterable
                      placeholder="Choose"
                      rules="required"
                    >
                      <el-option
                        v-for="option in interestedToBuys"
                        :key="option.id"
                        :label="option.name"
                        :value="option.name"
                      >
                      </el-option>
                    </el-select>
                  </base-input>
                </div>
                <div class="col-lg-4">
                  <base-input label="Interested to Sell">
                    <el-select
                      v-model="interaction.interested_to_sell"
                      filterable
                      placeholder="Choose"
                      rules="required"
                    >
                      <el-option
                        v-for="option in interestedToSells"
                        :key="option.id"
                        :label="option.name"
                        :value="option.name"
                      >
                      </el-option>
                    </el-select>
                  </base-input>
                </div>
                <div class="col-lg-4">
                  <base-input
                    type="text"
                    label="Total minutes"
                    placeholder="Total minutes"
                    name="Total minutes"
                    v-model="interaction.total_minutes"
                  >
                  </base-input>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <base-input label="Reason of the call">
                    <textarea
                      class="form-control"
                      id="notes"
                      rows="3"
                      v-model="interaction.reason_of_the_call"
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

import StatsCard from "@/components/argon-core/Cards/StatsCard";
import { mapGetters, mapActions } from "vuex";

import CreateCustomerInteractionMixin from "@/mixins/CreatePostPaidInteractionMixin.js";

export default {
  name: "customer_interaction_create",
  mixins: [CreateCustomerInteractionMixin],
  components: {
    StatsCard,
    [Select.name]: Select,
    [Option.name]: Option
  },
  computed: {
    ...mapGetters({
      companies: "company/companies",
      interestedToBuys: "postPaidCustomerInteraction/interestedToBuys",
      interestedToSells: "postPaidCustomerInteraction/interestedToSells",
      generalCalls: "postPaidCustomerInteraction/generalCalls",
      user: "user/user",
      client: "user/company"
    }),
  },
  data() {
    return {
      error: "",
      interaction: {},
      clientUser: {},
      isBusy: false,
      saving: false,
      modals: {
        form: false
      },
      crmOptions: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "needs_validation", label: "Needs validation" },
        { value: "invalid_data", label: "Invalid data" },
        { value: "needs_follow_up", label: "Needs follow up" }
      ],
      leadsCrmOptions: [
        { value: "needs_transferred", label: "Needs transferred" },
        { value: "transfer_complete", label: "Transfer complete" },
        { value: "na", label: "N/A" }
      ]
    };
  },
  methods: {
    ...mapActions("postPaidCustomerInteraction", ["reset", "updateInteraction"]),
    async fetchInteraction(payload) {
      this.loading = true;
      let endpoint = `/api/v1/post-paid/customer-interaction-post-paid/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.loading = false;
          this.interaction = res.data;
        })
        .catch(e => {
          this.loading = false;
          console.log(e);
          throw e;
        });
    },
    async fetchCompanies() {
      this.isBusy = true;
      await this.$store.dispatch("company/fetchCompanies").then(() => {
        this.isBusy = false;
      });
    },
    async fetchInterestedToSell() {
      this.isBusy = true;
      await this.$store
        .dispatch("postPaidCustomerInteraction/fetchInterestedToSell")
        .then(() => {
          this.isBusy = false;
        });
    },
    async fetchInterestedToBuy() {
      this.isBusy = true;
      await this.$store
        .dispatch("postPaidCustomerInteraction/fetchInterestedToBuy")
        .then(() => {
          this.isBusy = false;
        });
    },
    async fetchGeneralCalls() {
      this.isBusy = true;
      await this.$store
        .dispatch("postPaidCustomerInteraction/fetchGeneralCalls")
        .then(() => {
          this.isBusy = false;
        });
    },
    async save() {
      const interactionPayload = {
          ticket_number: this.interaction.ticket_number,
        company: this.interaction.company,
        apn: this.interaction.apn,
        caller_full_name: this.interaction.caller_full_name,
        caller_phone: this.interaction.caller_phone,
        email: this.interaction.email,
        reason_of_the_call: this.interaction.reason_of_the_call,
        interested_to_sell: this.interaction.interested_to_sell,
        interested_to_buy: this.interaction.interested_to_buy,
        general_call: this.interaction.general_call,
        total_minutes: this.interaction.total_minutes,
        crm: this.interaction.crm,
        leads_transferred_crm: this.interaction.leads_transferred_crm
      };

      if (this.$auth.user.designation_category == "staff") {
        try {
          this.saving = true;
          await this.updateInteraction(interactionPayload)
            .then(() => {
              this.saving = false;
              this.reset();
              this.$refs.formValidator.reset();
              this.successMessage("success");
            })
            .catch(e => {
              this.saving = false;
              this.errorMessage("danger", this.error);
            });
        } catch (e) {
          this.saving = false;
        //   this.error = e.response.data;
          console.log(e);
        //   console.error(e.response.data);
          this.errorMessage("danger", this.error);
        }
        this.saving = false;
      }
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully updated the interaction information!", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.company
          ? "Company: " + error.company
          : error.detail
          ? "Detail: " + error.detail
          : error.total_minutes
          ? "Total minutes: " + error.total_minutes
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
    this.fetchCompanies();
    this.fetchInterestedToSell();
    this.fetchInterestedToBuy();
    this.fetchGeneralCalls();
    this.fetchInteraction(this.$route.params.id)
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

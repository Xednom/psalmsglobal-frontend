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
                      v-model="company"
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
                    v-model="apn"
                    name="APN"
                    rules="required"
                  >
                  </base-input>
                </div>
                <div class="col-lg-3">
                  <base-input
                    label="Caller full name"
                    placeholder="Caller full name"
                    v-model="caller_full_name"
                    name="Caller full name"
                    rules="required"
                  >
                  </base-input>
                </div>
                <div class="col-lg-3">
                  <base-input
                    label="Caller phone"
                    placeholder="Caller phone"
                    v-model="caller_phone"
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
                    v-model="email"
                    :rules="{ required: true, email: true }"
                  >
                  </base-input>
                </div>
                <div class="col-lg-3">
                  <base-input label="CRM" name="CRM" rules="required">
                    <el-select v-model="crm" filterable placeholder="Choose">
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
                  <base-input
                    label="Leads transferred CRM"
                    name="Leads transferred CRM"
                    rules="required"
                  >
                    <el-select
                      v-model="leads_transferred_crm"
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
                  <base-input
                    label="General Call"
                    name="General call"
                    rules="required"
                  >
                    <el-select
                      v-model="general_call"
                      filterable
                      placeholder="Choose"
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
                  <base-input
                    label="Interested to Buy"
                    name="Interested to Buy"
                    rules="required"
                  >
                    <el-select
                      v-model="interested_to_buy"
                      filterable
                      placeholder="Choose"
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
                  <base-input
                    label="Interested to Sell"
                    name="Interested to Sell"
                    rules="required"
                  >
                    <el-select
                      v-model="interested_to_sell"
                      filterable
                      placeholder="Choose"
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
                    label="Total minutes"
                    v-model="total_minutes"
                    placeholder="Total minutes"
                    name="Total minutes"
                    :rules="{ required: true}"
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
                      v-model="reason_of_the_call"
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
    ticket_number: {
      get() {
        return this.$store.getters["postPaidCustomerInteraction/ticket_number"];
      },
      set(value) {
        this.setBasicStoreValue("ticket_number", value);
      }
    },
    company: {
      get() {
        return this.$store.getters["postPaidCustomerInteraction/company"];
      },
      set(value) {
        this.setBasicStoreValue("company", value);
      }
    },
    apn: {
      get() {
        return this.$store.getters["postPaidCustomerInteraction/apn"];
      },
      set(value) {
        this.setBasicStoreValue("apn", value);
      }
    },
    caller_full_name: {
      get() {
        return this.$store.getters[
          "postPaidCustomerInteraction/caller_full_name"
        ];
      },
      set(value) {
        this.setBasicStoreValue("caller_full_name", value);
      }
    },
    caller_phone: {
      get() {
        return this.$store.getters["postPaidCustomerInteraction/caller_phone"];
      },
      set(value) {
        this.setBasicStoreValue("caller_phone", value);
      }
    },
    email: {
      get() {
        return this.$store.getters["postPaidCustomerInteraction/email"];
      },
      set(value) {
        this.setBasicStoreValue("email", value);
      }
    },
    reason_of_the_call: {
      get() {
        return this.$store.getters[
          "postPaidCustomerInteraction/reason_of_the_call"
        ];
      },
      set(value) {
        this.setBasicStoreValue("reason_of_the_call", value);
      }
    },
    interested_to_sell: {
      get() {
        return this.$store.getters[
          "postPaidCustomerInteraction/interested_to_sell"
        ];
      },
      set(value) {
        this.setBasicStoreValue("interested_to_sell", value);
      }
    },
    interested_to_buy: {
      get() {
        return this.$store.getters[
          "postPaidCustomerInteraction/interested_to_buy"
        ];
      },
      set(value) {
        this.setBasicStoreValue("interested_to_buy", value);
      }
    },
    general_call: {
      get() {
        return this.$store.getters["postPaidCustomerInteraction/general_call"];
      },
      set(value) {
        this.setBasicStoreValue("general_call", value);
      }
    },
    total_minutes: {
      get() {
        return this.$store.getters["postPaidCustomerInteraction/total_minutes"];
      },
      set(value) {
        this.setBasicStoreValue("total_minutes", value);
      }
    },
    crm: {
      get() {
        return this.$store.getters["postPaidCustomerInteraction/crm"];
      },
      set(value) {
        this.setBasicStoreValue("crm", value);
      }
    },
    leads_transferred_crm: {
      get() {
        return this.$store.getters[
          "postPaidCustomerInteraction/leads_transferred_crm"
        ];
      },
      set(value) {
        this.setBasicStoreValue("leads_transferred_crm", value);
      }
    }
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
    ...mapActions("postPaidCustomerInteraction", ["reset", "saveInteraction"]),
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
        company: this.company,
        apn: this.apn,
        caller_full_name: this.caller_full_name,
        caller_phone: this.caller_phone,
        email: this.email,
        reason_of_the_call: this.reason_of_the_call,
        interested_to_sell: this.interested_to_sell,
        interested_to_buy: this.interested_to_buy,
        general_call: this.general_call,
        total_minutes: this.total_minutes,
        crm: this.crm,
        leads_transferred_crm: this.leads_transferred_crm
      };

      if (this.$auth.user.designation_category == "staff") {
        try {
          this.saving = true;
          await this.saveInteraction(interactionPayload)
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
      this.$bvToast.toast("Successfully added a new interaction information!", {
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
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

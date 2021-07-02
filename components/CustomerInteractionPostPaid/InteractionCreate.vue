<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <card class="container">
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
          <b-tabs content-class="mt-3">
            <form @submit.prevent="handleSubmit(save)">
              <b-tab title="Customer Interaction information" active>
                <h6 class="heading-small text-muted mb-4">
                  Caller Interaction
                </h6>
                <hr class="my-4" />
                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col-lg-6">
                      <h6 class="heading-small text-muted mb-4">Company</h6>
                      <div class="col-lg-12">
                        <label>Company name</label>
                        <vue-typeahead-bootstrap
                          class="mb-4"
                          v-model="company"
                          :ieCloseFix="false"
                          :data="companies"
                          :serializer="item => item.company_name"
                          :value="keyword"
                          @hit="getCompany"
                          @input="onSearchInput"
                          placeholder="Search a Company"
                        />
                      </div>
                    </div>
                  </div>
                  <hr class="my-4" />
                  <h6 class="heading-small text-muted mb-4">Property Data</h6>
                  <div v-for="(callMe, index) in callMeInfo" :key="index">
                    {{ callMe.reference }}
                  </div>
                  <div class="row">
                    <div class="col-lg-6">
                      <base-input
                        type="text"
                        label="apn"
                        placeholder="APN"
                        v-model="apn"
                        :input="getCallMeInfo"
                        name="APN"
                        rules="required"
                      >
                      </base-input>
                    </div>
                    <div class="col-lg-6">
                      <base-input
                        type="text"
                        label="Reference number"
                        placeholder="Reference number"
                        v-model="reference_number"
                        :input="getCallMeInfo"
                        name="Reference number"
                        rules="required"
                      >
                      </base-input>
                    </div>
                    <div class="col-lg-4">
                      <base-input label="State" name="State" rules="required">
                        <el-select
                          v-model="state"
                          filterable
                          placeholder="Choose"
                          @change="fetchCounties"
                        >
                          <el-option
                            v-for="option in states"
                            :key="option.label"
                            :label="option.label"
                            :value="option.name"
                          >
                          </el-option>
                        </el-select>
                      </base-input>
                    </div>
                    <div class="col-lg-4">
                      <base-input label="County" name="County" rules="required">
                        <el-select
                          v-model="county"
                          filterable
                          placeholder="Choose"
                        >
                          <el-option
                            v-for="option in counties"
                            :key="option.label"
                            :label="option.label"
                            :value="option.name"
                          >
                          </el-option>
                        </el-select>
                      </base-input>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12">
                      <base-input label="Address">
                        <textarea
                          class="form-control"
                          id="address"
                          rows="3"
                          v-model="address"
                        ></textarea>
                      </base-input>
                    </div>
                  </div>
                  <hr class="my-4" />
                  <h6 class="heading-small text-muted mb-4">CRM Data</h6>
                  <div class="row">
                    <div class="col-lg-3">
                      <base-input label="CRM" name="CRM" rules="required">
                        <el-select
                          v-model="crm"
                          filterable
                          placeholder="Choose"
                          disabled
                        >
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
                          disabled
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
                  </div>
                  <hr class="my-4" />
                  <h6 class="heading-small text-muted mb-4">Call memo</h6>
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
              </b-tab>
              <b-tab title="Caller's Data">
                <h6 class="heading-small text-muted mb-4">Caller's Data</h6>
                <div class="row">
                  <div class="col-lg-4">
                    <base-input
                      label="Caller full name"
                      placeholder="Caller full name"
                      v-model="caller_full_name"
                      name="Caller full name"
                      rules="required"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-4">
                    <base-input
                      label="Caller phone"
                      placeholder="Caller phone"
                      v-model="caller_phone"
                      name="Caller phone"
                      rules="required"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-4">
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
                </div>
              </b-tab>
              <b-tab title="Caller's Category">
                <h6 class="heading-small text-muted mb-4">
                  Type of Caller
                </h6>
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
                </div>
                <h6 class="heading-small text-muted mb-4">
                  Caller's Category
                </h6>
                <div class="row">
                  <div class="col-lg-3">
                    <base-input
                      label="Type of caller"
                      name="Type of caller"
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
              </b-tab>
              <b-tab title="Script">
                <div class="row">
                  <div class="col-lg-12">
                    <form-view-list
                      :filter="company"
                      @form-script="eventChild"
                    ></form-view-list>
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
              </b-tab>
            </form>
          </b-tabs>
        </validation-observer>
      </card>
    </div>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";

import StatsCard from "@/components/argon-core/Cards/StatsCard";
import FormViewList from "@/components/Form/FormViewList";
import { mapGetters, mapActions } from "vuex";

import CreateCustomerInteractionMixin from "@/mixins/CreatePostPaidInteractionMixin.js";
import VueTypeaheadBootstrap from "vue-typeahead-bootstrap";
import { debounce } from "lodash";

export default {
  name: "customer_interaction_create",
  mixins: [CreateCustomerInteractionMixin],
  components: {
    StatsCard,
    [Select.name]: Select,
    [Option.name]: Option,
    VueTypeaheadBootstrap,
    FormViewList
  },
  computed: {
    ...mapGetters({
      interestedToBuys: "postPaidCustomerInteraction/interestedToBuys",
      interestedToSells: "postPaidCustomerInteraction/interestedToSells",
      generalCalls: "postPaidCustomerInteraction/generalCalls",
      user: "user/user",
      client: "user/company"
    }),
    async getCallMeInfo() {
      if (this.apn || this.reference) {
        let endpoint = `/api/v1/callme-info/?apn=${this.apn}`;
        return await this.$axios
          .get(endpoint)
          .then(res => {
            this.callMeInfo = res.data.results;
            if (this.callMeInfo.length >= 1) {
              this.callMeInfo.forEach(item => {
                this.callMe = item;
              });
            } else if (this.callMeInfo.length === 0) {
            }
          })
          .catch(e => {
            throw e;
          });
      }
    },
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
        if (this.callMeInfo.length === 0) {
          this.callMeInfo.reference = "";
          return this.$store.getters["postPaidCustomerInteraction/company"];
        } else if (this.callMeInfo.length >= 1) {
          return this.callMe.company_name;
        }
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
    reference_number: {
      get() {
        if (this.callMeInfo.length === 0) {
          this.callMeInfo.reference = "";
          return this.$store.getters[
            "postPaidCustomerInteraction/reference_number"
          ];
        } else if (this.callMeInfo.length >= 1) {
          return this.callMe.reference;
        }
      },
      set(value) {
        this.setBasicStoreValue("reference_number", value);
      }
    },
    county: {
      get() {
        if (this.callMeInfo.length === 0) {
          return this.$store.getters["postPaidCustomerInteraction/county"];
        } else if (this.callMeInfo.length >= 1) {
          return this.callMe.property_county;
        }
      },
      set(value) {
        this.setBasicStoreValue("county", value);
      }
    },
    state: {
      get() {
        if (this.callMeInfo.length === 0) {
          return this.$store.getters["postPaidCustomerInteraction/state"];
        } else if (this.callMeInfo.length >= 1) {
          this.state = "";
          return this.callMe.property_state;
        }
      },
      set(value) {
        this.setBasicStoreValue("state", value);
      }
    },
    address: {
      get() {
        if (this.callMeInfo.length === 0) {
          return this.$store.getters["postPaidCustomerInteraction/address"];
        } else if (this.callMeInfo.length >= 1) {
          this.address = "";
          return this.callMe.property_address;
        }
      },
      set(value) {
        this.setBasicStoreValue("address", value);
      }
    },
    caller_full_name: {
      get() {
        if (this.callMeInfo.length === 0) {
          return this.$store.getters[
            "postPaidCustomerInteraction/caller_full_name"
          ];
        } else if (this.callMeInfo.length >= 1) {
          this.caller_full_name = "";
          return this.callMe.first_name + " " + this.callMe.last_name;
        }
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
      query: "",
      keyword: "",
      companies: [],
      callMeInfo: [],
      callMe: [],
      form: [],
      company_crm: [],
      states: [],
      counties: [],
      selectedCompany: null,
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
      ],
      editorOption: [["bold", "italic", "underline", "strike"]]
    };
  },
  methods: {
    ...mapActions("postPaidCustomerInteraction", ["reset", "saveInteraction"]),
    onEditorBlur(editor) {
      console.log("editor blur!", editor);
    },
    onEditorFocus(editor) {
      console.log("editor focus!", editor);
    },
    onEditorReady(editor) {
      console.log("editor ready!", editor);
    },
    onEditorChange({ editor, html, text }) {
      console.log("editor change!", editor, html, text);
      this.script_answer = html;
    },
    eventChild(form) {
      console.log("Event from child component emitted", (this.form = form));
      console.log(this.form);
    },
    onSearchInput(text) {
      this.keyword = text;
    },
    getCompany: debounce(function() {
      this.$axios
        .get(`/api/v1/company/?search=${this.company}`)
        .then(res => {
          this.companies = res.data.results;
          this.getCompanyCrm();
        })
        .catch(err => {
          console.log(err);
        });
    }, 700),
    getCompanyCrm() {
      this.companies.forEach(item => {
        this.company_crm = item.company_crm;
        this.crmOptions.forEach(item => {
          if (this.company_crm == "true") {
            this.crm = "yes";
            this.leads_transferred_crm = "needs_transferred";
          } else if (this.company_crm == "false") {
            this.crm = "no";
            this.leads_transferred_crm = "na";
          } else if (this.company_crm) {
          } else if (!this.company_crm) {
            this.crmMessage("warning", this.company);
          }
        });
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
        company: this.company,
        apn: this.apn,
        state: this.state,
        county: this.county,
        address: this.adress,
        reference_number: this.reference_number,
        caller_full_name: this.caller_full_name,
        caller_phone: this.caller_phone,
        email: this.email,
        reason_of_the_call: this.reason_of_the_call,
        interested_to_sell: this.interested_to_sell,
        interested_to_buy: this.interested_to_buy,
        general_call: this.general_call,
        crm: this.crm,
        leads_transferred_crm: this.leads_transferred_crm,
        script_answer: this.script_answer,
        customer_interaction_post_paid_forms: Array(this.form)
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
    crmMessage(variant = null, company) {
      this.$bvToast.toast(
        `Your company${company} needs to be registered in the CRM list!`,
        {
          title: `Successful`,
          variant: variant,
          solid: true
        }
      );
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.company
          ? "Company: " + error.company
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
    },
    async fetchCounties() {
      let endpoint = `/api/v1/county/?search=${this.state}`;
      try {
        await this.$axios.get(endpoint).then(res => {
          this.counties = res.data;
        });
      } catch (err) {}
    },
    async fetchStates() {
      let endpoint = `/api/v1/state/`;
      try {
        await this.$axios.get(endpoint).then(res => {
          this.states = res.data;
        });
      } catch (err) {
        console.error(err);
      }
    }
  },
  mounted() {
    this.fetchCompanies();
    this.fetchInterestedToSell();
    this.fetchInterestedToBuy();
    this.fetchGeneralCalls();
    this.fetchStates();
  },
  watch: {
    keyword: debounce(function(oldKeyword, newKeyword) {
      if (newKeyword !== "" && newKeyword !== oldKeyword) {
        this.getCompany();
      } else if (!newKeyword) {
        this.companies = [];
      }
    }, 500)
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

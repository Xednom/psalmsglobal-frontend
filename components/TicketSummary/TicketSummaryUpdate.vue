<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <b-overlay :show="show" rounded="sm">
        <card>
          <div slot="header" class="row align-items-center">
            <div class="col-6">
              <h3 class="mb-6">
                Update Ticket Summaries #ticket number:
                <strong>{{ summary.ticket_number }}</strong>
              </h3>
            </div>
            <div class="col-5 text-right">
              <base-button @click="modals.classic = true" type="primary"
                >Comments</base-button
              >
              <nuxt-link to="/ticket-summary/">
                <base-button type="danger"
                  >Back to Ticket Summary list</base-button
                ></nuxt-link
              >
            </div>
          </div>
          <b-alert
            show
            variant="danger"
            v-if="$auth.user.designation_category == 'staff'"
          >
            <h4 class="alert-heading">Memo!</h4>
            <p>
              1. PLEASE DO NOT FORGET TO PROVIDE THE CALLER OF HIS/HER TICKET #
              ONCE YOU ARE COMPLETE WITH THE CALL.
            </p>
            <p>2. PLEASE DO NOT FORGET TO ADD CALL LOG REPORT IN EVERY CALL.</p>
          </b-alert>
          <b-card no-body>
            <b-tabs card>
              <b-tab title="Ticket Summary info" active>
                <validation-observer
                  v-slot="{ handleSubmit }"
                  ref="formValidator"
                >
                  <form @submit.prevent="handleSubmit(save)">
                    <h6 class="heading-small text-muted mb-4">
                      Ticket Summary information
                    </h6>
                    <div v-if="loading" class="pl-lg-4 text-center">
                      <div>
                        <b-spinner type="grow" label="Loading..."></b-spinner>
                        loading...
                      </div>
                    </div>

                    <div v-else-if="!loading" class="pl-lg-4">
                      <div class="row">
                        <div class="col-lg-3">
                          <label>Company</label>
                          <vue-typeahead-bootstrap
                            class="mb-4"
                            v-model="summary.company"
                            :ieCloseFix="false"
                            :data="companies"
                            :serializer="(item) => item.company_name"
                            @hit="selectedCompany = $event"
                            :disabledValues="
                              selectedCompany
                                ? [selectedCompany.company_name]
                                : []
                            "
                            placeholder="Search a Company"
                            @input="getCompany"
                            disabled
                          />
                        </div>
                      </div>
                      <hr class="my-4" />
                      <h6 class="heading-small text-muted mb-4">
                        Property Data
                      </h6>
                      <div class="row">
                        <div class="col-lg-6">
                          <base-input
                            type="text"
                            label="apn"
                            placeholder="APN"
                            v-model="summary.apn"
                            name="APN"
                            rules="required"
                            disabled
                          >
                          </base-input>
                        </div>
                        <div class="col-lg-6">
                          <base-input
                            type="text"
                            label="Reference number"
                            placeholder="Reference number"
                            v-model="summary.reference_number"
                            name="Reference number"
                            rules="required"
                            disabled
                          >
                          </base-input>
                        </div>
                        <div class="col-lg-4">
                          <base-input
                            label="State"
                            name="State"
                            rules="required"
                          >
                            <el-select
                              v-model="summary.state"
                              filterable
                              placeholder="Choose"
                              @change="fetchCounties"
                              disabled
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
                          <base-input
                            label="County"
                            name="County"
                            rules="required"
                          >
                            <el-select
                              v-model="summary.county"
                              filterable
                              placeholder="Choose"
                              disabled
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
                        <div class="col-lg-12">
                          <base-input label="Address">
                            <textarea
                              class="form-control"
                              id="address"
                              rows="3"
                              v-model="summary.address"
                              disabled
                            ></textarea>
                          </base-input>
                        </div>
                      </div>
                      <hr class="my-4" />
                      <h6 class="heading-small text-muted mb-4">
                        Caller's Data
                      </h6>
                      <div class="row">
                        <div class="col-lg-3">
                          <base-input
                            label="Caller full name"
                            placeholder="Caller full name"
                            v-model="summary.caller_full_name"
                            name="Caller full name"
                            rules="required"
                            disabled
                          >
                          </base-input>
                        </div>
                        <div class="col-lg-3">
                          <base-input
                            label="Caller phone"
                            placeholder="Caller phone"
                            v-model="summary.caller_phone"
                            name="Caller phone"
                            rules="required"
                            disabled
                          >
                          </base-input>
                        </div>
                        <div class="col-lg-3">
                          <base-input
                            type="text"
                            label="Email"
                            placeholder="Email"
                            name="Email"
                            v-model="summary.email"
                            :rules="{ required: true, email: true }"
                            disabled
                          >
                          </base-input>
                        </div>
                      </div>
                      <hr class="my-4" />
                      <h6 class="heading-small text-muted mb-4">CRM Data</h6>
                      <div class="row">
                        <div class="col-lg-3">
                          <base-input label="CRM" name="CRM" rules="required">
                            <el-select
                              v-model="summary.crm"
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
                          <base-input label="Leads transferred CRM">
                            <el-select
                              v-model="summary.leads_transferred_crm"
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
                      <h6 class="heading-small text-muted mb-4">
                        Caller's Category
                      </h6>
                      <div class="row">
                        <div class="col-lg-3">
                          <base-input label="Type of caller">
                            <el-select
                              v-model="summary.general_call"
                              filterable
                              placeholder="Choose"
                              rules="required"
                              disabled
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
                      <hr class="my-4" />
                      <h6 class="heading-small text-muted mb-4">
                        Type of Caller
                      </h6>
                      <div class="row">
                        <div class="col-lg-4">
                          <base-input label="Interested to Buy">
                            <el-select
                              v-model="summary.interested_to_buy"
                              filterable
                              placeholder="Choose"
                              rules="required"
                              disabled
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
                              v-model="summary.interested_to_sell"
                              filterable
                              placeholder="Choose"
                              rules="required"
                              disabled
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
                      <hr class="my-4" />
                      <h6 class="heading-small text-muted mb-4">Call memo</h6>
                      <div class="row">
                        <div class="col-lg-12">
                          <base-input label="Reason of the call">
                            <textarea
                              class="form-control"
                              id="notes"
                              rows="3"
                              v-model="summary.reason_of_the_call"
                              disabled
                            ></textarea>
                          </base-input>
                        </div>
                      </div>
                    </div>
                    <!-- <base-button
                    type="primary"
                    native-type="submit"
                    loading
                    v-if="saving"
                    >Submit</base-button
                  >
                  <base-button
                    type="primary"
                    native-type="submit"
                    v-else-if="
                      !saving && $auth.user.designation_category == 'staff'
                    "
                    >Submit</base-button
                  > -->
                  </form>
                </validation-observer>
              </b-tab>
              <b-tab lazy title="Ticket Summary Overview" :disabled="loading">
                <interaction-record-list
                  :ticket-summary="summary"
                  :user-subcategory="$auth.user.sub_category"
                ></interaction-record-list>
              </b-tab>
              <b-tab title="Script answer" :disabled="loading">
                <div v-if="loading" class="row">
                  <div>
                    <b-spinner type="grow" label="Loading..."></b-spinner>
                    loading...
                  </div>
                </div>
                <div v-else-if="!loading" class="row">
                  <div
                    v-if="
                      summary.ticket_summary_forms &&
                      summary.ticket_summary_forms.length
                    "
                  >
                    <div
                      class="col-lg-12 mb-3"
                      v-for="(
                        interaction_forms, index
                      ) in summary.ticket_summary_forms"
                      :key="index"
                    >
                      <h6
                        class="heading-small text-muted"
                        v-if="interaction_forms.form_title != ''"
                      >
                        {{ interaction_forms.form_title }} of
                        {{ interaction_forms.company }}
                      </h6>
                      <h6 class="heading-small text-muted" v-else>No script</h6>
                      <div
                        v-for="(
                          form, index
                        ) in interaction_forms.attribute_forms"
                        :key="index"
                      >
                        <div v-if="form.data_type == 'question'">
                          <span v-dompurify-html="form.value_question"></span>
                          <textarea
                            class="form-control"
                            name="input-question"
                            v-model="form.input_question"
                            id=""
                            cols="30"
                            disabled
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-else-if="
                      summary.customer_interaction_prepaid_forms &&
                      summary.customer_interaction_prepaid_forms.length
                    "
                  >
                    <div
                      class="col-lg-12 mb-3"
                      v-for="(
                        interaction_forms, index
                      ) in summary.customer_interaction_prepaid_forms"
                      :key="index"
                    >
                      <h6 class="heading-small text-muted">
                        {{ interaction_forms.form_title }} of
                        {{ interaction_forms.company }}
                      </h6>
                      <div
                        v-for="(
                          form, index
                        ) in interaction_forms.attribute_forms"
                        :key="index"
                      >
                        <div v-if="form.data_type == 'question'">
                          <span v-dompurify-html="form.value_question"></span>
                          <textarea
                            class="form-control"
                            name="input-question"
                            v-model="form.input_question"
                            id=""
                            cols="30"
                            disabled
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-else-if="
                      summary.customer_interaction_post_paid_forms &&
                      !summary.customer_interaction_post_paid_forms.length
                    "
                  >
                    <div class="container">
                      <b-alert show variant="warning">
                        <h4 class="alert-heading">
                          No Script was included in this Interaction!
                        </h4>
                      </b-alert>
                    </div>
                  </div>
                </div>
              </b-tab>
              <b-tab lazy title="Job Order" :disabled="loading">
                <job-order-list :summary="summary"></job-order-list>
              </b-tab>
              <b-tab lazy title="Rating" :disabled="loading">
                <interaction-rate
                  :interaction="interaction"
                  :rate="rateCount"
                  :accountType="summary.client_account_type"
                  @refresh="refresh"
                ></interaction-rate>
              </b-tab>
            </b-tabs>
          </b-card>
        </card>
        <template #overlay>
          <div class="text-center">
            <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
            <p id="cancel-label">Please wait...</p>
          </div>
        </template>
      </b-overlay>
    </div>
    <!--Classic modal-->
    <modal size="lg" :show.sync="modals.classic">
      <h6 slot="header" class="modal-title">
        Comment Section for ticket {{ summary.ticket_number }}
      </h6>
      <interaction-comment
        :interaction="summary"
        :user="$auth.user"
        :accountType="summary.client_sub_category"
      ></interaction-comment>
    </modal>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";

import StatsCard from "@/components/argon-core/Cards/StatsCard";
import InteractionComment from "@/components/CustomerInteraction/InteractionCommentSection.vue";
import InteractionRecordList from "@/components/InteractionRecord/Ftm/RecordInteractionList.vue";
import JobOrderList from "@/components/JobOrder/FTM/JobOrderTicketSummaryList.vue";
import InteractionRate from "@/components/Rating/AddRating.vue";

import { mapGetters, mapActions } from "vuex";

import HtmlEditor from "@/components/argon-core/Inputs/HtmlEditor";

import CreateCustomerInteractionMixin from "@/mixins/CreatePostPaidInteractionMixin.js";
import VueTypeaheadBootstrap from "vue-typeahead-bootstrap";
import { debounce } from "lodash";

export default {
  name: "customer_interaction_update",
  mixins: [CreateCustomerInteractionMixin],
  components: {
    StatsCard,
    [Select.name]: Select,
    [Option.name]: Option,
    VueTypeaheadBootstrap,
    InteractionComment,
    InteractionRecordList,
    HtmlEditor,
    JobOrderList,
    InteractionRate,
  },
  computed: {
    ...mapGetters({
      interestedToBuys: "ticketSummary/interestedToBuys",
      interestedToSells: "ticketSummary/interestedToSells",
      summary: "ticketSummary/ticketSummary",
      generalCalls: "ticketSummary/generalCalls",
      user: "user/user",
      client: "user/company",
    }),
    fieldDisable() {
      if (this.interaction) {
        return false;
      } else {
        return true;
      }
    },
  },
  data() {
    return {
      query: "",
      companies: [],
      states: [],
      counties: [],
      selectedCompany: null,
      error: "",
      interaction: {},
      clientUser: {},
      clientAccountType: {},
      rateCount: "",
      show: false,
      isBusy: false,
      saving: false,
      loading: false,
      modals: {
        classic: false,
      },
      crmOptions: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "needs_validation", label: "Needs validation" },
        { value: "invalid_data", label: "Invalid data" },
        { value: "needs_follow_up", label: "Needs follow up" },
      ],
      leadsCrmOptions: [
        { value: "needs_transferred", label: "Needs transferred" },
        { value: "transfer_complete", label: "Transfer complete" },
        { value: "na", label: "N/A" },
      ],
      editorOption: [["bold", "italic", "underline", "strike"]],
    };
  },
  methods: {
    ...mapActions("postPaidCustomerInteraction", [
      "reset",
      "updateInteraction",
    ]),
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
      this.summary.script_answer = html;
    },
    getCompany: debounce(function () {
      this.$axios
        .get(`/api/v1/company/?search=${this.summary.company}`)
        .then((res) => {
          this.companies = res.data.results;
          this.companies.forEach((item) => {
            this.clientAccountType = item.company_client_account_type;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }, 700),

    async fetchTicketSummary(payload) {
      const vm = this;
      this.show = true;

      vm.$store
        .dispatch("ticketSummary/fetchTicketSummary", payload)
        .then(() => {});
    },
    async refreshPostpaidInteraction(payload) {
      let endpoint = `/api/v1/post-paid/customer-interaction-post-paid/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.interaction = res.data;
          this.rateCount = this.summary.post_paid_interaction_rates.length;
          this.summary.customer_interaction_post_paid_forms.forEach((item) => {
            if (item) {
              console.log("yes");
            } else if (!item) {
              console.log("no");
            }
          });
        })
        .catch((e) => {
          console.log(e);
          throw e;
        });
    },
    async refreshPrepaidInteraction(payload) {
      let endpoint = `/api/v1/prepaid/customer-interaction/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.interaction = res.data;
          this.rateCount = this.summary.prepaid_interaction_rates.length;
        })
        .catch((e) => {
          console.log(e);
          throw e;
        });
    },
    refresh() {
      if (this.summary.client_account_type == "postpaid") {
        this.refreshPostpaidInteraction(this.$route.params.id);
      } else if (this.summary.client_account_type == "prepaid") {
        this.refreshPrepaidInteraction(this.$route.params.id);
      }
    },
    async fetchPrepaidInteraction(payload) {
      this.show = true;
      let endpoint = `/api/v1/prepaid/customer-interaction/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.loading = false;
          this.interaction = res.data;
          this.rateCount = this.summary.prepaid_interaction_rates.length;
          this.summary.customer_interaction_prepaid_forms.forEach((item) => {
            if (item) {
              console.log("yes");
            } else if (!item) {
              console.log("no");
            }
          });
        })
        .catch((e) => {
          this.show = false;
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
        ticket_number: this.summary.ticket_number,
        company: this.summary.company,
        apn: this.summary.apn,
        caller_full_name: this.summary.caller_full_name,
        caller_phone: this.summary.caller_phone,
        email: this.summary.email,
        reason_of_the_call: this.summary.reason_of_the_call,
        interested_to_sell: this.summary.interested_to_sell,
        interested_to_buy: this.summary.interested_to_buy,
        general_call: this.summary.general_call,
        total_minutes: this.summary.total_minutes,
        crm: this.summary.crm,
        leads_transferred_crm: this.summary.leads_transferred_crm,
        script_answer: this.summary.script_answer,
        customer_interaction_post_paid_forms:
          this.interaction.customer_interaction_post_paid_forms,
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
            .catch((e) => {
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
    fetchSummary(param) {
      console.log(this.interaction);
      this.fetchTicketSummary(param);
      this.fetchPrepaidInteraction(param);
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully updated the Ticket Summary!", {
        title: `Successful`,
        variant: variant,
        solid: true,
      });
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
          solid: true,
        }
      );
    },
    async fetchCounties() {
      let endpoint = `/api/v1/county/?search=${this.state}`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.counties = res.data;
        });
      } catch (err) {}
    },
    async fetchStates() {
      let endpoint = `/api/v1/state/`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.states = res.data;
        });
      } catch (err) {
        console.error(err);
      }
    },
  },
  mounted() {
    this.fetchCompanies();
    this.fetchInterestedToSell();
    this.fetchInterestedToBuy();
    this.fetchGeneralCalls();
    this.fetchSummary(this.$route.params.id);
    this.fetchStates();
    this.getCompany();
  },
};
</script>

<style lang="scss" scoped>
.company-info {
  float: right;
}
</style>

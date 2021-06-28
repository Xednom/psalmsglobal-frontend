<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <card>
        <div slot="header" class="row align-items-center">
          <div class="col-8">
            <h3 class="mb-0">
              Update Interaction for ticket number:
              <strong>{{ interaction.ticket_number }}</strong>
            </h3>
          </div>
          <div class="col-4 text-right">
            <base-button @click="modals.classic = true" type="primary"
              >Comments</base-button
            >
            <nuxt-link to="/post-paid/customer-interaction/">
              <base-button type="danger"
                >Back to Interaction list</base-button
              ></nuxt-link
            >
          </div>
        </div>
        <b-card no-body>
          <b-tabs card>
            <b-tab title="Customer Interaction info" active>
              <validation-observer
                v-slot="{ handleSubmit }"
                ref="formValidator"
              >
                <form @submit.prevent="handleSubmit(save)">
                  <h6 class="heading-small text-muted mb-4">
                    Customer Interaction information
                  </h6>
                  <div v-if="interaction.company_crm == 'true'">
                    {{ interaction.company_crm }}
                  </div>
                  <div class="pl-lg-4">
                    <div class="row">
                      <div class="col-lg-3">
                        <label>Company</label>
                        <vue-typeahead-bootstrap
                          class="mb-4"
                          v-model="interaction.company"
                          :ieCloseFix="false"
                          :data="companies"
                          :serializer="item => item.company_name"
                          @hit="selectedCompany = $event"
                          :disabledValues="
                            selectedCompany
                              ? [selectedCompany.company_name]
                              : []
                          "
                          placeholder="Search a Company"
                          @input="getCompany"
                          :disabled="clientDisable"
                        />
                      </div>
                    </div>
                    <hr class="my-4" />
                    <h6 class="heading-small text-muted mb-4">Property Data</h6>
                    <div class="row">
                      <div class="col-lg-6">
                        <base-input
                          type="text"
                          label="apn"
                          placeholder="APN"
                          v-model="interaction.apn"
                          name="APN"
                          rules="required"
                          :disabled="clientDisable"
                        >
                        </base-input>
                      </div>
                      <div class="col-lg-6">
                        <base-input
                          type="text"
                          label="Reference number"
                          placeholder="Reference number"
                          v-model="interaction.reference_number"
                          name="Reference number"
                          rules="required"
                        >
                        </base-input>
                      </div>
                      <div class="col-lg-4">
                        <base-input label="State" name="State" rules="required">
                          <el-select
                            v-model="interaction.state"
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
                            v-model="interaction.county"
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
                    </div>
                    <hr class="my-4" />
                    <h6 class="heading-small text-muted mb-4">
                      Customer's Data
                    </h6>
                    <div class="row">
                      <div class="col-lg-3">
                        <base-input
                          label="Caller full name"
                          placeholder="Caller full name"
                          v-model="interaction.caller_full_name"
                          name="Caller full name"
                          rules="required"
                          :disabled="clientDisable"
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
                          :disabled="clientDisable"
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
                          :disabled="clientDisable"
                        >
                        </base-input>
                      </div>
                    </div>
                    <hr class="my-4" />
                    <h6 class="heading-small text-muted mb-4">
                      CRM Data
                    </h6>
                    <div class="row">
                      <div class="col-lg-3">
                        <base-input label="CRM" name="CRM" rules="required">
                          <el-select
                            v-model="interaction.crm"
                            filterable
                            placeholder="Choose"
                            :disabled="clientDisable"
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
                            v-model="interaction.leads_transferred_crm"
                            filterable
                            placeholder="Choose"
                            :disabled="clientDisable"
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
                      Call type
                    </h6>
                    <div class="row">
                      <div class="col-lg-3">
                        <base-input label="General Call">
                          <el-select
                            v-model="interaction.general_call"
                            filterable
                            placeholder="Choose"
                            rules="required"
                            :disabled="clientDisable"
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
                      Callers category
                    </h6>
                    <div class="row">
                      <div class="col-lg-4">
                        <base-input label="Interested to Buy">
                          <el-select
                            v-model="interaction.interested_to_buy"
                            filterable
                            placeholder="Choose"
                            rules="required"
                            :disabled="clientDisable"
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
                            :disabled="clientDisable"
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
                            v-model="interaction.reason_of_the_call"
                            :disabled="clientDisable"
                          ></textarea>
                        </base-input>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-12 mb-3">
                        <label>Script answer</label>
                        <section class="container">
                          <div
                            class="quill-editor"
                            :content="interaction.script_answer"
                            @change="onEditorChange($event)"
                            @blur="onEditorBlur($event)"
                            @focus="onEditorFocus($event)"
                            @ready="onEditorReady($event)"
                            v-quill:myQuillEditor="editorOption"
                          ></div>
                        </section>
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
                  <base-button
                    type="primary"
                    native-type="submit"
                    v-else-if="
                      !saving && $auth.user.designation_category == 'staff'
                    "
                    >Submit</base-button
                  >
                </form>
              </validation-observer>
            </b-tab>
            <b-tab lazy title="Interaction Record">
              <interaction-record-list
                :interactionRecord="interaction"
              ></interaction-record-list>
            </b-tab>
          </b-tabs>
        </b-card>
      </card>
    </div>
    <!--Classic modal-->
    <modal size="lg" :show.sync="modals.classic">
      <h6 slot="header" class="modal-title">
        Comment Section for ticket {{ interaction.ticket_number }}
      </h6>
      <interaction-comment :interaction="interaction"></interaction-comment>
    </modal>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";

import StatsCard from "@/components/argon-core/Cards/StatsCard";
import InteractionComment from "@/components/CustomerInteractionPostPaid/InteractionCommentSection";
import InteractionRecordList from "@/components/InteractionRecord/RecordList";

import { mapGetters, mapActions } from "vuex";

import HtmlEditor from "@/components/argon-core/Inputs/HtmlEditor";

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
    InteractionComment,
    InteractionRecordList,
    HtmlEditor
  },
  computed: {
    ...mapGetters({
      interestedToBuys: "postPaidCustomerInteraction/interestedToBuys",
      interestedToSells: "postPaidCustomerInteraction/interestedToSells",
      generalCalls: "postPaidCustomerInteraction/generalCalls",
      user: "user/user",
      client: "user/company"
    }),
    clientDisable() {
      if (this.$auth.user.designation_category == "staff") {
        return false;
      } else {
        return true;
      }
    }
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
      isBusy: false,
      saving: false,
      modals: {
        classic: false
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
    ...mapActions("postPaidCustomerInteraction", [
      "reset",
      "updateInteraction"
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
      this.interaction.script_answer = html;
    },
    getCompany: debounce(function() {
      this.$axios
        .get(`/api/v1/company/?search=${this.interaction.company}`)
        .then(res => {
          this.companies = res.data.results;
        })
        .catch(err => {
          console.log(err);
        });
    }, 700),
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
        leads_transferred_crm: this.interaction.leads_transferred_crm,
        script_answer: this.interaction.script_answer
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
    this.fetchInteraction(this.$route.params.id);
    this.fetchStates();
  }
};
</script>

<style lang="scss" scoped>
.company-info {
  float: right;
}
</style>

<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
        <form @submit.prevent="handleSubmit(save)">
          <div class="pl-lg-12">
            <div class="row">
              <div class="col-lg-12">
                <base-input label="Your Feed back?">
                  <el-select
                    v-model="interaction.client_feedback_status"
                    placeholder="Choose a Feed back status"
                    rules="required"
                    :disabled="
                      ($auth.user.designation_category == 'staff' &&
                        interaction.internal_management_ticket_status ==
                          'case_closed') ||
                        interaction.internal_management_ticket_status ==
                          'dispute_on_progress' ||
                        interaction.internal_management_ticket_status ==
                          'resolution_given' ||
                        interaction.internal_management_ticket_status ==
                          'others'
                    "
                    @change="clearDetails"
                  >
                    <el-option
                      v-for="option in feedBackStatus"
                      :key="option.id"
                      :label="option.label"
                      :value="option.value"
                    >
                    </el-option>
                  </el-select>
                </base-input>
              </div>
              <div class="col-lg-12">
                <base-input
                  label="Other feed back"
                  v-if="interaction.client_feedback_status == 'other'"
                >
                  <textarea
                    class="form-control"
                    id="notes"
                    rows="3"
                    v-model="interaction.other_feedback"
                    name="Other feedback"
                  ></textarea>
                </base-input>
                <base-input
                  label="Dispute details"
                  v-if="
                    interaction.client_feedback_status == 'dispute' ||
                      interaction.client_feedback_status == 'clarification'
                  "
                >
                  <textarea
                    class="form-control"
                    id="notes"
                    rows="3"
                    v-model="interaction.dispute_details"
                    name="Dispute details"
                    :disabled="
                      ($auth.user.designation_category == 'staff' &&
                        interaction.internal_management_ticket_status ==
                          'case_closed') ||
                        interaction.internal_management_ticket_status ==
                          'dispute_on_progress' ||
                        interaction.internal_management_ticket_status ==
                          'resolution_given' ||
                        interaction.internal_management_ticket_status ==
                          'others'
                    "
                  ></textarea>
                </base-input>
              </div>
            </div>
          </div>
          <hr
            class="my-4"
            v-if="interaction.internal_management_ticket_status != 'na'"
          />
          <div
            class="row"
            v-if="interaction.internal_management_ticket_status != 'na'"
          >
            <div class="col-lg-12">
              <base-input label="Internal management ticket status">
                <el-select
                  v-model="interaction.internal_management_ticket_status"
                  placeholder="Internal management ticket status"
                  disabled
                >
                </el-select>
              </base-input>
            </div>
            <div class="col-lg-12">
              <base-input
                label="Other"
                v-if="interaction.client_feedback_status == 'other'"
              >
                <textarea
                  class="form-control"
                  id="notes"
                  rows="3"
                  v-model="interaction.other_ticket_status"
                  name="Other feed back ticket status"
                  disabled
                ></textarea>
              </base-input>
              <base-input
                label="Solution from the Management"
                v-if="interaction.client_feedback_status != 'other'"
              >
                <textarea
                  class="form-control"
                  id="notes"
                  rows="3"
                  v-model="interaction.memo_solution_from_the_mgmt"
                  name="Solution from the Management"
                  disabled
                ></textarea>
              </base-input>
            </div>
          </div>
          <hr class="my-4" />
          <base-button type="primary" native-type="submit" loading v-if="saving"
            >Submit</base-button
          >
          <base-button
            type="primary"
            native-type="submit"
            v-else-if="!saving && $auth.user.designation_category != 'staff'"
            >Submit</base-button
          >
        </form>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";
import { mapGetters, mapActions } from "vuex";

import CreateInteractionRecordMixin from "@/mixins/CreateInteractionRecordMixin.js";

export default {
  name: "interaction_record_create",
  mixins: [CreateInteractionRecordMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  props: {
    interaction: {
      Type: Object,
      description: "Customer interaction data"
    },
    refresh: {
      Type: Function
    }
  },
  computed: {
    ...mapGetters({
      client: "user/company"
    }),
    client_feedback_status: {
      get() {
        return this.$store.getters["interactionRecord/client_feedback_status"];
      },
      set(value) {
        this.setBasicStoreValue("client_feedback_status", value);
      }
    },
    client_feedback_status: {
      get() {
        return this.$store.getters["interactionRecord/client_feedback_status"];
      },
      set(value) {
        this.setBasicStoreValue("client_feedback_status", value);
      }
    }
  },
  data() {
    return {
      query: "",
      error: "",
      companies: [],
      user: {},
      selectedCompany: null,
      isBusy: false,
      saving: false,
      modals: {
        form: false
      },
      attribute_forms: [],
      dataTypeOptions: [
        { value: "text", label: "Text" },
        { value: "question", label: "Question" }
      ],
      feedBackStatus: [
        { value: "na", label: "N/A" },
        { value: "dispute", label: "Dispute" },
        { value: "clarification", label: "Clarification" },
        { value: "other", label: "Other" }
      ]
    };
  },
  methods: {
    ...mapActions("interactionRecord", ["reset", "updateRecord"]),
    clearDetails() {
      return (this.interaction.dispute_details = "");
    },
    async fetchMe() {
      this.loading = true;
      try {
        let endpoint = `api/auth/users/me/`;
        await this.$axios.get(endpoint).then(res => {
          this.user = res.data;
          this.loading = false;
          if (
            this.user.designation_category == "new_client" ||
            this.user.designation_category == "current_client" ||
            this.user.designation_category == "affiliate_partner"
          ) {
            this.fetchClient(this.user.id);
          } else {
            this.fetchStaff(this.user.id);
          }
        });
      } catch (err) {
        console.log(err.response.data);
        this.loading = false;
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
    async save() {
      const recordPayload = {
        id: this.interaction.id,
        ticket_number: this.interaction.ticket_number,
        client_feedback_status: this.interaction.client_feedback_status,
        other_feedback: this.interaction.other_feedback,
        dispute_details: this.interaction.dispute_details,
        total_minutes: this.interaction.total_minutes,
        summary: this.interaction.summary
      };

      if (this.$auth.user.designation_category != "staff") {
        try {
          this.saving = true;
          await this.updateRecord(recordPayload)
            .then(() => {
              this.saving = false;
              this.reset();
              this.refresh();
              this.$refs.formValidator.reset();
              this.successMessage("success");
            })
            .catch(err => {
              this.saving = false;
              this.error = err.response.data;
              this.errorMessage("danger", this.error);
            });
        } catch (e) {
          throw e;
        }
      }
      this.saving = false;
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully submitted your dispute, thank you!", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.client
          ? "Client: " + error.client
          : error.total_minutes
          ? "Total minutes: " + error.total_minutes
          : error.agent
          ? "Agent: " + error.agent
          : error.customer_interaction_post_paid
          ? "Customer interaction: " + error.customer_interaction_post_paid
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
    this.fetchMe();
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

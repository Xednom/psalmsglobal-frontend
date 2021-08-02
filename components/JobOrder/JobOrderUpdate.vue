<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <div slot="header" class="row align-items-center mb-3">
        <div class="col-8">
          <h3 class="mb-0">
            Job order request for Caller interaction -
            {{
              jobOrder.caller_interaction_record
                ? jobOrder.caller_interaction_record
                : jobOrder.ticket_number
            }}
          </h3>
        </div>
      </div>
      <b-tabs content-class="mt-3">
        <!-- This tabs content will always be mounted -->
        <b-tab title="Job order">
          <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
            <form @submit.prevent="handleSubmit(save)">
              <div class="pl-lg-12">
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      v-if="jobOrder.caller_interaction_record"
                      type="text"
                      label="Caller interaction Ticket number"
                      placeholder="Caller interaction Ticket number"
                      name="Caller interaction Ticket number"
                      v-model="jobOrder.caller_interaction_record"
                      rules="required"
                      disabled
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <base-input
                      v-if="jobOrder.client"
                      type="text"
                      label="Client code"
                      placeholder="Client code"
                      name="Client code"
                      v-model="jobOrder.client"
                      rules="required"
                      disabled
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-4">
                    <base-input
                      type="text"
                      label="Request date"
                      placeholder="Request date"
                      name="Request date"
                      v-model="jobOrder.request_date"
                      :rules="{ required: true }"
                      disabled
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-4">
                    <base-input
                      type="text"
                      label="Due date"
                      placeholder="Due date"
                      name="Due date"
                      v-model="jobOrder.due_date"
                      :rules="{ required: true }"
                      disabled
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-4">
                    <base-input
                      type="text"
                      label="Total time consumed"
                      placeholder="Total time consumed"
                      name="Total time consumed"
                      v-model="jobOrder.total_time_consumed"
                      :rules="{ required: true }"
                      disabled
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <base-input label="Status">
                      <el-select
                        v-model="jobOrder.status"
                        filterable
                        placeholder="Choose a Ticket"
                        rules="required"
                        :disabled="$auth.user.designation_category != 'staff'"
                      >
                        <el-option
                          v-for="option in StatusChoices.status"
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
                      type="text"
                      label="Job title"
                      placeholder="Job title"
                      name="Job title"
                      v-model="jobOrder.job_title"
                      :rules="{ required: true }"
                      disabled
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <base-input label="Job description">
                      <textarea
                        class="form-control"
                        id="job-description"
                        rows="3"
                        v-model="jobOrder.job_description"
                        :rules="{ required: true }"
                        disabled
                      ></textarea>
                    </base-input>
                  </div>
                </div>
                <base-button
                  type="info"
                  native-type="submit"
                  loading
                  v-if="saving"
                  >Updating</base-button
                >
                <base-button type="info" native-type="submit" v-else
                  >Update</base-button
                >
              </div>
            </form>
          </validation-observer>
        </b-tab>

        <b-tab title="Comment section" lazy>
          <job-order-comment
            :job="jobOrder"
            :fetch="refresh"
          ></job-order-comment>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";
import { mapGetters, mapActions } from "vuex";

import CreateInteractionRecordMixin from "@/mixins/CreateInteractionRecordMixin.js";

import JobOrderComment from "@/components/JobOrder/JobOrderComment";

export default {
  name: "jobOrder_record_view",
  mixins: [CreateInteractionRecordMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    JobOrderComment
  },
  props: {
    jobOrder: {
      Type: Object,
      description: "Customer Job Order data"
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
      },
      attribute_forms: [],
      dataTypeOptions: [
        { value: "text", label: "Text" },
        { value: "question", label: "Question" }
      ],
      StatusChoices: {
        placeholder: "",
        status: [
          { value: "na", label: "N/A" },
          { value: "job_order_request", label: "Job order request" },
          { value: "va_processing", label: "VA Processing" },
          { value: "management_processing", label: "Management Processing" },
          { value: "verified_job_order", label: "Verified Job Order" },
          { value: "on_hold", label: "On Hold" },
          { value: "canceled", label: "Canceled" },
          { value: "follow_up", label: "Follow up" },
          { value: "dispute", label: "Dispute" },
          { value: "complete", label: "Complete" },
          { value: "under_quality_review", label: "Under Quality Review" },
          { value: "daily_tasks", label: "Daily Tasks" },
          { value: "weekly_tasks", label: "Weekly Tasks" },
          { value: "monthly_tasks", label: "Monthly Tasks" },
          { value: "redo", label: "Redo" },
          { value: "pending", label: "Pending" },
          { value: "request_for_posting", label: "Request for Posting" },
          { value: "mark_as_sold_request", label: "Mark as Sold Request" },
          { value: "initial_dd_processing", label: "Initial DD Processing" },
          { value: "initial_dd_complete", label: "Initial DD Complete" },
          { value: "dd_call_out_processing", label: "DD Call Out Processing" },
          { value: "dd_call_out_complete", label: "DD Call Out Complete" },
          { value: "duplicate_request", label: "Duplicate Request" }
        ]
      }
    };
  },
  methods: {
    ...mapActions("jobOrder", ["updateJobOrder"]),
    onlyNumbers: function() {
      this.jobOrder.total_time_consumed = this.job.total_time_consumed.replace(
        /[^0-9.]/g,
        ""
      );
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
      this.saving = true;
      const jobOrderPayload = {
        ticket_number: this.jobOrder.ticket_number,
        request_date: this.jobOrder.request_date,
        due_date: this.jobOrder.due_date,
        status: this.jobOrder.status,
        job_title: this.jobOrder.job_title,
        total_time_consumed: this.jobOrder.total_time_consumed,
        job_description: this.jobOrder.job_description
      };
      try {
        this.saving = true;
        await this.updateJobOrder(jobOrderPayload)
          .then(() => {
            this.saving = false;
            this.successMessage("success");
            this.refresh();
          })
          .catch(e => {
            this.saving = false;
            this.errorMessage("danger", e.response.data);
            console.log(e);
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
        error.caller_interaction_record
          ? "Caller interaction record: " + error.caller_interaction_record
          : error.client
          ? "Client: " + error.client
          : error.agent
          ? "Agent: " + error.agent
          : error.customer_jobOrder_post_paid
          ? "Customer jobOrder: " + error.customer_jobOrder_post_paid
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
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

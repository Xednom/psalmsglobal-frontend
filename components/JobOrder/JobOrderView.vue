<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <div slot="header" class="row align-items-center mb-3">
        <div class="col-8">
          <h3 class="mb-0">
            Job order request for {{ jobOrder.caller_interaction_record }}
          </h3>
        </div>
      </div>
      <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
        <form @submit.prevent="handleSubmit(save)">
          <div class="pl-lg-12">
            <div class="row">
              <div class="col-lg-12">
                <base-input
                  type="text"
                  label="Ticket number"
                  placeholder="Ticket number"
                  name="Ticket number"
                  v-model="jobOrder.caller_interaction_record"
                  rules="required"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-lg-12">
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
              <div class="col-lg-12">
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
              <div class="col-lg-12">
                <base-input
                  type="text"
                  label="Total minutes"
                  placeholder="Total minutes"
                  name="Total minutes"
                  v-model="jobOrder.job_title"
                  :rules="{ required: true }"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-lg-12">
                <base-input label="Summary">
                  <textarea
                    class="form-control"
                    id="summary"
                    rows="3"
                    v-model="jobOrder.job_description"
                    :rules="{ required: true }"
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

import CreateInteractionRecordMixin from "@/mixins/CreateInteractionRecordMixin.js";

export default {
  name: "jobOrder_record_view",
  mixins: [CreateInteractionRecordMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  props: {
    jobOrder: {
      Type: Object,
      description: "Customer Job Order data"
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
      ]
    };
  },
  methods: {
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
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully added a new Job Order", {
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

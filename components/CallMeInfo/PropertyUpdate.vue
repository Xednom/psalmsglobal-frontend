<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <div slot="header" class="row align-items-center mb-3">
        <div class="col-8">
          <h3 class="mb-0">
            Property Info - {{ property.apn }} with Reference #{{
              property.reference_number
            }}
          </h3>
        </div>
      </div>
      <b-tabs content-class="mt-3">
        <!-- This tabs content will always be mounted -->
        <b-tab title="Disposition Property Info">
          <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
            <form @submit.prevent="handleSubmit(save)">
              <div class="pl-lg-12">
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      type="text"
                      label="Apn"
                      placeholder="Apn"
                      name="Apn"
                      v-model="apn"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <base-input
                      type="text"
                      label="Full name"
                      placeholder="Full name"
                      name="Full name"
                      v-model="full_name"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                </div>
                <!-- <base-button
                  type="info"
                  native-type="submit"
                  loading
                  v-if="saving"
                  >Updating</base-button
                >
                <base-button type="info" native-type="submit" v-else
                  >Update</base-button
                > -->
                <base-button type="info" native-type="submit"
                  >Update</base-button
                >
              </div>
            </form>
          </validation-observer>
        </b-tab>

        <b-tab title="Comment section" lazy>
          <!-- <job-order-comment
            :job="jobOrder"
            :fetch="refresh"
            :accountType="accountType"
          ></job-order-comment> -->
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>
  
  <script>
import { Select, Option } from "element-ui";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

import PropertyInfoMixin from "@/mixins/PropertyInfoMixin.js";

import JobOrderComment from "@/components/JobOrder/JobOrderComment";

export default {
  name: "PropertyInfoUpdate",
  mixins: [PropertyInfoMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    JobOrderComment,
  },
  props: {
    refresh: {
      Type: Function,
      description: "Refresh the list data",
    },
    accountType: {
      Type: String,
      description: "Account type",
    },
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
        form: false,
      },
      attribute_forms: [],
      dataTypeOptions: [
        { value: "text", label: "Text" },
        { value: "question", label: "Question" },
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
          { value: "job_closed", label: "Job closed" },
          { value: "under_quality_review", label: "Under Quality Review" },
          { value: "daily_tasks", label: "Daily Tasks" },
          { value: "weekly_tasks", label: "Weekly Tasks" },
          { value: "monthly_tasks", label: "Monthly Tasks" },
          { value: "redo", label: "Redo" },
          { value: "pending", label: "Pending" },
          { value: "duplicate_request", label: "Duplicate Request" },
        ],
      },
    };
  },
  methods: {
    ...mapMutations("callMeInfo", ["updateObject", "setBasicField", "setApn"]),
    ...mapActions("callMeInfo", ["saveCallMeInfo", "fetchCallMeInfo"]),
    onlyNumbers: function () {
      this.property.total_time_consumed = this.job.total_time_consumed.replace(
        /[^0-9.]/g,
        ""
      );
    },
    async fetchClient(id) {
      let endpoint = `/api/auth/client/${id}/`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.clientUser = res.data;
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async fetchStaff(id) {
      let endpoint = `/api/auth/staff/${id}/`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.staffUser = res.data;
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async fetchPropertyInfo(param) {
      console.warn("Param: ", param);
      this.fetchCallMeInfo(param);
    },
    async save() {
      this.saving = true;
      const payload = {
        id: this.id,
        apn: this.apn,
        full_name: this.full_name,
      };
      try {
        this.saving = true;
        await this.saveCallMeInfo(payload).then(() => {
          this.saving = false;
          this.successMessage("success");
        });
        // this.refresh();
      } catch (e) {
        throw e;
      }
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully updated a Job Order", {
        title: `Successful`,
        variant: variant,
        solid: true,
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
          solid: true,
        }
      );
    },
    async fetchProperty() {
      this.$store.dispatch("callMeInfo/fetchCallMeInfo", this.$route.params);
    },
  },
  computed: {
    ...mapGetters({
      property: "callMeInfo/callMeInfo",
    }),
  },
  mounted() {
    this.fetchProperty();
  },
};
</script>
  
  <style scoped>
.company-info {
  float: right;
}
</style>
  
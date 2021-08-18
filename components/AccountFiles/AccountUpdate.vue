<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <div slot="header" class="row align-items-center mb-3">
        <div class="col-8">
          <h3 class="mb-0">
            Account file -
            {{ account.file_name }}
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
                  <div class="col-lg-12"></div>
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="File name"
                      placeholder="File name"
                      name="File name"
                      v-model="account.file_name"
                      :rules="{ required: true }"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="URL"
                      placeholder="URL"
                      name="URL"
                      v-model="account.url"
                      :rules="{ required: true }"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <base-input label="File description">
                      <textarea
                        class="form-control"
                        id="file-description"
                        rows="3"
                        v-model="account.file_description"
                        :rules="{ required: true }"
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
      </b-tabs>
    </div>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "jobOrder_record_view",
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  props: {
    account: {
      Type: Object,
      description: "Account file data"
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
          { value: "job_closed", label: "Job closed" },
          { value: "under_quality_review", label: "Under Quality Review" },
          { value: "daily_tasks", label: "Daily Tasks" },
          { value: "weekly_tasks", label: "Weekly Tasks" },
          { value: "monthly_tasks", label: "Monthly Tasks" },
          { value: "redo", label: "Redo" },
          { value: "pending", label: "Pending" },
          { value: "duplicate_request", label: "Duplicate Request" }
        ]
      }
    };
  },
  methods: {
    ...mapActions("accountFiles", ["updateAccountFiles"]),
    onlyNumbers: function() {
      this.account.total_time_consumed = this.job.total_time_consumed.replace(
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
      const accountPayload = {
        id: this.account.id,
        file_name: this.account.file_name,
        url: this.account.url,
        file_description: this.account.file_description
      };
      try {
        this.saving = true;
        await this.updateAccountFiles(accountPayload)
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
      this.$bvToast.toast("Successfully updated an Account File", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.client
          ? "Client: " + error.client
          : error.staff
          ? "Staff: " + error.staff
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

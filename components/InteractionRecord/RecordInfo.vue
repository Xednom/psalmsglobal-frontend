<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <div slot="header" class="row align-items-center mb-3">
        <div class="col-8">
          <h3 class="mb-0">
            Interaction record for {{ interaction.ticket_number }}
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
                  v-model="interaction.ticket_number"
                  rules="required"
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
                  v-model="interaction.total_minutes"
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
                    v-model="interaction.summary"
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
    async save() {
      const recordPayload = {
        ticket_number: this.interaction.ticket_number,
        customer_interaction_post_paid: this.interaction.id,
        client: this.interaction.company_client,
        agent: this.staffUser.id,
        total_minutes: this.total_minutes,
        summary: this.summary
      };

      if (this.$auth.user.designation_category == "staff") {
        try {
          this.saving = true;
          await this.saveRecord(recordPayload)
            .then(() => {
              this.saving = false;
              this.reset();
              this.refresh();
              this.$refs.formValidator.reset();
              this.successMessage("success");
            })
            .catch(e => {
              this.saving = false;
              this.error = e.response.data;
              this.errorMessage("danger", this.error);
            });
        } catch (e) {
          this.saving = false;
          this.error = e.response.data;
          this.errorMessage("danger", this.error);
        }
      }
      this.saving = false;
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully added a new interaction", {
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
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

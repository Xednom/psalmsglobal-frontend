<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
        <form @submit.prevent="handleSubmit(save)">
          <div v-if="loading" class="pl-lg-12">
            <div class="text-center">
              <b-spinner type="grow" label="Loading..."></b-spinner>
              loading...
            </div>
          </div>
          <div v-else-if="!loading" class="pl-lg-12">
            <div class="row">
              <div class="col-lg-6">
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
              <div class="col-lg-6">
                <base-input
                  type="text"
                  label="Status"
                  placeholder="Status"
                  name="Status"
                  v-model="interaction.status"
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
                <base-input label="Summary of the call">
                  <textarea
                    class="form-control"
                    id="notes"
                    rows="3"
                    v-model="interaction.summary"
                    :rules="{ required: true }"
                    disabled
                  ></textarea>
                </base-input>
              </div>
            </div>
          </div>
          <hr class="my-4" />
          <base-button type="primary" native-type="submit" loading v-if="saving"
            >Submit</base-button
          >
          <base-button
            type="primary"
            native-type="submit"
            v-else-if="!saving && $auth.user.designation_category == 'staff'"
            >Submit</base-button
          >
          <b-button variant="info" v-b-modal.dispute v-if="$auth.user.designation_category != 'staff'">Would you like to dispute the charge</b-button>
          <b-button variant="info" v-b-modal.dispute v-else>See dispute?</b-button>

        </form>
      </validation-observer>

      <b-modal id="dispute" centered hide-footer>
        <template #modal-title>
          Dispute interaction record for {{ interaction.ticket_number }}
        </template>
        <dispute :interaction="interaction" :refresh="refresh"></dispute>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";
import { mapGetters, mapActions } from "vuex";

import CreateInteractionRecordMixin from "@/mixins/CreatePrepaidInteractionRecordMixin.js";
import Dispute from "@/components/InteractionRecord/RecordDispute";

export default {
  name: "prepaid_interaction_record_update",
  mixins: [CreateInteractionRecordMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    Dispute
  },
  props: {
    interaction: {
      Type: Object,
      description: "Customer interaction data"
    },
    refresh: {
      Type: Function
    },
    loading: {
      Type: Boolean
    }
  },
  computed: {
    ...mapGetters({
      client: "user/company"
    }),
    ticket_number: {
      get() {
        return this.interaction.ticket_number;
      },
      set(value) {
        this.setBasicStoreValue("ticket_number", value);
      }
    },
    customer_interaction_post_paid: {
      get() {
        return this.$store.getters[
          "interactionRecord/customer_interaction_post_paid"
        ];
      },
      set(value) {
        this.setBasicStoreValue("customer_interaction_post_paid", value);
      }
    },
    client: {
      get() {
        return this.$store.getters["interactionRecord/client"];
      },
      set(value) {
        this.setBasicStoreValue("client", value);
      }
    },
    agent: {
      get() {
        return this.$store.getters["interactionRecord/agent"];
      },
      set(value) {
        this.setBasicStoreValue("agent", value);
      }
    },
    total_minutes: {
      get() {
        return this.$store.getters["interactionRecord/total_minutes"];
      },
      set(value) {
        this.setBasicStoreValue("total_minutes", value);
      }
    },
    summary: {
      get() {
        return this.$store.getters["interactionRecord/summary"];
      },
      set(value) {
        this.setBasicStoreValue("summary", value);
      }
    }
  },
  data() {
    return {
      query: "",
      companies: [],
      user: {},
      staffUser: {},
      selectedCompany: null,
      isBusy: false,
      saving: false,
      modals: {
        classic: false
      },
      attribute_forms: [],
      dataTypeOptions: [
        { value: "text", label: "Text" },
        { value: "question", label: "Question" }
      ]
    };
  },
  methods: {
    ...mapActions("interactionRecord", ["reset", "updateRecord"]),
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
        UIkit.notification("Error:" + err.response.data, {
          status: "danger"
        });
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
        customer_interaction_post_paid: this.interaction.ticket_number,
        agent: this.staffUser.id,
        total_minutes: this.interaction.total_minutes,
        summary: this.interaction.summary
      };

      if (this.$auth.user.designation_category == "staff") {
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

<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <div slot="header" class="row align-items-center mb-3">
        <div class="col-8">
          <h3 class="mb-0">
            Add interaction record
          </h3>
        </div>
      </div>
      <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
        <form @submit.prevent="handleSubmit(save)">
          <div class="pl-lg-12">
            <div class="row">
              <div class="col-lg-12">

                <base-input label="Caller interaction ticket number">
                  <el-select
                    v-model="ticket_number"
                    filterable
                    placeholder="Choose a Ticket"
                    rules="required"
                  >
                    <el-option
                      v-for="option in custInteractions"
                      :key="option.id"
                      :label="option.ticket_number"
                      :value="option.ticket_number"
                    >
                    </el-option>
                  </el-select>
                </base-input>
              </div>
              <div class="col-lg-12">
                <base-input
                  type="text"
                  label="Total minutes"
                  placeholder="Total minutes"
                  name="Total minutes"
                  v-model="total_minutes"
                  :rules="{ required: true }"
                >
                </base-input>
              </div>
              <div class="col-lg-12">
                <base-input label="Summary">
                  <textarea
                    class="form-control"
                    id="notes"
                    rows="3"
                    v-model="summary"
                    :rules="{ required: true }"
                  ></textarea>
                </base-input>
              </div>
            </div>
          </div>
          <hr class="my-4" />
          <base-button type="primary" native-type="submit" loading v-if="saving"
            >Submit</base-button
          >
          <base-button type="primary" native-type="submit" v-else
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

import CreateInteractionRecordMixin from "@/mixins/CreatePrepaidInteractionRecordMixin.js";

export default {
  name: "record_create",
  mixins: [CreateInteractionRecordMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  props: {
    refresh: {
      Type: Function
    }
  },
  computed: {
    ...mapGetters({
      client: "user/company"
    }),
    ticket_number: {
      get() {
        return this.$store.getters["prepaid/interactionRecord/ticket_number"];
      },
      set(value) {
        this.setBasicStoreValue("ticket_number", value);
      }
    },
    customer_interaction_post_paid: {
      get() {
        return this.$store.getters[
          "prepaid/interactionRecord/customer_interaction_post_paid"
        ];
      },
      set(value) {
        this.setBasicStoreValue("customer_interaction_post_paid", value);
      }
    },
    client: {
      get() {
        return this.$store.getters["prepaid/interactionRecord/client"];
      },
      set(value) {
        this.setBasicStoreValue("client", value);
      }
    },
    agent: {
      get() {
        return this.$store.getters["prepaid/interactionRecord/agent"];
      },
      set(value) {
        this.setBasicStoreValue("agent", value);
      }
    },
    total_minutes: {
      get() {
        return this.$store.getters["prepaid/interactionRecord/total_minutes"];
      },
      set(value) {
        this.setBasicStoreValue("total_minutes", value);
      }
    },
    summary: {
      get() {
        return this.$store.getters["prepaid/interactionRecord/summary"];
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
      custInteractions: [],
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
    ...mapActions("prepaid/interactionRecord", ["reset", "savePrepaidRecord"]),
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
    async fetchPrepaidCustInteractions() {
      this.loading = true;
      let endpoint = `/api/v1/prepaid/customer-interaction/`;
      try {
        await this.$axios.get(endpoint).then(res => {
          this.loading = false;
          this.custInteractions = res.data.results;
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
        ticket_number: this.ticket_number,
        customer_interaction_prepaid: this.ticket_number,
        agent: this.staffUser.id,
        total_minutes: this.total_minutes,
        summary: this.summary
      };

      if (this.$auth.user.designation_category == "staff") {
        try {
          this.saving = true;
          await this.savePrepaidRecord(recordPayload)
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
    this.fetchPrepaidCustInteractions();
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <card>
        <div slot="header" class="row align-items-center">
          <div class="col-8">
            <h3 class="mb-0">Add new Phone system for a Company</h3>
          </div>
          <div class="col-4 text-right">
            <base-button type="info" @click="save">Save</base-button>
          </div>
        </div>
        <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
          <form @submit.prevent="handleSubmit(save)">
            <h6 class="heading-small text-muted mb-4">
              Phone system information
            </h6>

            <div class="pl-lg-4">
              <div class="row">
                <div class="col-lg-3">
                  <base-input
                    label="Company"
                    name="Company"
                    rules="required"
                  >
                    <el-select
                      v-model="company"
                      filterable
                      placeholder="Choose a Company"
                    >
                      <el-option
                        v-for="option in companies"
                        :key="option.id"
                        :label="option.company"
                        :value="option.company_name"
                      >
                      </el-option>
                    </el-select>
                  </base-input>
                </div>
                <div class="col-lg-1 mt-4">
                  <base-checkbox
                    v-model="sub_number"
                    name="Sub number"
                    class="mb-3"
                  >
                    Sub number
                  </base-checkbox>
                </div>
                <div class="col-lg-3">
                  <base-input
                    label="Vodaconnect Plan"
                    name="Vodaconnect plan"
                    rules="required"
                  >
                    <el-select
                      v-model="vodaconnect_plan"
                      filterable
                      placeholder="Choose a plan"
                    >
                      <el-option
                        v-for="option in plans"
                        :key="option.id"
                        :label="option.range"
                        :value="option.range"
                      >
                      </el-option>
                    </el-select>
                  </base-input>
                </div>
                <div class="col-lg-3">
                  <base-input
                    label="Vodaconnect line type"
                    name="Vodaconnect line type"
                    rules="required"
                  >
                    <el-select
                      v-model="vodaconnect_line_type"
                      filterable
                      placeholder="Choose a plan"
                    >
                      <el-option
                        v-for="option in lines"
                        :key="option.id"
                        :label="option.line"
                        :value="option.line"
                      >
                      </el-option>
                    </el-select>
                  </base-input>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-4">
                  <base-input
                    type="text"
                    label="Original Line"
                    placeholder="Original Line"
                    name="Original Line"
                    rules="required"
                    v-model="original_line"
                  >
                  </base-input>
                </div>
                <div class="col-lg-4">
                  <base-input
                    type="text"
                    label="Call forwarding number"
                    placeholder="Call forwarding number"
                    name="Call forwarding number"
                    rules="required"
                    v-model="call_forwarding_number"
                  >
                  </base-input>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <base-input label="Caller ID Detail">
                    <textarea
                      class="form-control"
                      id="callerIdDetail"
                      rows="3"
                      v-model="caller_id_detail"
                    ></textarea>
                  </base-input>
                </div>
              </div>
            </div>
            <base-button type="primary" native-type="submit">Submit</base-button>
          </form>
        </validation-observer>
      </card>
    </div>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";
import { mapGetters, mapActions } from "vuex";

import CreatePhoneSystemMixin from "@/mixins/CreatePhoneSystemMixin.js";

export default {
  name: "crm_list",
  mixins: [CreatePhoneSystemMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  computed: {
    ...mapGetters({
      companies: "company/companies",
      plans: "phoneSystem/vodaConnectPlans",
      lines: "phoneSystem/vodaConnectLineTypes",
      user: "user/user",
      client: "user/company"
    }),
    company: {
      get() {
        return this.$store.getters["phoneSystem/company"];
      },
      set(value) {
        this.setBasicStoreValue("company", value);
      }
    },
    sub_number: {
      get() {
        return this.$store.getters["phoneSystem/sub_number"];
      },
      set(value) {
        this.setBasicStoreValue("sub_number", value);
      }
    },
    caller_id_detail: {
      get() {
        return this.$store.getters["phoneSystem/caller_id_detail"];
      },
      set(value) {
        this.setBasicStoreValue("caller_id_detail", value);
      }
    },
    vodaconnect_plan: {
      get() {
        return this.$store.getters["phoneSystem/vodaconnect_plan"];
      },
      set(value) {
        this.setBasicStoreValue("vodaconnect_plan", value);
      }
    },
    original_line: {
      get() {
        return this.$store.getters["phoneSystem/original_line"];
      },
      set(value) {
        this.setBasicStoreValue("original_line", value);
      }
    },
    call_forwarding_number: {
      get() {
        return this.$store.getters["phoneSystem/call_forwarding_number"];
      },
      set(value) {
        this.setBasicStoreValue("call_forwarding_number", value);
      }
    },
    vodaconnect_line_type: {
      get() {
        return this.$store.getters["phoneSystem/vodaconnect_line_type"];
      },
      set(value) {
        this.setBasicStoreValue("vodaconnect_line_type", value);
      }
    }
  },
  data() {
    return {
      validated: false,
      clientUser: {},
      isBusy: false,
      saving: false,
      modals: {
        form: false
      }
    };
  },
  methods: {
    ...mapActions("phoneSystem", ["reset", "savePhone"]),
    async fetchCompanies() {
      this.isBusy = true;
      await this.$store
        .dispatch("company/fetchCompanies", this.pagination)
        .then(() => {
          this.isBusy = false;
        });
    },
    async fetchPlans() {
      this.isBusy = true;
      await this.$store
        .dispatch("phoneSystem/fetchVodaConnectPlans", this.pagination)
        .then(() => {
          this.isBusy = false;
        });
    },
    async fetchLineTypes() {
      this.isBusy = true;
      await this.$store
        .dispatch("phoneSystem/fetchVodaConnectLineTypes", this.pagination)
        .then(() => {
          this.isBusy = false;
        });
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
    async save() {
      const phonePayload = {
        company: this.company,
        sub_number: this.sub_number,
        caller_id_detail: this.caller_id_detail,
        vodaconnect_plan: this.vodaconnect_plan,
        original_line: this.original_line,
        call_forwarding_number: this.call_forwarding_number,
        vodaconnect_line_type: this.vodaconnect_line_type
      };

      if (
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        try {
          this.saving = true;
          await this.savePhone(phonePayload)
            .then(() => {
              this.validated = true;
              this.saving = false;
              this.reset();
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
      this.$bvToast.toast("Successfully added a Phone system information!", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.client
          ? "Company: " + error.client
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
    this.fetchCompanies();
    this.fetchPlans();
    this.fetchLineTypes();
    this.$refs.formValidator.validate()
    if (
      this.$auth.user.designation_category == "new_client" ||
      this.$auth.user.designation_category == "current_client" ||
      this.$auth.user.designation_category == "affiliate_partner"
    ) {
      this.fetchClient(this.$auth.user.id);
    }
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

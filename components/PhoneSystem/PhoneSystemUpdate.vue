<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <card>
        <div slot="header" class="row align-items-center">
          <div class="col-8">
            <h3 class="mb-0">Update your Phone system for a Company</h3>
          </div>
          <div class="col-4 text-right">
            <nuxt-link to="/phone-system/"
              ><base-button type="info"
                >Back to Phone list</base-button
              ></nuxt-link
            >
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
                  <base-input label="Company" name="Company">
                    <el-select
                      v-model="phoneSystem.company"
                      filterable
                      placeholder="Choose a Company"
                      disabled
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
                    v-model="phoneSystem.sub_number"
                    name="Sub number"
                    class="mb-3"
                    disabled
                  >
                    Sub number
                  </base-checkbox>
                </div>
                <div class="col-lg-3">
                  <base-input
                    label="Vodaconnect Plan"
                    name="Vodaconnect plan"
                  >
                    <el-select
                      v-model="phoneSystem.vodaconnect_plan"
                      filterable
                      placeholder="Choose a plan"
                      disabled
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
                  >
                    <el-select
                      v-model="phoneSystem.vodaconnect_line_type"
                      filterable
                      placeholder="Choose a plan"
                      disabled
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
                    v-model="phoneSystem.original_line"
                    disabled
                  >
                  </base-input>
                </div>
                <div class="col-lg-4">
                  <base-input
                    type="text"
                    label="Call forwarding number"
                    placeholder="Call forwarding number"
                    name="Call forwarding number"
                    v-model="phoneSystem.call_forwarding_number"
                    disabled
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
                      v-model="phoneSystem.caller_id_detail"
                      disabled
                    ></textarea>
                  </base-input>
                </div>
              </div>
            </div>
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
    })
  },
  data() {
    return {
      validated: false,
      clientUser: {},
      phoneSystem: {},
      isBusy: false,
      saving: false,
      modals: {
        form: false
      }
    };
  },
  methods: {
    ...mapActions("phoneSystem", ["reset", "updatePhone"]),
    async fetchPhoneSystem(payload) {
      this.loading = true;
      let endpoint = `/api/v1/phone-system/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.loading = false;
          this.phoneSystem = res.data;
        })
        .catch(e => {
          this.loading = false;
          console.log(e);
          throw e;
        });
    },
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
        id: this.phoneSystem.id,
        company: this.phoneSystem.company,
        sub_number: this.phoneSystem.sub_number,
        caller_id_detail: this.phoneSystem.caller_id_detail,
        vodaconnect_plan: this.phoneSystem.vodaconnect_plan,
        original_line: this.phoneSystem.original_line,
        call_forwarding_number: this.phoneSystem.call_forwarding_number,
        vodaconnect_line_type: this.phoneSystem.vodaconnect_line_type
      };

      if (
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        try {
          this.saving = true;
          await this.updatePhone(phonePayload)
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
      this.$bvToast.toast(
        "Successfully updated your Phone system information!",
        {
          title: `Successful`,
          variant: variant,
          solid: true
        }
      );
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
    this.fetchPhoneSystem(this.$route.params.id);
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

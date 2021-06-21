<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <card>
        <div slot="header" class="row align-items-center">
          <div class="col-8">
            <h3 class="mb-0">Add new Company</h3>
          </div>
          <div class="col-4 text-right">
            <base-button type="info" @click="save">Save</base-button>
          </div>
        </div>

        <form @submit.prevent="updateProfile">
          <h6 class="heading-small text-muted mb-4">
            Company information
          </h6>

          <div class="pl-lg-4">
            <div class="row">
              <div class="col-lg-3">
                <base-input
                  type="text"
                  label="Company name"
                  placeholder="Company name"
                  v-model="company_name"
                >
                </base-input>
              </div>
              <div class="col-lg-3">
                <base-input
                  label="Company owner name"
                  placeholder="Company owner name"
                  v-model="company_owner_name"
                >
                </base-input>
              </div>
              <div class="col-lg-3">
                <base-input label="Business type">
                  <el-select
                    v-model="business_type"
                    filterable
                    placeholder="Choose a business type"
                  >
                    <el-option
                      v-for="option in businessTypeOptions"
                      :key="option.label"
                      :label="option.label"
                      :value="option.value"
                    >
                    </el-option>
                  </el-select>
                </base-input>
              </div>
              <div class="col-lg-3">
                <base-input
                  type="text"
                  label="Company phone"
                  placeholder="Company phone"
                  v-model="company_phone"
                >
                </base-input>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4">
                <base-input
                  type="text"
                  label="Company email"
                  placeholder="Company email"
                  v-model="company_email"
                >
                </base-input>
              </div>
              <div class="col-lg-4">
                <base-input
                  type="text"
                  label="Company forwarding email"
                  placeholder="Company forwarding email"
                  v-model="company_forwarding_email"
                >
                </base-input>
              </div>
              <div class="col-lg-4">
                <base-input
                  type="text"
                  label="Company paypal email for billing purposes"
                  placeholder="Company paypal email"
                  v-model="paypal_email"
                >
                </base-input>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6">
                <base-input label="Company complete address">
                  <textarea
                    class="form-control"
                    id="notes"
                    rows="3"
                    v-model="company_complete_address"
                  ></textarea>
                </base-input>
              </div>
              <div class="col-lg-6">
                <base-input label="Notes">
                  <textarea
                    class="form-control"
                    id="notes"
                    rows="3"
                    v-model="notes"
                  ></textarea>
                </base-input>
              </div>
            </div>
          </div>
        </form>
      </card>
    </div>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";

import StatsCard from "@/components/argon-core/Cards/StatsCard";
import { mapGetters, mapActions } from "vuex";

import CreateCompanyMixin from "@/mixins/CreateCompanyMixin.js";

export default {
  name: "company_list",
  mixins: [CreateCompanyMixin],
  components: {
    StatsCard,
    [Select.name]: Select,
    [Option.name]: Option
  },
  computed: {
    ...mapGetters({
      companies: "company/companies",
      pagination: "company/companiesPagination",
      user: "user/user",
      client: "user/company"
    }),
    company_name: {
      get() {
        return this.$store.getters["company/company_name"];
      },
      set(value) {
        this.setBasicStoreValue("company_name", value);
      }
    },
    company_owner_name: {
      get() {
        return this.$store.getters["company/company_owner_name"];
      },
      set(value) {
        this.setBasicStoreValue("company_owner_name", value);
      }
    },
    business_type: {
      get() {
        return this.$store.getters["company/business_type"];
      },
      set(value) {
        this.setBasicStoreValue("business_type", value);
      }
    },
    company_phone: {
      get() {
        return this.$store.getters["company/company_phone"];
      },
      set(value) {
        this.setBasicStoreValue("company_phone", value);
      }
    },
    company_email: {
      get() {
        return this.$store.getters["company/company_email"];
      },
      set(value) {
        this.setBasicStoreValue("company_email", value);
      }
    },
    company_complete_address: {
      get() {
        return this.$store.getters["company/company_complete_address"];
      },
      set(value) {
        this.setBasicStoreValue("company_complete_address", value);
      }
    },
    company_forwarding_email: {
      get() {
        return this.$store.getters["company/company_forwarding_email"];
      },
      set(value) {
        this.setBasicStoreValue("company_forwarding_email", value);
      }
    },
    paypal_email: {
      get() {
        return this.$store.getters["company/paypal_email"];
      },
      set(value) {
        this.setBasicStoreValue("paypal_email", value);
      }
    },
    notes: {
      get() {
        return this.$store.getters["company/notes"];
      },
      set(value) {
        this.setBasicStoreValue("notes", value);
      }
    }
  },
  data() {
    return {
      company: {},
      clientUser: {},
      isBusy: false,
      saving: false,
      modals: {
        form: false
      },
      businessTypeOptions: [
        { value: "individual", label: "Individual" },
        { value: "partnership", label: "Partnership" },
        { value: "corporation", label: "Corporation" },
        { value: "llcs", label: "LLCs" },
        { value: "others", label: "Others" }
      ]
    };
  },
  methods: {
    ...mapActions("company", ["reset", "saveCompany"]),
    async fetchCompanies() {
      this.isBusy = true;
      await this.$store
        .dispatch("company/fetchCompanies", this.pagination)
        .then(() => {
          this.isBusy = false;
        });
    },
    async fetchCompany(id) {
      let endpoint = `/api/v1/company/${id}`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.company = res.data;
          console.log(this.company);
        })
        .catch(e => {
          throw e;
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
      const companyPayload = {
        client: this.clientUser.id,
        company_name: this.company_name,
        company_owner_name: this.company_owner_name,
        business_type: this.business_type,
        company_phone: this.company_phone,
        company_email: this.company_email,
        company_complete_address: this.company_complete_address,
        company_forwarding_email: this.company_forwarding_email,
        paypal_email: this.paypal_email,
        notes: this.notes
      };

      if (
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        try {
          this.saving = true;
          await this.saveCompany(companyPayload)
            .then(() => {
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
        }
      }
      this.saving = false;
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully added a Company information!", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.client
          ? "Client: " + error.client
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

<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <card>
        <div slot="header" class="row align-items-center">
          <div class="col-8">
            <h3 class="mb-0">Add new CRM for a Company</h3>
          </div>
          <div class="col-4 text-right">
            <nuxt-link to="/crm/">
              <base-button type="info">Back to CRM list</base-button></nuxt-link
            >
          </div>
        </div>
        <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
          <form @submit.prevent="handleSubmit(save)">
            <h6 class="heading-small text-muted mb-4">
              CRM information
            </h6>

            <div class="pl-lg-4">
              <div class="row">
                <div class="col-lg-3">
                  <base-input label="Company">
                    <el-select
                      v-model="company"
                      filterable
                      placeholder="Choose a Company"
                      rules="required"
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
                  <base-checkbox v-model="crm" class="mb-3">
                    CRM
                  </base-checkbox>
                </div>
                <div class="col-lg-8">
                  <base-input
                    type="text"
                    label="CRM URL"
                    placeholder="CRM URL"
                    name="CRM URL"
                    v-model="crm_url"
                    rules="required"
                  >
                  </base-input>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-4">
                  <base-input label="Type of CRM">
                    <textarea
                      class="form-control"
                      id="typeOfCrm"
                      rows="3"
                      v-model="type_of_crm"
                    ></textarea>
                  </base-input>
                </div>
                <div class="col-lg-4">
                  <base-input label="CRM Login">
                    <textarea
                      class="form-control"
                      id="crmLogin"
                      rows="3"
                      v-model="crm_login"
                    ></textarea>
                  </base-input>
                </div>
                <div class="col-lg-4">
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
            <base-button
              type="primary"
              native-type="submit"
              loading
              v-if="saving"
              >Submit</base-button
            >
            <base-button type="primary" native-type="submit" v-else
              >Submit</base-button
            >
          </form>
        </validation-observer>
      </card>
    </div>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";
import { mapGetters, mapActions } from "vuex";

import CreateCrmMixin from "@/mixins/CreateCrmMixin.js";

export default {
  name: "crm_list",
  mixins: [CreateCrmMixin],
  components: {
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
    company: {
      get() {
        return this.$store.getters["crm/company"];
      },
      set(value) {
        this.setBasicStoreValue("company", value);
      }
    },
    crm: {
      get() {
        return this.$store.getters["crm/crm"];
      },
      set(value) {
        this.setBasicStoreValue("crm", value);
      }
    },
    type_of_crm: {
      get() {
        return this.$store.getters["crm/type_of_crm"];
      },
      set(value) {
        this.setBasicStoreValue("type_of_crm", value);
      }
    },
    crm_url: {
      get() {
        return this.$store.getters["crm/crm_url"];
      },
      set(value) {
        this.setBasicStoreValue("crm_url", value);
      }
    },
    crm_login: {
      get() {
        return this.$store.getters["crm/crm_login"];
      },
      set(value) {
        this.setBasicStoreValue("crm_login", value);
      }
    },
    notes: {
      get() {
        return this.$store.getters["crm/notes"];
      },
      set(value) {
        this.setBasicStoreValue("notes", value);
      }
    }
  },
  data() {
    return {
      clientUser: {},
      isBusy: false,
      saving: false,
      modals: {
        form: false
      }
    };
  },
  methods: {
    ...mapActions("crm", ["reset", "saveCrm"]),
    async fetchCompanies() {
      this.isBusy = true;
      await this.$store
        .dispatch("company/fetchCompanies", this.pagination)
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
      const crmPayload = {
        company: this.company,
        crm: this.crm,
        type_of_crm: this.type_of_crm,
        crm_url: this.crm_url,
        crm_login: this.crm_login,
        notes: this.notes
      };

      if (
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        try {
          this.saving = true;
          await this.saveCrm(crmPayload)
            .then(() => {
              this.saving = false;
              this.reset();
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
      this.$bvToast.toast("Successfully added a CRM information!", {
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

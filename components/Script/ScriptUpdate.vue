<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <card>
        <div slot="header" class="row align-items-center">
          <div class="col-8">
            <h3 class="mb-0">Update Script for {{ script.company }}</h3>
          </div>
          <div class="col-4 text-right">
            <nuxt-link to="/script/"
              ><base-button type="info"
                >Back to Forms Mailing List</base-button
              ></nuxt-link
            >
          </div>
        </div>
        <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
          <form @submit.prevent="handleSubmit(save)">
            <h6 class="heading-small text-muted mb-4">
              Script information
            </h6>

            <div class="pl-lg-4">
              <div class="row">
                <div class="col-lg-3">
                  <base-input label="Company">
                    <el-select
                      v-model="script.company"
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
                <div class="col-lg-3">
                  <base-input label="Form">
                    <el-select
                      v-model="script.form"
                      filterable
                      placeholder="Choose a Form"
                    >
                      <el-option
                        v-for="option in forms"
                        :key="option.id"
                        :label="option.form"
                        :value="option.form_title"
                      >
                      </el-option>
                    </el-select>
                  </base-input>
                </div>
                <div class="col-lg-1 mt-4">
                  <base-checkbox v-model="script.status" class="mb-3">
                    Status
                  </base-checkbox>
                </div>
                <div class="col-lg-4">
                  <label>Mailing list</label>
                  <b-form-tags
                    input-id="tags-separators"
                    v-model="script.mailing_lists"
                    separator=" "
                    placeholder="Enter new email separated by space"
                    remove-on-delete
                    no-add-on-enter
                  ></b-form-tags>
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
    [Option.name]: Option,
  },
  computed: {
    ...mapGetters({
      companies: "company/companies",
      forms: "script/forms",
      pagination: "company/companiesPagination",
      user: "user/user",
      client: "user/company"
    }),
  },
  data() {
    return {
      clientUser: {},
      script: {},
      isBusy: false,
      saving: false,
      mailing_list: "",
      modals: {
        form: false
      }
    };
  },
  methods: {
    ...mapActions("script", ["reset", "updateScript"]),
    async fetchForms() {
      this.isBusy = true;
      await this.$store
        .dispatch("script/fetchForms", this.pagination)
        .then(() => {
          this.isBusy = false;
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
    async fetchScript(payload) {
      this.loading = true;
      let endpoint = `/api/v1/script/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.loading = false;
          this.script = res.data;
        })
        .catch(e => {
          this.loading = false;
          console.log(e);
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
      const scriptPayload = {
        id: this.script.id,
        company: this.script.company,
        form: this.script.form,
        mailing_lists: this.script.mailing_lists
      };

      console.log(scriptPayload.mailing_lists)

      if (
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        try {
          this.saving = true;
          await this.updateScript(scriptPayload)
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
      this.$bvToast.toast("Successfully updated a Script information!", {
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
    },
  },
  mounted() {
    this.fetchScript(this.$route.params.id);
    this.fetchForms();
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

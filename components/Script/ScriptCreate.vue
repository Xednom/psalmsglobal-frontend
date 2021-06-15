<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <card>
        <div slot="header" class="row align-items-center">
          <div class="col-8">
            <h3 class="mb-0">Add new Script for a Company</h3>
          </div>
          <div class="col-4 text-right">
            <nuxt-link to="/script/">
              <base-button type="info"
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
                <div class="col-lg-4">
                  <label for="tags-separators">Mailing Lists</label>
                  <b-form-tags
                    input-id="tags-separators"
                    v-model="mailing_lists"
                    separator=" ,;"
                    placeholder="Enter new email"
                    no-add-on-enter
                  ></b-form-tags>
                  <small class="text-muted"
                    >Enter new email separated by space, comma or
                    semicolon</small
                  >
                </div>
                <div class="col-lg-1 mt-4">
                  <base-checkbox v-model="status" class="mb-3">
                    Status
                  </base-checkbox>
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

import CreateScriptMixin from "@/mixins/CreateScriptMixin.js";

export default {
  name: "crm_list",
  mixins: [CreateScriptMixin],
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
        return this.$store.getters["script/company"];
      },
      set(value) {
        this.setBasicStoreValue("company", value);
      }
    },
    company_address: {
      get() {
        return this.$store.getters["script/company_address"];
      },
      set(value) {
        this.setBasicStoreValue("company_address", value);
      }
    },
    form: {
      get() {
        return this.$store.getters["script/form"];
      },
      set(value) {
        this.setBasicStoreValue("form", value);
      }
    },
    mailing_lists: {
      get() {
        return this.$store.getters["script/mailing_lists"];
      },
      set(value) {
        this.setBasicStoreValue("mailing_lists", value);
      }
    },
    status: {
      get() {
        return this.$store.getters["script/status"];
      },
      set(value) {
        this.setBasicStoreValue("status", value);
      }
    },
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
    ...mapActions("script", ["reset", "saveScript"]),
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
      const scriptPayload = {
        company: this.company,
        status: this.status,
        mailing_lists: String(this.mailing_lists),
      };
      console.log(String(this.mailing_lists));

      if (
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        try {
          this.saving = true;
          await this.saveScript(scriptPayload)
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
      this.$bvToast.toast("Successfully added a Script information!", {
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

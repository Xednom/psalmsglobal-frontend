<template>
  <div class="container">
    <div class="col-xl-12 col-md-12 col-sm-12 ">
      <card>
        <div slot="header" class="row align-items-center">
          <div class="col-8">
            <h3 class="mb-0">Create a Resolution</h3>
          </div>
          <div class="col-4 text-right">
            <nuxt-link to="/resolution/">
              <base-button type="info"
                >Back to Resolution list</base-button
              ></nuxt-link
            >
          </div>
        </div>
        <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
          <form @submit.prevent="handleSubmit(save)">
            <div class="pl-lg-4">
              <div class="row">
                <div class="col-lg-3">
                  <base-input label="Category">
                    <el-select
                      v-model="category"
                      filterable
                      placeholder="Choose a category"
                      rules="required"
                    >
                      <el-option
                        v-for="option in categories"
                        :key="option.id"
                        :label="option.name"
                        :value="option.name"
                      >
                      </el-option>
                    </el-select>
                  </base-input>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 col-sm-12 col-lg-12">
                  <base-input label="Description">
                    <textarea
                      class="form-control"
                      rows="3"
                      v-model="description"
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

import ResolutionMixin from "@/mixins/ResolutionMixin.js";

export default {
  name: "crm_list",
  mixins: [ResolutionMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  computed: {
    ...mapGetters({
      categories: "resolution/resolutionCategory",
      user: "user/user",
      client: "user/company"
    })
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
    ...mapActions("resolution", ["resetResolution", "saveResolution"]),
    async fetchCategories() {
      this.isBusy = true;
      await this.$store
        .dispatch("resolution/fetchResolutionCategory", this.pagination)
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
      const payload = {
        category: this.category,
        description: this.description,
        client: this.clientUser.id
      };

      if (
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        try {
          this.saving = true;
          await this.saveResolution(payload)
            .then(() => {
              this.saving = false;
              this.resetResolution();
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
      this.$bvToast.toast("Successfully added a Thread!", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.title
          ? "Title: " + error.title
          : error.content
          ? "Content: " + error.content
          : error.author
          ? "Author: " + error.author
          : error.staff_carbon_copy
          ? "Staff carbon copy: " + error.staff_carbon_copy
          : error.client_carbon_copy
          ? "Client carbon copy: " + error.client_carbon_copy
          : error.is_active
          ? "Active: " + error.is_active
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
    this.fetchCategories();
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

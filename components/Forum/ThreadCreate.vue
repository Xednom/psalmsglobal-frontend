<template>
  <div class="container">
    <div class="col-xl-12 col-md-12 col-sm-12 ">
      <card>
        <div slot="header" class="row align-items-center">
          <div class="col-8">
            <h3 class="mb-0">Create a Thread</h3>
          </div>
          <div class="col-4 text-right">
            <nuxt-link to="/resolution/">
              <base-button type="info"
                >Back to Thread list</base-button
              ></nuxt-link
            >
          </div>
        </div>
        <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
          <form @submit.prevent="handleSubmit(save)">
            <div class="pl-lg-6">
              <div class="row">
                <div class="col-lg-12">
                  <base-input
                    type="text"
                    label="Title"
                    placeholder="Title"
                    v-model="title"
                    name="Title"
                    rules="required"
                  >
                  </base-input>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <base-input label="Staff carbon copy">
                    <el-select
                      v-model="optionStaffs"
                      multiple
                      filterable
                      placeholder="Search here"
                    >
                      <el-option
                        v-for="option in staffs"
                        :key="option.id"
                        :label="option.staff_id"
                        :value="option.staff_id"
                      >
                      </el-option>
                    </el-select>
                  </base-input>
                </div>
                <div class="col-md-6" v-if="$auth.user.designation_category == 'staff'">
                  <base-input label="Client carbon copy">
                    <el-select
                      v-model="optionClients"
                      multiple
                      filterable
                      placeholder="Search here"
                    >
                      <el-option
                        v-for="option in clients"
                        :key="option.id"
                        :label="option.client_code"
                        :value="option.client_code"
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
                      v-model="content"
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

import ForumMixin from "@/mixins/ForumMixin.js";

export default {
  name: "thread-create",
  mixins: [ForumMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  computed: {
    ...mapGetters({
      staffs: "user/staffs",
      clients: "user/clients",
    })
  },
  data() {
    return {
      isBusy: false,
      saving: false,
      optionStaffs: [],
      optionClients: [],
    };
  },
  methods: {
    ...mapActions("forum", ["resetThread", "saveThread"]),
    async fetchStaffCodes() {
      try {
        await this.$store.dispatch("user/fetchStaffCodes");
        this.optionStaffs = this.staffs;
      } catch (e) {
        throw e;
      }
    },
    async fetchClientCodes() {
      try {
        await this.$store.dispatch("user/fetchClientCodes");
        this.optionClients = this.clients;
      } catch (e) {
        throw e;
      }
    },
    async save() {
      const payload = {
        author: this.$auth.user.id,
        title: this.title,
        content: this.content,
        staff_carbon_copy: this.staff_carbon_copy,
        client_carbon_copy: this.client_carbon_copy
      };

      if (
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        try {
          this.saving = true;
          await this.saveThread(payload)
            .then(() => {
              this.saving = false;
              this.resetThread();
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
    this.fetchStaffCodes();
    this.fetchClientCodes();
  },
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

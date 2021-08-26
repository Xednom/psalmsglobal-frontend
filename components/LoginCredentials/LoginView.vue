<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <b-tabs content-class="mt-3">
        <!-- This tabs content will always be mounted -->
        <b-tab title="Job order">
          <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
            <form @submit.prevent="handleSubmit(save)">
              <div class="pl-lg-12">
                <div class="row">
                  <div class="col-lg-12"></div>
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Category"
                      placeholder="Category"
                      name="Category"
                      v-model="login.category"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="URL"
                      placeholder="URL"
                      name="URL"
                      v-model="login.url"
                      :rules="{ required: true }"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Username"
                      placeholder="username"
                      name="Username"
                      v-model="login.username"
                      :rules="{ required: true }"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Password"
                      placeholder="Password"
                      name="Password"
                      v-model="login.password"
                      :rules="{ required: true }"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <base-input label="Notes">
                      <textarea
                        class="form-control"
                        id="notes"
                        rows="3"
                        v-model="login.notes"
                        :rules="{ required: true }"
                      ></textarea>
                    </base-input>
                  </div>
                </div>
                <!-- <base-button
                  type="info"
                  native-type="submit"
                  loading
                  v-if="saving"
                  >Updating</base-button
                >
                <base-button type="info" native-type="submit" v-else
                  >Update</base-button
                > -->
              </div>
            </form>
          </validation-observer>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "login_credential_view",
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  props: {
    login: {
      Type: Object,
      description: "Login Credential file data"
    },
    refresh: {
      Type: Function,
      description: "Refresh the list data"
    }
  },
  data() {
    return {
      query: "",
      companies: [],
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
      ],
    };
  },
  methods: {
    ...mapActions("loginCredentials", ["updateLogin"]),
    onlyNumbers: function() {
      this.login.total_time_consumed = this.job.total_time_consumed.replace(
        /[^0-9.]/g,
        ""
      );
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
      this.saving = true;
      const accountPayload = {
        id: this.login.id,
        file_name: this.login.file_name,
        url: this.login.url,
        file_description: this.login.file_description
      };
      try {
        this.saving = true;
        await this.updateLogin(accountPayload)
          .then(() => {
            this.saving = false;
            this.successMessage("success");
            this.refresh();
          })
          .catch(e => {
            this.saving = false;
            this.errorMessage("danger", e.response.data);
            console.log(e);
          });
      } catch (e) {
        throw e;
      }
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully updated an Login Credentials", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.client
          ? "Client: " + error.client
          : error.staff
          ? "Staff: " + error.staff
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
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

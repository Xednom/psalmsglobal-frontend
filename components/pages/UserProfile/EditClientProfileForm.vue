<template>
  <card>
    <div slot="header" class="row align-items-center">
      <div class="col-8">
        <h3 class="mb-0">Edit profile</h3>
      </div>
      <div class="col-4 text-right">
        <base-button type="info" @click="saveClient">Save</base-button>
      </div>
    </div>

    <form @submit.prevent="updateProfile">
      <h6 class="heading-small text-muted mb-4">User account information</h6>

      <div class="pl-lg-4">
        <div class="row">
          <div class="col-lg-6">
            <base-input
              type="text"
              label="Username"
              placeholder="Username"
              v-model="user.username"
            >
            </base-input>
          </div>
          <div class="col-lg-6">
            <base-input
              type="email"
              label="Email address"
              placeholder="mike@email.com"
              v-model="user.email"
            >
            </base-input>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6">
            <base-input
              type="text"
              label="First Name"
              placeholder="First Name"
              v-model="user.first_name"
            >
            </base-input>
          </div>
          <div class="col-lg-6">
            <base-input
              type="text"
              label="Last Name"
              placeholder="Last Name"
              v-model="user.last_name"
            >
            </base-input>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6">
            <base-input label="Designation Category">
              <el-select
                v-model="user.designation_category"
                filterable
                placeholder="Designation Category"
                disabled
              >
                <el-option
                  v-for="option in designationOptions"
                  :key="option.label"
                  :label="option.label"
                  :value="option.value"
                >
                </el-option>
              </el-select>
            </base-input>
          </div>

          <div class="col-lg-6">
            <base-input label="Company Category">
              <el-select
                v-model="user.company_category"
                filterable
                placeholder="Company Category"
                disabled
              >
                <el-option
                  v-for="option in companyOptions"
                  :key="option.label"
                  :label="option.label"
                  :value="option.value"
                >
                </el-option>
              </el-select>
            </base-input>
          </div>
        </div>
      </div>
      <hr class="my-4" />

      <!-- Address -->
      <h6 class="heading-small text-muted mb-4">Client information</h6>

      <div class="pl-lg-4">
        <div class="row">
          <div class="col-md-3">
            <base-input
              type="text"
              label="Client code"
              placeholder="Client Code"
              v-model="clientUser.client_code"
            >
            </base-input>
          </div>

          <div class="col-lg-3">
            <base-input
              type="text"
              label="Affiliate partner code"
              placeholder="Affiliate partner code"
              v-model="clientUser.affiliate_partner_code"
            >
            </base-input>
          </div>
          <div class="col-lg-3">
            <base-input
              type="text"
              label="Affiliate partner name"
              placeholder="Affiliate partner name"
              v-model="clientUser.affiliate_partner_name"
            >
            </base-input>
          </div>
          <div class="col-lg-3">
            <base-input label="PIN" placeholder="PIN" v-model="clientUser.pin">
            </base-input>
          </div>
        </div>
      </div>
      <div class="pl-lg-4">
        <div class="row">
          <div class="col-lg-3">
            <base-input
              type="text"
              label="Customer ID"
              placeholder="Customer ID"
              v-model="clientUser.customer_id"
            >
            </base-input>
          </div>
          <div class="col-lg-3">
            <base-input
              type="text"
              label="Hourly rate"
              placeholder="Hourly rate"
              v-model="clientUser.hourly_rate"
            >
            </base-input>
          </div>
        </div>
      </div>
    </form>
  </card>
</template>
<script>
import { mapActions } from "vuex";
import { Select, Option } from "element-ui";
export default {
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  data() {
    return {
      saving: false,
      saving2: false,
      loading: false,
      success: false,
      user: {},
      clientUser: {},
      staffUser: {},
      error: "",
      user: {
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        designation_category: "",
        company_category: ""
      },
      designationOptions: [
        { value: "staff", label: "Staff" },
        { value: "new_client", label: "New client" },
        { value: "current_client", label: "Current client" },
        { value: "affiliate_partner", label: "Affiliate Partner" }
      ],
      companyOptions: [
        { value: "call_me_ph", label: "CallMe.Com.Ph" },
        { value: "psalms_global", label: "PsalmsGlobal.Com" },
        {
          value: "call_me_psalms_global",
          label: "CallMe.Com.Ph/PsalmsGlobal.Com"
        }
      ]
    };
  },
  methods: {
    updateProfile() {
      alert("Your data: " + JSON.stringify(this.user));
    },
    ...mapActions("user", ["updateClientUser", "saveMe"]),
    async fetchClient(id) {
      this.loading = true;
      let endpoint = `/api/auth/client/${id}/`;
      try {
        await this.$axios.get(endpoint).then(res => {
          this.clientUser = res.data;
          this.loading = false;
        });
      } catch (err) {
        console.log(err.response.data);
        UIkit.notification("Error: Client data " + err.response.data.detail, {
          status: "danger"
        });
      }
    },
    async fetchStaff(id) {
      this.loading = true;
      let endpoint = `/api/auth/staff/${id}`;
      try {
        await this.$axios.get(endpoint).then(res => {
          this.staffUser = res.data;
          this.loading = false;
        });
      } catch (err) {
        this.loading = false;
        UIkit.notification("Error: Staff data " + err.response.data.detail, {
          status: "danger"
        });
      }
    },
    async fetchMe() {
      this.loading = true;
      try {
        let endpoint = `api/auth/users/me/`;
        await this.$axios.get(endpoint).then(res => {
          this.user = res.data;
          this.loading = false;
          console.log(this.user);
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
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully updated Client information!", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
    },
    async save() {
      this.saving2 = true;
      const payload = {
        username: this.user.username,
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        phone: this.user.phone
      };
      await this.updateClientUser(payload)
        .then(() => {
          this.saving2 = false;
          this.success2 = true;
          this.successMessage("success");
        })
        .catch(err => {
          this.success2 = false;
          this.error = err.response.data;
          this.errorMessage(error);
          console.log(err.response.data);
        });
    },
    async saveUser() {
      const clientPayload = {
        id: this.clientUser.id,
        client: this.user.id,
        client_code: this.clientUser.client_code,
        affiliate_partner_code: this.clientUser.affiliate_partner_code,
        affiliate_partner_name: this.clientUser.affiliate_partner_name,
        pin: this.clientUser.pin,
        lead_information: this.clientUser.lead_information,
        customer_id: this.clientUser.customer_id
      };
      this.saving = true;
      let url = `/api/auth/client/${this.user.id}/`;
      if (this.clientUser) {
        return await this.$axios
          .put(url, clientPayload)
          .then(res => {
            this.saving = false;
            this.success = true;
            this.successMessage();
            return res.data;
          })
          .catch(err => {
            this.saving = false;
            console.log(err);
          });
      }
    },
    async saveClient() {
      const clientPayload = {
        id: this.clientUser.id,
        client: this.user.id,
        client_code: this.clientUser.client_code,
        email: this.clientUser.email,
        affiliate_partner_code: this.clientUser.affiliate_partner_code,
        affiliate_partner_name: this.clientUser.affiliate_partner_name,
        pin: this.clientUser.pin,
        lead_information: this.clientUser.lead_information,
        customer_id: this.clientUser.customer_id,
        hourly_rate: this.clientUser.hourly_rate
      };
      this.saving2 = true;
      let url = `/api/auth/client/${this.user.id}/`;
      if (this.clientUser) {
        return await this.$axios
          .put(url, clientPayload)
          .then(res => {
            this.saving2 = false;
            this.success = true;
            this.successMessage("success");
            return res.data;
          })
          .catch(err => {
            this.saving2 = false;
            console.log(err);
            this.errorClientMessage("danger", err.response.data);
          });
      }
    },
    addInternalFiles(e) {
      e.preventDefault();
      this.clientUser.client_files.push({
        file_name: "",
        url: "",
        description: ""
      });
    },
    removeInternalFiles(e, id) {
      e.preventDefault();
      var index = this.clientUser.client_files
        .map(function(item) {
          console.log(item.id);
          return item.id;
        })
        .indexOf(id);
      this.clientUser.client_files.splice(index, 1);
    },
    addRow: function() {
      this.clientUser.client_files.push({
        file_name: "",
        url: "",
        description: ""
      });
    },
    deleteRow: function(e, item) {
      e.preventDefault();
      var index = this.clientUser.client_files
        .map(function(item) {
          console.log(item.id);
          return item.id;
        })
        .indexOf(item);
      this.clientUser.client_files.splice(index, 1);
    },
    errorClientMessage(variant = null, error) {
      this.$bvToast.toast(
        error.client
          ? "Client: " + error.client
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
    errorMessage(error) {
      if (error.email) {
        return "Email: " + this.error.email;
      } else if (error.username) {
        return "Username: " + this.error.username;
      } else if (error.detail) {
        return "Detail: " + this.error.detail;
      } else if (error.non_field_errors) {
        return this.error.non_field_errors;
      }
    }
  },
  mounted() {
    this.fetchMe();
  }
};
</script>
<style></style>

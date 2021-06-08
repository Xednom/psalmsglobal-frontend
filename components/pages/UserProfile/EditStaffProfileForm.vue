<template>
  <card>
    <div slot="header" class="row align-items-center">
      <div class="col-8">
        <h3 class="mb-0">Edit profile</h3>
      </div>
      <div class="col-4 text-right">
        <base-button type="info" @click="saveUser">Save</base-button>
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
      <h6 class="heading-small text-muted mb-4">Staff information</h6>

      <div class="pl-lg-4">
        <div class="row">
          <div class="col-md-3">
            <base-input label="Date picker">
              <flat-picker
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true }"
                class="form-control datepicker"
                v-model="staff.date_of_birth"
              >
              </flat-picker>
            </base-input>
          </div>

          <div class="col-lg-3">
            <base-input
              type="text"
              label="Blood Type"
              placeholder="Blood type"
              v-model="staff.blood_type"
            >
            </base-input>
          </div>
          <div class="col-lg-3">
            <base-input
              type="text"
              label="Position"
              placeholder="Position"
              v-model="staff.position"
            >
            </base-input>
          </div>
          <div class="col-lg-3">
            <base-input
              label="Phone number"
              placeholder="Phone number"
              v-model="staff.phone_number"
            >
            </base-input>
          </div>
        </div>
      </div>

      <div class="pl-lg-4">
        <div class="row">
          <div class="col-lg-4">
            <base-input
              type="text"
              name="Company Email"
              label="Company Email"
              :rules="{ email: true }"
              placeholder="Company Email"
              v-model="staff.company_email"
            >
            </base-input>
          </div>
          <div class="col-lg-4">
            <base-input label="Start date hired">
              <flat-picker
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true }"
                class="form-control datepicker"
                v-model="staff.start_date_hired"
              >
              </flat-picker>
            </base-input>
          </div>
          <div class="col-lg-4">
            <base-input label="Date hired in contract">
              <flat-picker
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true }"
                class="form-control datepicker"
                v-model="staff.date_hired_in_contract"
              >
              </flat-picker>
            </base-input>
          </div>
        </div>
      </div>
      <div class="pl-lg-4">
        <div class="row">
          <div class="col-lg-3">
            <base-input
              type="text"
              label="Base pay"
              placeholder="Base pay"
              v-model="staff.base_pay"
            >
            </base-input>
          </div>

          <div class="col-lg-3">
            <base-input
              type="text"
              label="Hourly rate"
              placeholder="Hourly rate"
              v-model="staff.hourly_rate"
            >
            </base-input>
          </div>

          <div class="col-lg-3">
            <base-input label="Status">
              <el-select
                v-model="staff.status"
                filterable
                placeholder="Status"
                disabled
              >
                <el-option
                  v-for="option in stautsOptions"
                  :key="option.label"
                  :label="option.label"
                  :value="option.value"
                >
                </el-option>
              </el-select>
            </base-input>
          </div>

          <div class="col-lg-3">
            <base-input label="Category">
              <el-select
                v-model="staff.category"
                filterable
                placeholder="Category"
                disabled
              >
                <el-option
                  v-for="option in categoryOptions"
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
      <div class="pl-lg-4">
        <div class="row">
          <div class="col-lg-3">
            <base-input
              type="text"
              label="Company ID"
              placeholder="Company ID"
              v-model="staff.company_id"
              disabled
            >
            </base-input>
          </div>
          <div class="col-lg-3">
            <base-input
              type="text"
              label="Staff ID"
              placeholder="Staff ID"
              v-model="staff.staff_id"
              disabled
            >
            </base-input>
          </div>
        </div>
      </div>
      <hr class="my-4" />
      <h6 class="heading-small text-muted mb-4">Government information</h6>
      <div class="pl-lg-4">
        <div class="row">
          <div class="col-lg-3">
            <base-input
              type="text"
              label="TIN Number"
              placeholder="TIN Number"
              v-model="staff.tin_number"
            >
            </base-input>
          </div>
          <div class="col-lg-3">
            <base-input
              type="text"
              label="SSS number"
              placeholder="SSS number"
              v-model="staff.sss_number"
            >
            </base-input>
          </div>

          <div class="col-lg-3">
            <base-input
              type="text"
              label="PAG-IBIG number"
              placeholder="PAG-IBIG number"
              v-model="staff.pag_ibig_number"
            >
            </base-input>
          </div>

          <div class="col-lg-3">
            <base-input
              type="text"
              label="Phil health number"
              placeholder="Phil health number"
              v-model="staff.phil_health_number"
            >
            </base-input>
          </div>
        </div>
      </div>
      <hr class="my-4" />
      <h6 class="heading-small text-muted mb-4">Emergency information</h6>
      <div class="pl-lg-4">
        <div class="row">
          <div class="col-lg-4">
            <base-input
              type="text"
              label="Emergency contact full name"
              placeholder="Emergency contact full name"
              v-model="staff.emergency_contact_full_name"
            >
            </base-input>
          </div>
          <div class="col-lg-4">
            <base-input
              type="text"
              label="Relationship"
              placeholder="Relationship"
              v-model="staff.relationship"
            >
            </base-input>
          </div>

          <div class="col-lg-4">
            <base-input
              type="text"
              label="Emergency contact number"
              placeholder="Emergency contact number"
              v-model="staff.emergency_contact_number"
            >
            </base-input>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-4">
            <base-input
              type="text"
              label="Mother's full name"
              placeholder="Mother's full name"
              v-model="staff.mothers_full_name"
            >
            </base-input>
          </div>
          <div class="col-lg-4">
            <base-input
              type="text"
              label="Mother's maiden name"
              placeholder="Mother's maiden name"
              v-model="staff.mothers_maiden_name"
            >
            </base-input>
          </div>

          <div class="col-lg-4">
            <base-input
              type="text"
              label="Father's full name"
              placeholder="Father's full name"
              v-model="staff.fathers_full_name"
            >
            </base-input>
          </div>
        </div>
      </div>
      <hr class="my-4" />
      <h6 class="heading-small text-muted mb-4">Payroll information</h6>
      <div class="pl-lg-4">
        <div class="row">
          <div class="col-lg-3">
            <base-input
              type="text"
              label="Bank name"
              placeholder="Bank name"
              v-model="staff.bank_name"
            >
            </base-input>
          </div>
          <div class="col-lg-3">
            <base-input
              type="text"
              label="Bank account name"
              placeholder="Bank account name"
              v-model="staff.bank_account_name"
            >
            </base-input>
          </div>

          <div class="col-lg-3">
            <base-input
              type="text"
              label="Bank Type"
              placeholder="Bank Type"
              v-model="staff.bank_type"
            >
            </base-input>
          </div>

          <div class="col-lg-3">
            <base-input
              type="text"
              label="Bank account number"
              placeholder="Bank account number"
              v-model="staff.bank_account_number"
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
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

export default {
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    flatPicker
  },
  data() {
    return {
      saving: false,
      saving2: false,
      loading: false,
      success: false,
      user: {},
      clientUser: {},
      staff: {},
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
      ],
      statusOptions: [
        { value: "regular", label: "Regular" },
        { value: "probitionary", label: "Probitionary" },
        { value: "inactive", label: "Inactive" }
      ],
      categoryOptions: [
        { value: "office_based", label: "Office Based" },
        { value: "part_timers", label: "Part-timers" },
        { value: "home_based", label: "Home Based" }
      ]
    };
  },
  methods: {
    updateProfile() {
      alert("Your data: " + JSON.stringify(this.user));
    },
    ...mapActions("user", ["updateClientUser", "saveMe"]),
    async fetchStaff(id) {
      this.loading = true;
      let endpoint = `/api/auth/staff/${id}`;
      try {
        await this.$axios.get(endpoint).then(res => {
          this.staff = res.data;
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
      this.$bvToast.toast("Successfully updated Staff information!", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
    },
    async saveUser() {
      const staffPayload = {
        id: this.staff.id,
        date_of_birth: this.staff.date_of_birth,
        blood_type: this.staff.blood_type,
        position: this.staff.position,
        phone_number: this.staff.phone_number,
        company_email: this.staff.company_email,
        start_date_hired: this.staff.start_date_hired,
        date_hired_in_contract: this.staff.date_hired_in_contract,
        base_pay: this.staff.base_pay,
        hourly_rate: this.staff.hourly_rate,
        status: this.staff.status,
        category: this.staff.category,
        residential_address: this.staff.residential_address,
        tin_number: this.staff.tin_number,
        sss_number: this.staff.sss_number,
        pag_ibig_number: this.staff.pag_ibig_number,
        emergency_contact_full_name: this.staff.emergency_contact_full_name,
        relationship: this.staff.relationship,
        emergency_contact_number: this.staff.emergency_contact_number,
        mothers_full_name: this.staff.mothers_full_name,
        mothers_maiden_name: this.staff.mothers_maiden_name,
        fathers_full_name: this.staff.fathers_full_name,
        phil_health_number: this.staff.phil_health_number,
        bank_name: this.staff.bank_name,
        bank_account_name: this.staff.bank_account_name,
        bank_type: this.staff.bank_type,
        bank_account_number: this.staff.bank_account_number
      };
      this.saving = true;
      let url = `/api/auth/staff/${this.user.id}/`;
      if (this.staff) {
        return await this.$axios
          .put(url, staffPayload)
          .then(res => {
            this.saving = false;
            this.success = true;
            this.successMessage('success');
            return res.data;
          })
          .catch(err => {
            this.saving = false;
            console.log(err);
          });
      }
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

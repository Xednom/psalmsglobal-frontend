<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-success py-7 py-lg-8 pt-lg-9">
      <div class="separator separator-bottom separator-skew zindex-100"></div>
    </div>
    <!-- Page content -->
    <div class="container mt--8 pb-5">
      <!-- Table -->
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8">
          <div class="card bg-secondary border-0">
            <div class="card-body px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
                <small>Sign up with your Client credentials.</small>
              </div>
              <validation-observer
                v-slot="{ handleSubmit }"
                ref="formValidator"
              >
                <form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-hat-3"
                    placeholder="First name"
                    name="First name"
                    :rules="{ required: true }"
                    v-model="register.first_name"
                  >
                  </base-input>

                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-hat-3"
                    placeholder="Last name"
                    name="Last name"
                    :rules="{ required: true }"
                    v-model="register.last_name"
                  >
                  </base-input>

                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-user-run"
                    placeholder="Username"
                    name="Username"
                    :rules="{ required: true }"
                    v-model="register.username"
                  >
                  </base-input>

                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-email-83"
                    placeholder="Email"
                    name="Email"
                    :rules="{ required: true, email: true }"
                    v-model="register.email"
                  >
                  </base-input>

                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-lock-circle-open"
                    placeholder="password"
                    type="password"
                    name="Password"
                    :rules="{ required: true, min: 8 }"
                    v-model="register.password"
                  >
                  </base-input>
                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-lock-circle-open"
                    placeholder="Confirm Password"
                    type="password"
                    name="Confirm Password"
                    :rules="{ required: true, min: 8 }"
                    v-model="register.re_password"
                  >
                  </base-input>

                  <base-input label="Designation Category" name="Designation Category" :rules="{ required: true }">
                    <el-select
                      v-model="register.designation_category"
                      filterable
                      placeholder="Designation Category"
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

                  <base-input label="Company Category" name="Company Category" :rules="{ required: true }">
                    <el-select
                      v-model="register.company_category"
                      filterable
                      placeholder="Company Category"
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

                  <base-input label="Account type" name="Account Type" :rules="{ required: true }">
                    <el-select
                      v-model="register.account_type"
                      filterable
                      placeholder="Account type"
                    >
                      <el-option
                        v-for="option in accountOptions"
                        :key="option.label"
                        :label="option.label"
                        :value="option.value"
                      >
                      </el-option>
                    </el-select>
                  </base-input>
                  <div class="text-center">
                    <base-button
                      type="info"
                      native-type="submit"
                      loading
                      v-if="saving"
                      >Creating</base-button
                    >
                    <base-button type="primary" native-type="submit" v-else
                      >Create account</base-button
                    >
                  </div>
                </form>
              </validation-observer>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6">
          <router-link to="/login" class="text-dark"
            ><small>Back to login page</small></router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Select, Option } from "element-ui";

export default {
  auth: false,
  layout: "AuthLayout",
  name: "register_client",
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  data() {
    return {
      saving: false,
      register: {
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        designation_category: "",
        company_category: "",
        account_type: ""
      },
      designationOptions: [
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
      accountOptions: [
        { value: "postpaid", label: "Postpaid" },
        { value: "prepaid", label: "Prepaid" }
      ],
      selects: {
        designation: ""
      },
      selects: {
        company: ""
      }
    };
  },
  methods: {
    async onSubmit() {
      this.saving = true;
      await this.$axios
        .post(`api/auth/users/`, this.register)
        .then(async res => {
          this.saving = false;
          // instead of showing a success page, we should automatically login the user.
          await this.$auth
            .loginWith("local", {
              data: this.register
            })
            .then(res => {
              this.$router.push("/");
            });
        })
        .catch(e => {
          this.saving = false;
          this.error = e.response.data;
          this.errorMessage("danger", this.error);
        });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.password
          ? "Password: " + error.password
          : error.username
          ? "Username: " + error.username
          : error.detail
          ? "Detail: " + error.detail
          : error.email
          ? "Email: " + error.email
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
<style></style>

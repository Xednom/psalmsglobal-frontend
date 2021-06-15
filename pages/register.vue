<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-success py-7 py-lg-8 pt-lg-9">
      <div class="separator separator-bottom separator-skew zindex-100">
      </div>
    </div>
    <!-- Page content -->
    <div class="container mt--8 pb-5">
      <!-- Table -->
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8">
          <div class="card bg-secondary border-0">
            <div class="card-body px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
                <small>Sign up with credentials</small>
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
                    :rules="{ required: true}"
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
                    :rules="{ required: true, min: 6 }"
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
                    :rules="{ required: true, min: 6 }"
                    v-model="register.re_password"
                  >
                  </base-input>

                  <base-input label="Designation Category">
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

                  <base-input label="Company Category">
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
                  <div class="text-center">
                    <button type="submit" class="btn btn-primary mt-4">
                      Create account
                    </button>
                  </div>
                </form>
              </validation-observer>
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
    </div>
  </div>
</template>
<script>
import { Select, Option } from "element-ui";

export default {
  auth: false,
  layout: "AuthLayout",
  name: "register",
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  data() {
    return {
      register: {
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
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
      selects: {
        designation: "",
      },
      selects: {
        company: "",
      }
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      await this.$axios
        .post(`api/auth/users/`, this.register)
        .then(async res => {
          this.loading = false;
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
          this.loading = false;
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
          solid: true,
        }
      );
    },
  }
};
</script>
<style></style>

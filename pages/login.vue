<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-success py-7 py-lg-8 pt-lg-9">
      <div class="separator separator-bottom separator-skew zindex-100">
        
      </div>
    </div>
    <!-- Page content -->
    <div class="container mt--8 pb-5">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="card bg-lighter border-0 mb-0">
            <div class="card-body px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
                <small>Sign in with credentials</small>
              </div>
              <validation-observer
                v-slot="{ handleSubmit }"
                ref="formValidator"
              >
                <form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input
                    alternative
                    class="mb-3"
                    name="Username"
                    :rules="{ required: true }"
                    prepend-icon="ni ni-user-run"
                    placeholder="Username"
                    v-model="loginData.username"
                  >
                  </base-input>

                  <base-input
                    alternative
                    class="mb-3"
                    name="Password"
                    :rules="{ required: true, min: 6 }"
                    prepend-icon="ni ni-lock-circle-open"
                    type="password"
                    placeholder="Password"
                    v-model="loginData.password"
                  >
                  </base-input>
                  
                  <div class="text-center">
                    <base-button
                      type="primary"
                      native-type="submit"
                      class="my-4"
                      >Sign in</base-button
                    >
                  </div>
                </form>
              </validation-observer>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-6">
              <router-link to="/forgot-password" class="text-dark"
                ><small>Forgot password?</small></router-link
              >
            </div>
            <div class="col-6 text-right">
              <router-link to="/register" class="text-dark"
                ><small>Create new account</small></router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'AuthLayout',
  data() {
    return {
      loginData: {
        username: '',
        password: '',
        rememberMe: false
      }
    };
  },
  methods: {
    async onSubmit() {
      // this will be called only after form is valid. You can do api call here to login
      this.loading = true;
      this.authError = {};
      var data = {
        username: this.loginData.username,
        password: this.loginData.password,
      };
      await this.$auth
        .loginWith("local", {
          data: data,
        })
        .then((res) => {
          this.loading = false;
          this.$router.push("/");
        })
        .catch((err) => {
          this.loading = false;
          this.error = err.response.data;
          this.errorMessage('danger', this.error);
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


<style lang="scss">
.bg-gradient-success {
  background: linear-gradient(87deg,#2309fb,#e60a0a) !important;
}
.bg-default {
  background: #ffffff !important;
}
</style>
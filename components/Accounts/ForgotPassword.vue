<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-success py-7 py-lg-8 pt-lg-9">
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg
          x="0"
          y="0"
          viewBox="0 0 2560 100"
          preserveAspectRatio="none"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            class="fill-default"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
    </div>
    <!-- Page content -->
    <div class="container mt--8 pb-5">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="card bg-secondary border-0 mb-0">
            <div class="card-body px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
                <small
                  >Put your email address so that we can send you a forgot
                  password process.</small
                >
              </div>
              <validation-observer
                v-slot="{ handleSubmit }"
                ref="formValidator"
              >
                <form
                  role="form"
                  @submit.prevent="handleSubmit(forgotPassword)"
                >
                  <base-input
                    alternative
                    class="mb-3"
                    name="Email"
                    :rules="{ required: true, email: true }"
                    prepend-icon="ni ni-email-83"
                    placeholder="Email address"
                    v-model="email"
                  >
                  </base-input>
                  <div class="text-center">
                    <base-button
                      type="primary"
                      native-type="submit"
                      class="my-4"
                      >Send</base-button
                    >
                  </div>
                </form>
              </validation-observer>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-6">
              <router-link to="/login" class="text-light"
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
export default {
  layout: "AuthLayout",
  data() {
    return {
      loading: false,
      email: "",
      error: ""
    };
  },
  methods: {
    async forgotPassword() {
      this.loading = true;
      await this.$axios
        .post(`/api/auth/users/reset_password/`, {
          email: this.email
        })
        .then(res => {
          this.success = true;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.success = false;
          this.errorMessage(err.response.data);
          console.log(err.response.data);
        });
    },
    errorMessage(error) {
      if (error.password) {
        return "Password: " + this.error.password;
      } else if (error.username) {
        return "Username: " + this.error.username;
      } else if (error.detail) {
        return "Detail: " + this.error.detail;
      } else if (error.non_field_errors) {
        return this.error.non_field_errors;
      }
    }
  }
};
</script>

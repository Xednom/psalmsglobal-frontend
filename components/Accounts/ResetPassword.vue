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
                <small>Reset password</small>
              </div>
              <validation-observer
                v-slot="{ handleSubmit }"
                ref="formValidator"
              >
                <form role="form" @submit.prevent="handleSubmit(resetPassword)">
                  <base-input
                    alternative
                    class="mb-3"
                    name="New password"
                    :rules="{ required: true }"
                    type="password"
                    prepend-icon="ni ni-email-83"
                    placeholder="New password"
                    v-model="new_password"
                  >
                  </base-input>
                  <div class="text-center">
                    <base-button
                      type="primary"
                      native-type="submit"
                      class="my-4"
                      loading
                      v-if="loading"
                      >Changing...</base-button
                    >
                    <base-button
                      type="primary"
                      native-type="submit"
                      class="my-4"
                      v-else
                      >Change</base-button
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
      new_password: "",
      error: ""
    };
  },
  methods: {
    async resetPassword() {
      this.loading = true;
      let confirmation = {
        uid: this.$route.params.uid,
        token: this.$route.params.token,
        new_password: this.new_password
      };
      await this.$axios
        .post(`/api/auth/users/reset_password_confirm/`, confirmation)
        .then(res => {
          this.success = true;
          this.loading = false;
          this.$router.push("/users/reset_password_confirm/success");
        })
        .catch(err => {
          this.loading = false;
          this.success = false;
          this.errorMessage("danger", err.response.data);
          console.log(err.response.data);
        });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.password
          ? "Password: " + error.password
          : error.token
          ? "Token: " + error.token
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

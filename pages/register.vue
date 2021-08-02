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
                <small>Please choose what kind of user you are.</small>
              </div>
              <div class="container">
                <div class="card">
                  <div class="card-body">
                    <div class="row row-example">
                      <div class="col">
                        <nuxt-link to="/staff-registration"
                          ><base-button class="col-md-12" type="default"
                            >Staff</base-button
                          >
                        </nuxt-link>
                      </div>
                      <div class="col">
                        <nuxt-link to="/client-registration">
                          <base-button class="col-md-12" type="primary"
                            >Client</base-button
                          ></nuxt-link
                        >
                      </div>
                    </div>
                  </div>
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
    return {};
  },
  methods: {}
};
</script>
<style></style>

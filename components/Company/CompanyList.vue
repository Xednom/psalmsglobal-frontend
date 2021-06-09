<template>
  <div class="row">
    <div
      class="col-xl-3 col-md-6"
      v-for="company in companies"
      :key="company.id"
    >
      <stats-card
        :title="company.company_owner_name"
        type="gradient-blue"
        :subTitle="company.company_name"
        icon="ni ni-building"
        @click="modals.form = true"
      >
        <template slot="footer">
          <span class="text-nowrap">{{ company.company_email }}</span> <br />
          <span class="text-nowrap">{{ company.company_phone }}</span> <br />
          <span class="company-info"
            ><base-button
              type="default"
              @click="modals.form = true"
              >Info</base-button
            ></span
          >
        </template>
      </stats-card>
    </div>
    <!--Form modal-->
    <modal :show.sync="modals.form" size="sm" body-classes="p-0">
        <h6 slot="header" class="modal-title">Company information</h6>
      <card
        type="secondary"
        header-classes="bg-transparent pb-5"
        body-classes="px-lg-5 py-lg-5"
        class="border-0 mb-0"
      >

        <template>
          <div class="text-center text-muted mb-4">
            <small></small>
          </div>
          <form role="form">
            <base-input
              alternative
              class="mb-3"
              placeholder="Email"
              prepend-icon="ni ni-email-83"
            >
            </base-input>
            <base-input
              alternative
              type="password"
              placeholder="Password"
              prepend-icon="ni ni-lock-circle-open"
            >
            </base-input>
            <div class="text-center">
              <base-button type="primary" class="my-4">Sign In</base-button>
            </div>
          </form>
        </template>
      </card>
    </modal>
  </div>
</template>

<script>
import StatsCard from "@/components/argon-core/Cards/StatsCard";
import { mapGetters } from "vuex";

export default {
  name: "company_list",
  components: {
    StatsCard
  },
  computed: {
    ...mapGetters({
      companies: "company/companies",
      company: "company/company",
      pagination: "company/companiesPagination",
      user: "user/user",
      client: "user/clientUser"
    })
  },
  data() {
    return {
      isBusy: false,
      modals: {
        form: false
      }
    };
  },
  methods: {
    async fetchCompanies() {
      this.isBusy = true;
      await this.$store
        .dispatch("company/fetchCompanies", this.pagination)
        .then(() => {
          this.isBusy = false;
        });
    }
  },
  mounted() {
    this.fetchCompanies();
  }
};
</script>

<style scoped>
.company-info {
    float: right;
}
</style>
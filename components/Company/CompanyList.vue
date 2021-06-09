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
              @click="
                {
                  (modals.form = true), fetchCompany(company.id);
                }
              "
              >Info</base-button
            ></span
          >
        </template>
      </stats-card>
    </div>
    <!--Form modal-->
    <modal :show.sync="modals.form" size="lg" body-classes="p-0">
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
          <form role="form" @submit.prevent="save">
            <div class="row">
              <div class="col-md-6">
                <base-input
                  alternative
                  class="mb-3"
                  placeholder="Company owner names"
                  prepend-icon="ni ni-user-run"
                  v-model="company.company_owner_name"
                >
                </base-input>
              </div>

              <div class="col-md-6">
                <base-input
                  alternative
                  placeholder="Company name"
                  prepend-icon="ni ni-badge"
                  v-model="company.company_name"
                >
                </base-input>
              </div>
              <div class="col-md-6">
                <base-input
                  alternative
                  placeholder="Business type"
                  prepend-icon="ni ni-ungroup"
                  v-model="company.business_type"
                >
                </base-input>
              </div>

              <div class="col-md-6">
                <base-input
                  alternative
                  placeholder="Company phone"
                  prepend-icon="ni ni-mobile-button"
                  v-model="company.company_phone"
                >
                </base-input>
              </div>
              <div class="col-md-6">
                <base-input
                  alternative
                  placeholder="Company email"
                  prepend-icon="ni ni-email-83"
                  v-model="company.company_email"
                >
                </base-input>
              </div>
              <div class="col-md-6">
                <base-input
                  alternative
                  placeholder="Company forwarding email"
                  prepend-icon="ni ni-email-83"
                  v-model="company.company_forwarding_email"
                >
                </base-input>
              </div>
              <div class="col-md-6">
                <base-input
                  alternative
                  placeholder="Paypal email"
                  prepend-icon="ni ni-email-83"
                  v-model="company.paypal_email"
                >
                </base-input>
              </div>
              <div class="col-md-12">
                <base-input label="Company complete address">
                  <textarea
                    class="form-control"
                    id="companyCompleteAddress"
                    rows="3"
                    v-model="company.company_complete_address"
                  ></textarea>
                </base-input>
              </div>
              <div class="col-md-12">
                <base-input label="Notes">
                  <textarea
                    class="form-control"
                    id="notes"
                    rows="3"
                    v-model="company.notes"
                  ></textarea>
                </base-input>
              </div>
            </div>

            <div class="text-center">
              <base-button type="info" native-type="submit" class="my-4"
                >Update</base-button
              >
            </div>
          </form>
        </template>
      </card>
    </modal>
  </div>
</template>

<script>
import StatsCard from "@/components/argon-core/Cards/StatsCard";
import { mapGetters, mapActions } from "vuex";

import CreateCompanyMixin from "@/mixins/CreateCompanyMixin.js";

export default {
  name: "company_list",
  mixins: [CreateCompanyMixin],
  components: {
    StatsCard
  },
  computed: {
    ...mapGetters({
      companies: "company/companies",
      pagination: "company/companiesPagination",
      user: "user/user",
      client: "user/clientUser"
    })
  },
  data() {
    return {
      company: {},
      isBusy: false,
      saving: false,
      modals: {
        form: false
      }
    };
  },
  methods: {
    ...mapActions("company", ["updateCompany"]),
    async fetchCompanies() {
      this.isBusy = true;
      await this.$store
        .dispatch("company/fetchCompanies", this.pagination)
        .then(() => {
          this.isBusy = false;
        });
    },
    async fetchCompany(id) {
      let endpoint = `/api/v1/company/${id}`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.company = res.data;
          console.log(this.company);
        })
        .catch(e => {
          throw e;
        });
    },
    async save() {
      const companyPayload = {
        id: this.company.id,
        company_name: this.company.company_name,
        company_owner_name: this.company.company_owner_name,
        business_type: this.company.business_type,
        company_phone: this.company.company_phone,
        company_email: this.company.company_email,
        company_complete_address: this.company.company_complete_address,
        company_forwarding_email: this.company.company_forwarding_email,
        paypal_email: this.company.paypal_email,
        notes: this.company.notes
      };

      if (
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        try {
          this.saving = true;
          await this.updateCompany(companyPayload)
            .then(() => {
              this.saving = false;
              this.successMessage("success");
            })
            .catch(e => {
              this.saving = false;
              this.error = e.response.data;
              this.errorMessage("danger", this.error);
            });
        } catch (e) {
          this.saving = false;
          this.error = e.response.data;
          this.errorMessage("danger", this.error);
        }
      }
      this.saving = false;
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully updated the Company information!", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.client
          ? "Client: " + error.client
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

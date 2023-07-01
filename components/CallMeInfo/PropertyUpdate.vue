<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <div slot="header" class="row align-items-center mt-7 mb-3">
        <div class="col-8">
          <h3 class="mb-0">
            Property Info - {{ property.apn }} with Reference #{{
              property.reference_number
            }}
          </h3>
        </div>
        <div class="col-4 text-right">
          <nuxt-link to="/property-info/">
            <base-button type="danger"
              >Return to Property info list</base-button
            ></nuxt-link
          >
        </div>
      </div>
      <b-tabs content-class="mt-3">
        <!-- This tabs content will always be mounted -->
        <b-tab title="Disposition Property Info">
          <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
            <form @submit.prevent="handleSubmit(save)">
              <div class="pl-lg-12">
                <div class="row">
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Apn"
                      placeholder="Apn"
                      name="Apn"
                      v-model="apn"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Full name"
                      placeholder="Full name"
                      name="Full name"
                      v-model="full_name"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Company Name"
                      name="Company Name"
                      v-model="company_name"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Reference number"
                      name="Reference number"
                      v-model="reference_number"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="County"
                      name="County"
                      v-model="county"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="State"
                      name="State"
                      v-model="state"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Size"
                      name="Size"
                      v-model="size"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <base-input label="Address">
                      <textarea
                        class="form-control"
                        id="notes"
                        rows="3"
                        v-model="address"
                      ></textarea>
                    </base-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Price"
                      name="Price"
                      v-model="price"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Due diligence"
                      name="Due diligence"
                      v-model="due_diligence"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Ad Content"
                      name="Ad Content"
                      v-model="ad_content"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Images"
                      name="Images"
                      v-model="images"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Website"
                      name="Website"
                      v-model="website"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Facebook"
                      name="Facebook"
                      v-model="facebook"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="FB groups"
                      name="FB groups"
                      v-model="fb_groups"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Landmodo"
                      name="Landmodo"
                      v-model="landmodo"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="FSBO"
                      name="FSBO"
                      v-model="fsbo"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Instagram"
                      name="Instagram"
                      v-model="instagram"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Land Listing"
                      name="Land Listing"
                      v-model="land_listing"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Land Flip"
                      name="Land Flip"
                      v-model="land_flip"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Land hub"
                      name="Land hub"
                      v-model="land_hub"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Land Century"
                      name="Land Century"
                      v-model="land_century"
                      rules="required"
                      @input="setProperty"
                    >
                    </base-input>
                  </div>
                </div>
                <action-buttons
                  :item="item"
                  :saving="saving"
                  @save="save"
                ></action-buttons>
              </div>
            </form>
          </validation-observer>
        </b-tab>

        <b-tab title="Agent Comment section">
          <comment-section
            :item="item"
            :fetch="refresh"
            type-of-comment="agent"
          ></comment-section>
        </b-tab>
        <b-tab title="Client Comment section">
          <comment-section
            :item="item"
            :fetch="refresh"
            type-of-comment="client"
          ></comment-section>
        </b-tab>
        <b-tab title="Customer Comment section">
          <comment-section
            :item="item"
            :fetch="refresh"
            type-of-comment="customer"
          ></comment-section>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>
  
  <script>
import { Select, Option } from "element-ui";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

import PropertyInfoMixin from "@/mixins/PropertyInfoMixin.js";

import CommentSection from "@/components/CallMeInfo/CallMeInfoCommentSection.vue";

import ActionButtons from "@/components/FormPage/ActionButtons.vue";

export default {
  name: "PropertyInfoUpdate",
  mixins: [PropertyInfoMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    CommentSection,
    ActionButtons,
  },
  props: {
    refresh: {
      Type: Function,
      description: "Refresh the list data",
    },
    accountType: {
      Type: String,
      description: "Account type",
    },
  },
  data() {
    return {
      query: "",
      companies: [],
      user: {},
      selectedCompany: null,
      isBusy: false,
      saving: false,
      modals: {
        form: false,
      },
      attribute_forms: [],
      dataTypeOptions: [
        { value: "text", label: "Text" },
        { value: "question", label: "Question" },
      ],
      StatusChoices: {
        placeholder: "",
        status: [
          { value: "na", label: "N/A" },
          { value: "job_order_request", label: "Job order request" },
          { value: "va_processing", label: "VA Processing" },
          { value: "management_processing", label: "Management Processing" },
          { value: "verified_job_order", label: "Verified Job Order" },
          { value: "on_hold", label: "On Hold" },
          { value: "canceled", label: "Canceled" },
          { value: "follow_up", label: "Follow up" },
          { value: "dispute", label: "Dispute" },
          { value: "complete", label: "Complete" },
          { value: "job_closed", label: "Job closed" },
          { value: "under_quality_review", label: "Under Quality Review" },
          { value: "daily_tasks", label: "Daily Tasks" },
          { value: "weekly_tasks", label: "Weekly Tasks" },
          { value: "monthly_tasks", label: "Monthly Tasks" },
          { value: "redo", label: "Redo" },
          { value: "pending", label: "Pending" },
          { value: "duplicate_request", label: "Duplicate Request" },
        ],
      },
    };
  },
  methods: {
    ...mapMutations("callMeInfo", ["updateObject", "setBasicField", "setApn"]),
    ...mapActions("callMeInfo", ["saveCallMeInfo", "fetchCallMeInfo"]),
    onlyNumbers: function () {
      this.property.total_time_consumed = this.job.total_time_consumed.replace(
        /[^0-9.]/g,
        ""
      );
    },
    async fetchClient(id) {
      let endpoint = `/api/auth/client/${id}/`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.clientUser = res.data;
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async fetchStaff(id) {
      let endpoint = `/api/auth/staff/${id}/`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.staffUser = res.data;
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async fetchPropertyInfo(param) {
      this.fetchCallMeInfo(param);
    },
    async save() {
      this.saving = true;
      const payload = {
        id: this.id,
        apn: this.apn,
        full_name: this.full_name,
        company_name: this.company_name,
        reference_number: this.reference_number,
        county: this.county,
        state: this.state,
        size: this.size,
        address: this.address,
        price: this.price,
        due_diligence: this.due_diligence,
        ad_content: this.ad_content,
        images: this.images,
        website: this.website,
        facebook: this.facebook,
        fb_groups: this.fb_groups,
        landmodo: this.landmodo,
        fsbo: this.fsbo,
        instagram: this.instagram,
        land_listing: this.land_listing,
        land_flip: this.land_flip,
        land_hub: this.land_hub,
        land_century: this.land_century,
      };
      try {
        this.saving = true;
        await this.saveCallMeInfo(payload).then(() => {
          this.saving = false;
          this.successMessage("success");
        });
        // this.refresh();
      } catch (e) {
        throw e;
      }
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully updated a Job Order", {
        title: `Successful`,
        variant: variant,
        solid: true,
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.caller_interaction_record
          ? "Caller interaction record: " + error.caller_interaction_record
          : error.client
          ? "Client: " + error.client
          : error.agent
          ? "Agent: " + error.agent
          : error.customer_jobOrder_post_paid
          ? "Customer jobOrder: " + error.customer_jobOrder_post_paid
          : error.detail
          ? "Detail: " + error.detail
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
    async fetchProperty() {
      this.$store.dispatch("callMeInfo/fetchCallMeInfo", this.$route.params);
    },
  },
  computed: {
    ...mapGetters({
      property: "callMeInfo/callMeInfo",
    }),
  },
  mounted() {
    this.fetchProperty();
  },
};
</script>
  
  <style scoped>
.company-info {
  float: right;
}
</style>
  
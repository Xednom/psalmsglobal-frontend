<template>
  <div class="container">
    <div
      class="col-xl-12 col-md-12 col-sm-12"
      v-if="rate == 0 && $auth.user.designation_category != 'staff'"
    >
      <div slot="header" class="row align-items-center">
        <div class="col-8">
          <h3 class="mb-0">Add a rating for this Interaction</h3>
        </div>
      </div>
      <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
        <form @submit.prevent="handleSubmit(save)">
          <div class="pl-lg-4">
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12">
                <label for="rating-md-no-border" class="mt-3">Rating</label>
                <b-form-rating
                  id="rating-md-no-border"
                  v-model="rating"
                  no-border
                  color="#ff8800"
                ></b-form-rating>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 col-sm-12 col-lg-12">
                <base-input label="Comment">
                  <textarea
                    class="form-control"
                    rows="3"
                    v-model="comment"
                  ></textarea>
                </base-input>
              </div>
            </div>
          </div>
          <base-button type="primary" native-type="submit" loading v-if="saving"
            >Submit</base-button
          >
          <base-button type="primary" native-type="submit" v-else
            >Submit</base-button
          >
        </form>
      </validation-observer>
    </div>
    <div
      class="col-xl-12 col-md-12 col-sm-12"
      v-if="rate == 0 && $auth.user.designation_category == 'staff'"
    >
      <div slot="header" class="row align-items-center">
        <div class="col-md-12 col-lg-12">
          <span class="align-items-center">No ratings given.</span>
        </div>
      </div>
    </div>
    <div class="col-xl-12 col-md-12 col-sm-12" v-else>
      <div
        v-for="(rate, index) in interaction.post_paid_interaction_rates"
        :key="index"
      >
        <div class="col-sm-12 col-md-12 col-lg-12">
          <label for="rating-md-no-border" class="mt-3"
            >You rated this interaction with:</label
          >
          <b-form-rating
            id="rating-md-no-border"
            v-model="rate.rating"
            no-border
            color="#ff8800"
            readonly
          ></b-form-rating>
          <base-input label="Comment">
            <textarea
              class="form-control"
              rows="3"
              v-model="rate.comment"
              readonly
            ></textarea>
          </base-input>
        </div>
      </div>
      <div
        v-for="(rate, index) in interaction.prepaid_interaction_rates"
        :key="index"
      >
        <div class="col-sm-12 col-md-12 col-lg-12">
          <label
            for="rating-md-no-border"
            class="mt-3"
            v-if="$auth.user.designation_category != 'staff'"
            >You rated this interaction with:</label
          >
          <label
            for="rating-md-no-border"
            class="mt-3"
            v-else-if="$auth.user.designation_category == 'staff'"
            >This interaction was rated with:</label
          >
          <b-form-rating
            id="rating-md-no-border"
            v-model="rate.rating"
            no-border
            color="#ff8800"
            readonly
          ></b-form-rating>
          <base-input label="Comment">
            <textarea
              class="form-control"
              rows="3"
              v-model="rate.comment"
              readonly
            ></textarea>
          </base-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";
import { mapGetters, mapActions } from "vuex";

import RateMixin from "@/mixins/RateMixin.js";

export default {
  name: "crm_list",
  mixins: [RateMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  computed: {
    ...mapGetters({
      categories: "resolution/resolutionCategory",
      user: "user/user",
      client: "user/company"
    })
  },
  props: {
    interaction: {
      type: Object,
      description: "Data from interaction"
    },
    rate: {
      type: Number
    },
    accountType: {
      type: String
    }
  },
  data() {
    return {
      clientUser: {},
      isBusy: false,
      saving: false,
      modals: {
        form: false
      }
    };
  },
  methods: {
    ...mapActions("interactionRate", [
      "reset",
      "savePostpaidRating",
      "savePrepaidRating"
    ]),
    async fetchClient(id) {
      let endpoint = `/api/auth/client/${id}/`;
      try {
        await this.$axios.get(endpoint).then(res => {
          this.clientUser = res.data;
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async save() {
      if (
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        if (this.accountType == "postpaid") {
          const payload = {
            post_paid: this.interaction.id,
            rating: this.rating,
            comment: this.comment,
            client: this.clientUser.id
          };
          try {
            this.saving = true;
            await this.savePostpaidRating(payload)
              .then(() => {
                this.saving = false;
                this.reset();
                this.$emit("refresh", this.interaction);
                this.$refs.formValidator.reset();
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
        } else if (this.accountType == "prepaid") {
          const payload = {
            prepaid: this.interaction.id,
            rating: this.rating,
            comment: this.comment,
            client: this.clientUser.id
          };
          try {
            this.saving = true;
            await this.savePrepaidRating(payload)
              .then(() => {
                this.saving = false;
                this.reset();
                this.$emit("refresh", this.interaction);
                this.$refs.formValidator.reset();
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
      }
      this.saving = false;
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully added a rating!", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.client
          ? "Company: " + error.client
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
    if (
      this.$auth.user.designation_category == "new_client" ||
      this.$auth.user.designation_category == "current_client" ||
      this.$auth.user.designation_category == "affiliate_partner"
    ) {
      this.fetchClient(this.$auth.user.id);
    }
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

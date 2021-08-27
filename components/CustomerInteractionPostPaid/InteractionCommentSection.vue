<template>
  <div id="comment-section">
    <div class="col-md-12">
      <form @submit.prevent="save">
        <div class="form-row">
          <div class="col-sm-12 col-md-12">
            <textarea
              class="form-control"
              placeholder="Comment"
              v-model="comment"
              :rules="{ required: true }"
            >
            </textarea>
          </div>
        </div>

        <div slot="footer">
          <div class="pull-right mt-3 mb-3">
            <base-button
              v-if="!loading"
              native-type="submit"
              slot="footer"
              type="primary"
              size="sm"
            >
              Post
            </base-button>
            <base-button
              v-else
              native-type="submit"
              slot="footer"
              type="primary"
              size="sm"
              disabled
            >
              Posting...
            </base-button>
          </div>
        </div>
      </form>
      <div class="form-row">
        <base-table
          :data="interaction.customer_interaction_post_paid_comments"
          thead-classes="text-primary"
        >
          <template slot-scope="{ row }">
            <td>
              <blockquote class="blockquote">
                <p class="mb-0 comment-section">
                  {{ row.comment }}
                </p>
                <footer class="blockquote-footer">
                  {{ row.commenter }}
                  commented at <strong>{{ row.created_at }}</strong>
                  
                </footer>
              </blockquote>
            </td>
          </template>
        </base-table>
      </div>
    </div>
  </div>
</template>

<script>
import BaseTable from "~/components/argon-core/BaseTable.vue";

import CreateCustomerInteractionMixin from "@/mixins/CreatePostPaidInteractionMixin.js";

export default {
  components: {
    BaseTable
  },
  mixins: [CreateCustomerInteractionMixin],
  props: {
    interaction: {
      type: Object
    }
  },
  data() {
    return {
      loading: false,
      saving: false,
      error: ""
    };
  },
  computed: {
    comment: {
      get() {
        return this.$store.getters["postPaidCustomerInteraction/comment"];
      },
      set(value) {
        this.setBasicStoreValue("comment", value);
      }
    }
  },
  methods: {
    async refresh(payload) {
      this.loading = true;
      let endpoint = `/api/v1/post-paid/customer-interaction-post-paid/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.loading = false;
          this.interaction = res.data;
        })
        .catch(e => {
          this.loading = false;
          console.log(e);
          throw e;
        });
    },
    async save() {
      this.loading = true;
      if (
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "affiliate_partner" ||
        this.$auth.user.designation_category == "staff"
      ) {
        try {
          await this.$axios
            .post(
              `/api/v1/customer-interaction-post-paid/${this.interaction.id}/comment/`,
              {
                comment: this.comment
              }
            )
            .then(() => {
              this.loading = false;
              this.success = true;
              this.comment = "";
              this.refresh(this.interaction.ticket_number);
            });
        } catch (err) {
          console.log(err);
          this.success = false;
          this.loading = false;
          this.error = err.response.data;
          this.errorMessage("danger", this.error);
        }
      }
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.customer_interaction_post_paid
          ? "Customer Interaction: " + error.customer_interaction_post_paid
          : error.detail
          ? "Detail: " + error.detail
          : error.comment
          ? "Comment: " + error.comment
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
  computed: {
    comment: {
      get() {
        return this.$store.getters["postPaidCustomerInteraction/comment"];
      },
      set(value) {
        this.setBasicStoreValue("comment", value);
      }
    }
  }
};
</script>

,<style scoped>
.comment-section {
  white-space: normal;
}
</style>
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
              v-if="!posting"
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
        <base-table :data="job.job_order_comments" thead-classes="text-primary">
          <template slot-scope="{ row }">
            <div v-if="loading">
              <b-spinner type="grow" label="Loading..."></b-spinner>
              loading...
            </div>
            <td v-else-if="!loading">
              <blockquote class="blockquote">
                <p class="mb-0">
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

import CreateJobOrderMixin from "@/mixins/CreateJobOrderMixin.js";

export default {
  components: {
    BaseTable
  },
  mixins: [CreateJobOrderMixin],
  props: {
    job: {
      type: Object
    },
    fetch: {
      type: Function
    }
  },
  data() {
    return {
      loading: false,
      posting: false,
      saving: false,
      error: ""
    };
  },
  methods: {
    async refresh(payload) {
      let endpoint = `/api/v1/post-paid/job-order-general/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.job = res.data;
        })
        .catch(e => {
          console.log(e);
          throw e;
        });
    },
    async save() {
      this.posting = true;
      if (
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "affiliate_partner" ||
        this.$auth.user.designation_category == "staff"
      ) {
        try {
          await this.$axios
            .post(`/api/v1/job-order/${this.job.id}/comment/`, {
              comment: this.comment
            })
            .then(() => {
              this.posting = false;
              this.success = true;
              this.comment = "";
              this.refresh(this.job.ticket_number);
            });
        } catch (err) {
          console.log(err);
          this.success = false;
          this.posting = false;
          this.error = err.response.data;
          this.errorMessage("danger", this.error);
        }
      }
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.job_order
          ? "Job order: " + error.job_order
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
        return this.$store.getters["jobOrder/comment"];
      },
      set(value) {
        this.setBasicStoreValue("comment", value);
      }
    }
  }
};
</script>

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
        <div class="col-sm-12 col-md-12" v-if="accountType == 'postpaid'">
          <base-table
            :data="job.job_order_comments"
            thead-classes="text-primary"
          >
            <template slot-scope="{ row }">
              <div v-if="loading">
                <b-spinner type="grow" label="Loading..."></b-spinner>
                loading...
              </div>
              <td v-else-if="!loading">
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
        <div class="col-sm-12 col-md-12" v-else-if="accountType == 'prepaid'">
          <base-table
            :data="job.prepaid_job_order_comments"
            thead-classes="text-primary"
          >
            <template slot-scope="{ row }">
              <div v-if="loading">
                <b-spinner type="grow" label="Loading..."></b-spinner>
                loading...
              </div>
              <td v-else-if="!loading">
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
        <div class="col-sm-12 col-md-12" v-if="accountType == 'ftm'">
          <base-table
            :data="job.ticket_summary_job_order_comments"
            thead-classes="text-primary"
          >
            <template slot-scope="{ row }">
              <div v-if="loading">
                <b-spinner type="grow" label="Loading..."></b-spinner>
                loading...
              </div>
              <td v-else-if="!loading">
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
  </div>
</template>

<script>
import BaseTable from "~/components/argon-core/BaseTable.vue";

import CreateJobOrderMixin from "@/mixins/CreateJobOrderMixin.js";
import { mapActions } from "vuex";

export default {
  components: {
    BaseTable,
  },
  mixins: [CreateJobOrderMixin],
  props: {
    job: {
      type: Object,
    },
    fetch: {
      type: Function,
    },
    accountType: {
      type: String,
      description: "Account type data",
    },
  },
  data() {
    return {
      loading: false,
      posting: false,
      saving: false,
      error: "",
    };
  },
  methods: {
    ...mapActions("jobOrder", ["addPostpaidComment", "addTicketSummaryComment"]),
    ...mapActions("prepaid/jobOrder", ["addPrepaidComment"]),
    async refreshPostpaid(payload) {
      let endpoint = `/api/v1/post-paid/job-order-general/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.job = res.data;
        })
        .catch((e) => {
          console.log(e);
          throw e;
        });
    },
    async refreshPrepaid(payload) {
      let endpoint = `/api/v1/prepaid/job-order-general/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.job = res.data;
        })
        .catch((e) => {
          console.log(e);
          throw e;
        });
    },
    async refreshTicketSummary(payload) {
      let endpoint = `/api/v1/post-paid/job-order-ticket-summary/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.job = res.data;
        })
        .catch((e) => {
          console.log(e);
          throw e;
        });
    },
    async refresh(payload) {
      if (this.accountType === "postpaid") {
        await this.refreshPostpaid(payload);
      } else if (this.accountType === "prepaid") {
        await this.refreshPrepaid(payload);
      } else if (this.accountType === "ftm") {
        await this.refreshTicketSummary(payload);
      }
    },
    async save() {
      this.posting = true;
      const payload = {
        id: this.job.id,
        comment: this.comment,
        job_order: this.job.id,
      };
      if (
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "affiliate_partner" ||
        this.$auth.user.designation_category == "staff"
      ) {
        try {
          if (this.accountType == "postpaid") {
            const payload = {
              id: this.job.id,
              comment: this.comment,
              job_order: this.job.id,
            };
            await this.addPostpaidComment(payload);
            this.posting = false;
            this.success = true;
            this.comment = "";
            this.refresh(this.job.ticket_number);
          } else if (this.accountType == "prepaid") {
            const payload = {
              id: this.job.id,
              comment: this.comment,
              job_order: this.job.id,
            };
            await this.addPrepaidComment(payload);
            this.posting = false;
            this.success = true;
            this.comment = "";
            this.refresh(this.job.ticket_number);
          } else if (this.accountType == "ftm") {
            const payload = {
              id: this.job.id,
              comment: this.comment,
              job_order: this.job.id,
            };
            await this.addTicketSummaryComment(payload);
            this.posting = false;
            this.success = true;
            this.comment = "";
            this.refresh(this.job.ticket_number);
          }
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
          solid: true,
        }
      );
    },
  },
  computed: {
    comment: {
      get() {
        if (this.accountType == "postpaid" || this.accountType == "ftm") {
          return this.$store.getters["jobOrder/comment"];
        } else if (this.accountType == "prepaid") {
          return this.$store.getters["prepaid/jobOrder/comment"];
        }
      },
      set(value) {
        if (this.accountType == "postpaid" || this.accountType == "ftm") {
          this.setBasicStoreValue("comment", value);
        } else if (this.accountType == "prepaid") {
          this.setPrepaidBasicStoreValue("comment", value);
        }
      },
    },
  },
  mounted() {
    this.refresh(this.job.ticket_number);
  },
};
</script>

<style scoped>
.comment-section {
  white-space: normal;
}
</style>

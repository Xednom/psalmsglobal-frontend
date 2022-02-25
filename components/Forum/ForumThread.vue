<template>
  <div class="container card mt-4">
    <b-overlay :show="showOverlay" rounded="sm">
      <div>
        <div class="card-header">
          <h5 class="h3 mb-0" v-html="thread.title"></h5>
        </div>
        <div class="card-header">
          <h4 class="mb-4" v-html="thread.content"></h4>
        </div>
        <div class="card-body">

          <div class="media align-items-center">
            <div class="media-body">
              <form @submit.prevent="save">
                <b-form-textarea
                  class="form-control"
                  v-model="comment"
                  placeholder="Write your comment"
                  rows="1"
                  max-rows="50"
                  aria-label="Comment textarea"
                ></b-form-textarea>
                <div class="mt-3">
                  <base-button
                    class="post-comment mt-3"
                    type="primary"
                    native-type="submit"
                    loading
                    v-if="saving"
                    >Posting...</base-button
                  >
                  <base-button type="primary" native-type="submit" v-else
                    >Post</base-button
                  >
                </div>
              </form>
            </div>
          </div>
          <b-overlay :show="show" rounded="sm">
            <div v-if="count >= 1">
              <hr />

              <div class="mb-1">
                <div
                  v-for="(comment, index) in thread.thread_comments"
                  :key="index"
                >
                  <comment
                    :user-name="comment.commenter"
                    :text="comment.comment"
                    :created-at="comment.created_at"
                    :comment="comment"
                    @refresh="fetchThread($route.params.id)"
                  />
                </div>
                <hr />
              </div>
            </div>
            <div v-else>
              <span class="text-center">
                <h3>No comments</h3>
              </span>
            </div>
          </b-overlay>
        </div>
      </div>
    </b-overlay>
  </div>
</template>

<script>
import Comment from "@/components/feed/Comment";
import ForumMixin from "@/mixins/ForumMixin";

import { mapActions } from "vuex";

export default {
  name: "news-feed",
  mixins: [ForumMixin],
  components: {
    Comment
  },
  data() {
    return {
      posting: false,
      saving: false,
      loading: false,
      show: false,
      showOverlay: false,
      count: ""
    };
  },
  methods: {
    ...mapActions("forum", ["saveComment", "resetComment"]),
    async fetchThreadComments(id) {
      this.show = true;
      let endpoint = `/api/v1/thread/${id}/comment/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.show = false;
          this.thread = res.data;
        })
        .catch(e => {
          this.show = false;
          throw e;
        });
    },
    async fetchThread(payload) {
      try {
        await this.$store.dispatch("forum/fetchThread", payload);
        this.count = this.thread.thread_comments.length;
      } catch (e) {
        throw e;
      }
    },
    async save() {
      this.saving = true;
      const payload = {
        id: this.thread.id,
        comment: this.comment
      };
      if (this.$auth.user.designation_category != "staff") {
        try {
          await this.saveComment(payload);
          this.saving = false;
          this.resetComment();
          this.fetchThread(this.$route.params.id);
        } catch (err) {
          console.log(err);
          this.saving = false;
          this.error = err;
          this.errorMessage(err.response.data);
        }
      } else {
        try {
          await this.saveComment(payload);
          this.saving = false;
          this.resetComment();
          this.fetchThread(this.$route.params.id);
        } catch (err) {
          console.log(err);
          this.saving = false;
          this.errorMessage(err.response.data);
        }
      }
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully updated a Thread!", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.title
          ? "Title: " + error.title
          : error.content
          ? "Content: " + error.content
          : error.author
          ? "Author: " + error.author
          : error.staff_carbon_copy
          ? "Staff carbon copy: " + error.staff_carbon_copy
          : error.client_carbon_copy
          ? "Client carbon copy: " + error.client_carbon_copy
          : error.is_active
          ? "Active: " + error.is_active
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
  async mounted() {
    await this.fetchThread(this.$route.params.id);
  }
};
</script>
<style></style>

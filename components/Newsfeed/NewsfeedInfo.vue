<template>
  <div class="container card">
    <b-overlay :show="showOverlay" rounded="sm">
      <div>
        <div class="card-header d-flex align-items-center">
          <div class="d-flex align-items-center">
            <div class="mx-3">
              <span class="text-dark font-weight-600 text-sm">{{
                newsFeed.title
              }}</span>
              <small
                class="d-block text-muted"
                v-if="newsFeed.was_published == 'today'"
                >{{ newsFeed.was_published }}</small
              >
              <small
                class="d-block text-muted"
                v-else-if="newsFeed.was_published == '1'"
                >{{ newsFeed.was_published }} day ago</small
              >
              <small
                class="d-block text-muted"
                v-else-if="newsFeed.was_published >= '2'"
                >{{ newsFeed.was_published }} days ago</small
              >
            </div>
          </div>
        </div>
        <div class="card-body">
          <p class="mb-4" v-html="newsFeed.body"></p>

          <hr />

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
                  v-for="(comment, index) in newsFeed.news_feed_comments"
                  :key="index"
                >
                  <comment
                    :user-name="comment.commenter"
                    :text="comment.comment"
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

import { mapGetters } from "vuex";

export default {
  name: "news-feed",
  components: {
    Comment
  },
  data() {
    return {
      posting: false,
      saving: false,
      loading: false,
      newsFeed: {},
      comment: "",
      show: false,
      showOverlay: false,
      count: ""
    };
  },
  computed: {
    ...mapGetters({
      staff: "user/staff",
      user: "user/user",
      client: "user/clientUser"
    })
  },
  methods: {
    async fetchNewsFeeds(id) {
      this.show = true;
      let endpoint = `/api/v1/newsfeed/${id}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.show = false;
          this.newsFeed = res.data;
          this.count = this.newsFeed.news_feed_comments.length;
        })
        .catch(e => {
          this.show = false;
          throw e;
        });
    },
    async fetchNewsFeed(id) {
      this.showOverlay = true;
      let endpoint = `/api/v1/newsfeed/${id}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.showOverlay = false;
          this.newsFeed = res.data;
          this.count = this.newsFeed.news_feed_comments.length;
        })
        .catch(e => {
          this.showOverlay = false;
          throw e;
        });
    },
    async save() {
      this.saving = true;
      if (
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        try {
          await this.$axios
            .post(`/api/v1/newsfeed/${this.newsFeed.id}/comment/`, {
              comment: this.comment
            })
            .then(() => {
              this.saving = false;
              this.comment = "";
              this.fetchNewsFeed(this.$route.params.id);
            });
        } catch (err) {
          console.log(err);
          this.saving = false;
          this.error = err;
          this.errorMessage(this.error);
        }
      } else {
        try {
          await this.$axios
            .post(`/api/v1/newsfeed/${this.newsFeed.id}/comment/`, {
              comment: this.comment
            })
            .then(() => {
              this.saving = false;
              this.comment = "";
              this.fetchNewsFeed(this.$route.params.id);
            });
        } catch (err) {
          console.log(err);
          this.saving = false;
          this.error = err;
          this.errorMessage(this.error);
        }
      }
    },
    errorMessage(error) {
      if (error.newsfeed) {
        return "newsfeed: " + this.error.newsfeed;
      } else if (error.user) {
        return "User: " + this.error.user;
      } else if (error.comment) {
        return "Comment: " + this.error.comment;
      } else if (error.non_field_errors) {
        return this.error.non_field_errors;
      }
    }
  },
  async mounted() {
    await this.fetchNewsFeed(this.$route.params.id);
  }
};
</script>
<style></style>

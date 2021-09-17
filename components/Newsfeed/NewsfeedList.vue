<template>
  <div class="container">
    <b-overlay :show="show" rounded="sm">
      <div class="card" v-for="(newsFeed, index) in newsFeeds" :key="index">
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
            <p class="mb-4">
              {{ newsFeed.body }}
            </p>
            <hr />

            <div class="mb-1">
              <nuxt-link :to="'/newsfeed/' + newsFeed.id">Comments</nuxt-link>
            </div>
          </div>
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
      show: false
    };
  },
  computed: {
    ...mapGetters({
      newsFeeds: "newsfeed/newsFeeds",
      newsFeed: "newsfeed/newsFeed",
      pagination: "newsfeed/newsFeedsPagination",
      staff: "user/staff",
      user: "user/user",
      client: "user/clientUser"
    })
  },
  methods: {
    async fetchNewsFeeds() {
      this.show = true;
      await this.$store.dispatch("newsfeed/fetchNewsFeeds").then(() => {
        console.log(this.newsFeeds);
        this.show = false;
      });
    },
    async fetchNewsFeed(id) {
      await this.$store.dispatch("newsfeed/fetchNewsFeed", id).then(() => {
        console.log(this.newsFeed.id);
      });
    },
    async save() {
      console.log();
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        this.loading = true;
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
                this.loading = false;
                this.success = true;
                this.comment = "";
                this.fetchNewsFeeds();
              });
          } catch (err) {
            console.log(err);
            this.success = false;
            this.error = err;
            this.errorMessage(this.error);
          }
        } else {
          const payload = {
            job_order_comments: {
              newsfeed: this.newsFeed.id,
              user: this.$auth.user.id,
              comment: this.comment
            }
          };
          await this.$axios
            .post(`/api/v1/newsfeed/${this.newsFeed.id}/comment/`, {
              comment: this.comment
            })
            .then(() => {
              this.loading = false;
              this.success = true;
              this.comment = "";
              this.fetchNewsFeeds();
            });
          this.fetchNewsFeeds();
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
    await this.fetchNewsFeeds();
    // this.fetchNewsFeed();
  }
};
</script>
<style></style>

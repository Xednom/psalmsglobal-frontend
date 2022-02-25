<template>
  <div class="media media-comment">
    <!-- <img alt="Image placeholder" class="avatar avatar-lg media-comment-avatar rounded-circle" :src="userImage"> -->
    <div class="media-body">
      <div class="media-comment-text">
        <h6 class="h5 mt-0">{{ userName }} said</h6>
        <blockquote class="blockquote">
          <p class="text-sm lh-160" v-html="text"></p>
          <footer class="blockquote-footer">
            commented at <strong>{{ createdAt }}</strong>
          </footer>
        </blockquote>
        <!-- todo: might need in the future -->
        <div class="icon-actions">
          <!-- <a href="#" class="like active">
            <i class="ni ni-like-2"></i>
            <span class="text-muted">{{likeCount}} likes</span>
          </a> -->
          <base-button
            type="primary"
            native-type="submit"
            @click="showReply"
            size="sm"
            ><i class="ni ni-curved-next"></i> Reply</base-button
          >
        </div>
        <div class="mt-3" v-if="reply">
          <form @submit.prevent="save">
            <b-form-textarea
              class="form-control"
              v-model="content"
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
        <div class="pull-right">
          <div v-for="(reply, index) in comment.comment_replies" :key="index">
            <reply
              :user-name="userName"
              :text="reply.content"
              :created-at="reply.created_at"
              :refresh="refresh"
            ></reply>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Reply from "@/components/feed/Reply.vue";
import { mapActions } from "vuex";
export default {
  name: "comment",
  components: {
    Reply
  },
  props: {
    userImage: {
      type: String,
      default: "img/theme/team-1.jpg"
    },
    userName: {
      type: String
    },
    text: {
      type: String,
      default:
        "Cras sit amet nibh libero nulla vel metus scelerisque ante sollicitudin. Cras purus odio vestibulum in vulputate viverra turpis."
    },
    likeCount: {
      type: Number,
      default: 0
    },
    shareCount: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: String
    },
    comment: {
      type: Object
    },
    refresh: {
      type: Promise
    }
  },
  data() {
    return {
      reply: false,
      saving: false
    };
  },
  methods: {
    ...mapActions("forum", ["saveReply", "resetReply"]),
    showReply() {
      this.reply = true;
    },
    setBasicStoreValue(fieldName, value) {
      this.$store.commit("forum/setBasicField", {
        field: fieldName,
        value: value
      });
    },
    async save() {
      this.saving = true;
      const payload = {
        id: this.comment.id,
        content: this.content
      };
      if (this.$auth.user.designation_category != "staff") {
        try {
          await this.saveReply(payload);
          this.saving = false;
          this.resetReply();
          this.$emit("refresh", this.comment);
        } catch (err) {
          console.log(err);
          this.saving = false;
          this.error = err;
          this.errorMessage(err.response.data);
        }
      } else {
        try {
          await this.saveReply(payload);
          this.saving = false;
          this.resetReply();
          this.$emit("refresh", this.comment);
        } catch (err) {
          console.log(err);
          this.saving = false;
          this.errorMessage(err.response.data);
        }
      }
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.comment
          ? "Comment: " + error.comment
          : error.author
          ? "Author: " + error.author
          : error.content
          ? "Content: " + error.content
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
  computed: {
    content: {
      get() {
        return this.$store.getters["forum/content"];
      },
      set(value) {
        this.setBasicStoreValue("content", value);
      }
    }
  }
};
</script>
<style></style>

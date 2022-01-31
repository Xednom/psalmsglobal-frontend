export default {
  methods: {
    setBasicStoreValue(fieldName, value) {
      this.$store.commit("interactionPostPaidRate/setBasicField", {
        field: fieldName,
        value: value
      });
    }
  },
  computed: {
    client: {
      get() {
        return this.$store.getters["interactionPostPaidRate/client"];
      },
      set(value) {
        this.setBasicStoreValue("client", value);
      }
    },
    rating: {
      get() {
        return this.$store.getters["interactionPostPaidRate/rating"];
      },
      set(value) {
        this.setBasicStoreValue("rating", value);
      }
    },
    postPaid: {
      get() {
        return this.$store.getters["interactionPostPaidRate/post_paid"];
      },
      set(value) {
        this.setBasicStoreValue("post_paid", value);
      }
    },
    comment: {
      get() {
        return this.$store.getters["interactionPostPaidRate/comment"];
      },
      set(value) {
        this.setBasicStoreValue("comment", value);
      }
    }
  }
};

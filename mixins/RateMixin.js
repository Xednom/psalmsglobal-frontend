export default {
  methods: {
    setBasicStoreValue(fieldName, value) {
      this.$store.commit("interactionRate/setBasicField", {
        field: fieldName,
        value: value
      });
    }
  },
  computed: {
    client: {
      get() {
        return this.$store.getters["interactionRate/client"];
      },
      set(value) {
        this.setBasicStoreValue("client", value);
      }
    },
    rating: {
      get() {
        return this.$store.getters["interactionRate/rating"];
      },
      set(value) {
        this.setBasicStoreValue("rating", value);
      }
    },
    postPaid: {
      get() {
        return this.$store.getters["interactionRate/post_paid"];
      },
      set(value) {
        this.setBasicStoreValue("post_paid", value);
      }
    },
    comment: {
      get() {
        return this.$store.getters["interactionRate/comment"];
      },
      set(value) {
        this.setBasicStoreValue("comment", value);
      }
    }
  }
};

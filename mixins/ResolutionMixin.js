export default {
  methods: {
    setBasicStoreValue(fieldName, value) {
      this.$store.commit("resolution/setBasicField", {
        field: fieldName,
        value: value,
      });
    },
  },
  computed: {
    category: {
      get() {
        return this.$store.getters["resolution/category"];
      },
      set(value) {
        this.setBasicStoreValue("category", value);
      },
    },
    description: {
      get() {
        return this.$store.getters["resolution/description"];
      },
      set(value) {
        this.setBasicStoreValue("description", value);
      },
    },
    assigned_to: {
      get() {
        return this.$store.getters["resolution/assigned_to"];
      },
      set(value) {
        this.setBasicStoreValue("assigned_to", value);
      },
    },
    client: {
      get() {
        return this.$store.getters["resolution/client"];
      },
      set(value) {
        this.setBasicStoreValue("client", value);
      },
    },
    status: {
      get() {
        return this.$store.getters["resolution/status"];
      },
      set(value) {
        this.setBasicStoreValue("status", value);
      },
    },
    resolution: {
      get() {
        return this.$store.getters["resolution/resolution"];
      },
      set(value) {
        this.setBasicStoreValue("resolution", value);
      },
    },
    user: {
      get() {
        return this.$store.getters["resolution/delivered_on_tiuserme"];
      },
      set(value) {
        this.setBasicStoreValue("user", value);
      },
    },
    comment: {
      get() {
        return this.$store.getters["resolution/comment"];
      },
      set(value) {
        this.setBasicStoreValue("comment", value);
      },
    },
  },
};

import { mapGetters } from "vuex";

export default {
  methods: {
    setBasicStoreValue(fieldName, value) {
      this.$store.commit("forum/setBasicField", {
        field: fieldName,
        value: value
      });
    }
  },
  computed: {
    ...mapGetters({
      thread: "forum/thread"
    }),
    title: {
      get() {
        return this.$store.getters["forum/title"];
      },
      set(value) {
        this.setBasicStoreValue("title", value);
      }
    },
    content: {
      get() {
        return this.$store.getters["forum/content"];
      },
      set(value) {
        this.setBasicStoreValue("content", value);
      }
    },
    staff_carbon_copy: {
      get() {
        return this.$store.getters["forum/staff_carbon_copy"];
      },
      set(value) {
        this.setBasicStoreValue("staff_carbon_copy", value);
      }
    },
    client_carbon_copy: {
      get() {
        return this.$store.getters["forum/client_carbon_copy"];
      },
      set(value) {
        this.setBasicStoreValue("client_carbon_copy", value);
      }
    },
    comment: {
      get() {
        return this.$store.getters["forum/comment"];
      },
      set(value) {
        this.setBasicStoreValue("comment", value);
      }
    }
  }
};

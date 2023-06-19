import { mapState, mapGetters } from "vuex";
import _ from "lodash";

export default {
  data() {
    return {
      id: "",
      apn: "",
      full_name: "",
    };
  },
  methods: {
    setBasicStoreValue(fieldName, value) {
      this.$store.commit("callMeInfo/setBasicField", {
        field: fieldName,
        value: value,
      });
    },
  },
  computed: {
    setProperty() {
      const vm = this;
      const item = this.$store.getters["callMeInfo/callMeInfo"];
      // let item = JSON.parse(items);
      console.warn("Parsed callMeInfo: ", item.apn);
      vm.id = item.id;
      vm.apn = item.apn;
      vm.full_name = item.full_name;
    },
    apn: {
      get() {
        console.info("APN mixin: ", this.$store.getters["callMeInfo/apn"]);
        return this.$store.getters["callMeInfo/apn"];
      },
      set(value) {
        this.setBasicStoreValue("apn", value);
      },
    },
    due_date: {
      get() {
        return this.$store.getters["callMeInfo/due_date"];
      },
      set(value) {
        this.setBasicStoreValue("due_date", value);
      },
    },
    status: {
      get() {
        return this.$store.getters["callMeInfo/status"];
      },
      set(value) {
        this.setBasicStoreValue("status", value);
      },
    },
    job_title: {
      get() {
        return this.$store.getters["callMeInfo/job_title"];
      },
      set(value) {
        this.setBasicStoreValue("job_title", value);
      },
    },
    total_time_consumed: {
      get() {
        return this.$store.getters["callMeInfo/total_time_consumed"];
      },
      set(value) {
        this.setBasicStoreValue("total_time_consumed", value);
      },
    },
    url_of_the_completed_jo: {
      get() {
        return this.$store.getters["callMeInfo/url_of_the_completed_jo"];
      },
      set(value) {
        this.setBasicStoreValue("url_of_the_completed_jo", value);
      },
    },
    job_description: {
      get() {
        return this.$store.getters["callMeInfo/job_description"];
      },
      set(value) {
        this.setBasicStoreValue("job_description", value);
      },
    },
    client_notes: {
      get() {
        return this.$store.getters["callMeInfo/client_notes"];
      },
      set(value) {
        this.setBasicStoreValue("client_notes", value);
      },
    },
  },
};

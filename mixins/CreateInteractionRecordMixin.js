import { mapGetters } from "vuex";

export default {
  methods: {
    setBasicStoreValue(fieldName, value) {
      this.$store.commit("interactionRecord/setBasicField", {
        field: fieldName,
        value: value,
      });
    },
    setPrepaidBasicStoreValue(fieldName, value) {
      this.$store.commit("prepaid/jobOrder/setBasicField", {
        field: fieldName,
        value: value,
      });
    },
    setFtmBasicStoreValue(fieldName, value) {
      this.$store.commit("ticketSummary/setBasicField", {
        field: fieldName,
        value: value,
      });
    },
  },
  computed: {
    setItem() {
      const vm = this;
      const items = [this.$store.getters["ticketSummary/ticketSummary"]];
      _.forEach(items, function(item) {
        vm.id = item.id;
        vm.request_date = item.request_date;
        vm.due_date = item.due_date;
        vm.status = item.status;
        vm.job_title = item.job_title;
        vm.total_time_consumed = item.total_time_consumed;
        vm.url_of_the_completed_jo = item.url_of_the_completed_jo;
        vm.job_description = item.job_description;
        vm.client_notes = item.client_notes;
      });
    },
    request_date: {
      get() {
        return this.$store.getters["ticketSummary/request_date"];
      },
      set(value) {
        this.setBasicStoreValue("request_date", value);
      },
    },
    due_date: {
      get() {
        return this.$store.getters["ticketSummary/due_date"];
      },
      set(value) {
        this.setBasicStoreValue("due_date", value);
      },
    },
    status: {
      get() {
        return this.$store.getters["ticketSummary/status"];
      },
      set(value) {
        this.setBasicStoreValue("status", value);
      },
    },
    job_title: {
      get() {
        return this.$store.getters["ticketSummary/job_title"];
      },
      set(value) {
        this.setBasicStoreValue("job_title", value);
      },
    },
    total_time_consumed: {
      get() {
        return this.$store.getters["ticketSummary/total_time_consumed"];
      },
      set(value) {
        this.setBasicStoreValue("total_time_consumed", value);
      },
    },
    url_of_the_completed_jo: {
      get() {
        return this.$store.getters["ticketSummary/url_of_the_completed_jo"];
      },
      set(value) {
        this.setBasicStoreValue("url_of_the_completed_jo", value);
      },
    },
    job_description: {
      get() {
        return this.$store.getters["ticketSummary/job_description"];
      },
      set(value) {
        this.setBasicStoreValue("job_description", value);
      },
    },
    client_notes: {
      get() {
        return this.$store.getters["ticketSummary/client_notes"];
      },
      set(value) {
        this.setBasicStoreValue("client_notes", value);
      },
    },
  },
};

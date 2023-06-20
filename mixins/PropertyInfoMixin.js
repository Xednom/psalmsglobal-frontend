import { mapState, mapGetters } from "vuex";
import _ from "lodash";

export default {
  data() {
    return {
      id: "",
      apn: "",
      full_name: "",
      item: {}
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
      vm.item = this.$store.getters["callMeInfo/callMeInfo"];
      vm.id = vm.item.id;
      vm.apn = vm.item.apn;
      vm.full_name = vm.item.full_name;
      vm.company_name = vm.item.company_name;
      vm.reference_number = vm.item.reference_number;
      vm.county = vm.item.county;
      vm.state = vm.item.state;
      vm.size = vm.item.size;
      vm.address = vm.item.address;
      vm.price = vm.item.price;
      vm.due_diligence = vm.item.due_diligence;
      vm.ad_content = vm.item.ad_content;
      vm.images = vm.item.images;
      vm.website = vm.item.website;
      vm.facebook = vm.item.facebook;
      vm.fb_groups = vm.item.fb_groups;
      vm.landmodo = vm.item.landmodo;
      vm.fsbo = vm.item.fsbo;
      vm.instagram = vm.item.instagram;
      vm.land_listing = vm.item.land_listing;
      vm.land_flip = vm.item.land_flip;
      vm.land_hub = vm.item.land_hub;
      vm.land_century = vm.item.land_century;
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

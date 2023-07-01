import { mapState, mapGetters } from "vuex";
import _ from "lodash";

export default {
  data() {
    return {
      id: "",
      apn: "",
      full_name: "",
      item: {},
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
    full_name: {
      get() {
        return this.$store.getters["callMeInfo/full_name"];
      },
      set(value) {
        this.setBasicStoreValue("full_name", value);
      },
    },
    reference_number: {
      get() {
        return this.$store.getters["callMeInfo/reference_number"];
      },
      set(value) {
        this.setBasicStoreValue("reference_number", value);
      },
    },
    company_name: {
      get() {
        return this.$store.getters["callMeInfo/company_name"];
      },
      set(value) {
        this.setBasicStoreValue("company_name", value);
      },
    },
    county: {
      get() {
        return this.$store.getters["callMeInfo/county"];
      },
      set(value) {
        this.setBasicStoreValue("county", value);
      },
    },
    state: {
      get() {
        return this.$store.getters["callMeInfo/state"];
      },
      set(value) {
        this.setBasicStoreValue("state", value);
      },
    },
    size: {
      get() {
        return this.$store.getters["callMeInfo/size"];
      },
      set(value) {
        this.setBasicStoreValue("size", value);
      },
    },
    address: {
      get() {
        return this.$store.getters["callMeInfo/address"];
      },
      set(value) {
        this.setBasicStoreValue("address", value);
      },
    },
    price: {
      get() {
        return this.$store.getters["callMeInfo/price"];
      },
      set(value) {
        this.setBasicStoreValue("price", value);
      },
    },
    due_diligence: {
      get() {
        return this.$store.getters["callMeInfo/due_diligence"];
      },
      set(value) {
        this.setBasicStoreValue("due_diligence", value);
      },
    },
    ad_content: {
      get() {
        return this.$store.getters["callMeInfo/ad_content"];
      },
      set(value) {
        this.setBasicStoreValue("ad_content", value);
      },
    },
    images: {
      get() {
        return this.$store.getters["callMeInfo/images"];
      },
      set(value) {
        this.setBasicStoreValue("images", value);
      },
    },
    website: {
      get() {
        return this.$store.getters["callMeInfo/website"];
      },
      set(value) {
        this.setBasicStoreValue("website", value);
      },
    },
    facebook: {
      get() {
        return this.$store.getters["callMeInfo/facebook"];
      },
      set(value) {
        this.setBasicStoreValue("facebook", value);
      },
    },
    fb_groups: {
      get() {
        return this.$store.getters["callMeInfo/fb_groups"];
      },
      set(value) {
        this.setBasicStoreValue("fb_groups", value);
      },
    },
    landmodo: {
      get() {
        return this.$store.getters["callMeInfo/landmodo"];
      },
      set(value) {
        this.setBasicStoreValue("landmodo", value);
      },
    },
    fsbo: {
      get() {
        return this.$store.getters["callMeInfo/fsbo"];
      },
      set(value) {
        this.setBasicStoreValue("fsbo", value);
      },
    },
    instagram: {
      get() {
        return this.$store.getters["callMeInfo/instagram"];
      },
      set(value) {
        this.setBasicStoreValue("instagram", value);
      },
    },
    land_listing: {
      get() {
        return this.$store.getters["callMeInfo/land_listing"];
      },
      set(value) {
        this.setBasicStoreValue("land_listing", value);
      },
    },
    land_flip: {
      get() {
        return this.$store.getters["callMeInfo/land_flip"];
      },
      set(value) {
        this.setBasicStoreValue("land_flip", value);
      },
    },
    land_hub: {
      get() {
        return this.$store.getters["callMeInfo/land_hub"];
      },
      set(value) {
        this.setBasicStoreValue("land_hub", value);
      },
    },
    land_century: {
      get() {
        return this.$store.getters["callMeInfo/land_century"];
      },
      set(value) {
        this.setBasicStoreValue("land_century", value);
      },
    },
  },
};

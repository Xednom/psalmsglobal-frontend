export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("prepaid/jobOrder/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  
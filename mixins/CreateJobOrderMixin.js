export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("jobOrder/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  
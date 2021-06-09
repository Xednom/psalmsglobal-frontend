export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("company/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  
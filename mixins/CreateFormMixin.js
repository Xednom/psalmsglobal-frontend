export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("form/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  
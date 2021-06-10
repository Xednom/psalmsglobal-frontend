export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("phoneSystem/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  
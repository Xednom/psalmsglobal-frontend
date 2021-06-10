export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("crm/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  
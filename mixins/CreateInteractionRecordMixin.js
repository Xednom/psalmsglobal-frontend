export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("interactionRecord/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  
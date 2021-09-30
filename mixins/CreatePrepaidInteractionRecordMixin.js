export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("prepaid/interactionRecord/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  
export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("ticketSummary/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  
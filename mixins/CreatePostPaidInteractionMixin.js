export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("postPaidCustomerInteraction/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  
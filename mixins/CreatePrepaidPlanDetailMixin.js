export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("prepaid/planDetail/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  
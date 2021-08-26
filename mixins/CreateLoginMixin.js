export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("loginCredentials/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  
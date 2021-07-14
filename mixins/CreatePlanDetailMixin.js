export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("planDetail/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  
export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("script/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  
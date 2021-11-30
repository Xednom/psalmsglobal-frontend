export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("jobOrder/setBasicField", {
          field: fieldName,
          value: value
        });
      },
      setPrepaidBasicStoreValue(fieldName, value) {
        this.$store.commit("prepaid/jobOrder/setBasicField", {
          field: fieldName,
          value: value
        });
      },
    }
  };
  
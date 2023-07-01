<template>
  <div>
    <div class="row">
      <div id="sticky-update" class="mb-2">
        <base-button type="success" native-type="submit" loading v-if="saving"
          >Saving</base-button
        >
        <base-button type="success" native-type="submit" v-else
          >Save</base-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ActionButtons",
  props: {
    item: { type: Object },
    saving: { type: Boolean },
  },
  data() {
    return {};
  },
  methods: {
    saveItem() {
      const vm = this;
      vm.$emit("save", vm.item);
    },
  },
};
</script>

<style scoped>
#sticky-update {
  position: fixed;
  bottom: 0px;
}

.action-background {
  background-color: gray;
}
</style>
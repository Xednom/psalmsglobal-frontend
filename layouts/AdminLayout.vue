<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot-scope="props" slot="links" v-if="$auth.user.is_superuser">
        <sidebar-item
          :link="{
            name: 'Admin - Customer Interaction Board',
            icon: 'ni ni-single-copy-04 text-pink'
          }"
        >
          <sidebar-item
            :link="{
              name: 'List of Interaction',
              path: '/admin-interaction'
            }"
          />
        </sidebar-item>
      </template>
    </side-bar>
    <div class="main-content">
      <dashboard-navbar
        :type="$route.name === 'alternative' ? 'light' : 'default'"
      ></dashboard-navbar>

      <div @click="$sidebar.displaySidebar(false)">
        <nuxt></nuxt>
      </div>
      <!-- <content-footer v-if="!$route.meta.hideFooter"></content-footer> -->
    </div>
  </div>
</template>
<script>
/* eslint-disable no-new */
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

import DashboardNavbar from "~/components/layouts/argon/DashboardNavbar.vue";
import ContentFooter from "~/components/layouts/argon/ContentFooter.vue";
import DashboardContent from "~/components/layouts/argon/Content.vue";

export default {
  middleware: ["auth"],
  components: {
    DashboardNavbar,
    ContentFooter,
    DashboardContent
  },
  methods: {
    initScrollbar() {
      let isWindows = navigator.platform.startsWith("Win");
      if (isWindows) {
        initScrollbar("scrollbar-inner");
      }
    }
  },
  mounted() {
    this.initScrollbar();
  }
};
</script>
<style lang="scss"></style>

<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot-scope="props" slot="links">
        <sidebar-item
          :link="{
            name: 'Dashboard',
            icon: 'ni ni-shop text-primary',
            path: '/'
          }"
        >
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Company account information',
            icon: 'ni ni-ui-04 text-info'
          }"
          v-if="$auth.user.designation_category != 'staff'"
        >
          <sidebar-item
            :link="{ name: 'List of Companies', path: '/company' }"
          />
          <sidebar-item :link="{ name: 'List of CRM/s', path: '/crm' }" />
          <sidebar-item
            :link="{ name: 'Phone system set up', path: '/phone-system' }"
          />
          <sidebar-item
            :link="{
              name: 'List of Scripts',
              path: '/form'
            }"
          />
          <sidebar-item
            :link="{
              name: 'Property info',
              path: '/property-info'
            }"
          />
        </sidebar-item>
        <sidebar-item
          v-if="$auth.user.designation_category == 'staff'"
          :link="{
            name: 'List of Interaction',
            path: '/post-paid/customer-interaction'
          }"
        />
        <sidebar-item
          v-if="$auth.user.designation_category == 'staff'"
          :link="{
            name: 'List of Job Order',
            path: '/job-order'
          }"
        />
        <sidebar-item
          v-if="$auth.user.designation_category == 'staff'"
          :link="{
            name: 'Call log report',
            path: '/call-log-report'
          }"
        />
        <sidebar-item
          v-if="
            $auth.user.account_type == 'postpaid' &&
              $auth.user.designation_category != 'staff'
          "
          :link="{
            name: 'Postpaid',
            icon: 'ni ni-single-copy-04 text-pink'
          }"
        >
          <sidebar-item
            :link="{
              name: 'List of Interaction',
              path: '/post-paid/customer-interaction'
            }"
          />
          <sidebar-item
            :link="{
              name: 'Billing',
              path: '/billing'
            }"
          />
        </sidebar-item>

        <sidebar-item
          v-if="
            $auth.user.designation_category != 'staff' &&
              $auth.user.account_type == 'prepaid'
          "
          :link="{
            name: 'Prepaid',
            icon: 'ni ni-credit-card'
          }"
        >
          <sidebar-item
            :link="{
              name: 'List of Interaction',
              path: '/prepaid/customer-interaction'
            }"
          />
          <sidebar-item
            :link="{
              name: 'Billing',
              path: '/billing'
            }"
          />
        </sidebar-item>

        <sidebar-item
          v-if="
            $auth.user.designation_category == 'new_client' ||
              $auth.user.designation_category == 'current_client' ||
              $auth.user.designation_category == 'affiliate_partner'
          "
          :link="{
            name: 'CI Minutes Summary Overview',
            icon: 'ni ni-archive-2',
            path: '/call-log-report'
          }"
        />
        <sidebar-item
          v-if="
            $auth.user.designation_category == 'new_client' ||
              $auth.user.designation_category == 'current_client' ||
              ($auth.user.designation_category == 'affiliate_partner' &&
                $auth.user.account_type == 'post_paid')
          "
          :link="{
            name: 'General Request and Other Overview',
            icon: 'ni ni-bullet-list-67',
            path: '/job-order'
          }"
        />
        <sidebar-item
          :link="{
            name: 'Account files',
            icon: 'ni ni-archive-2',
            path: '/account-files'
          }"
        />
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

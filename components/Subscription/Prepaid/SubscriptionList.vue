<template>
  <div>
    <div class="card">
      <div class="card-header bg-transparent border-0">
        <h3 class="mb-0">Monthly Subscription Fee</h3>
      </div>
      <b-container fluid>
        <!-- User Interface controls -->

        <b-row>
          <b-col sm="5" md="6" class="my-1">
            <b-form-group
              label="Per page"
              label-for="per-page-select"
              label-cols-sm="6"
              label-cols-md="4"
              label-cols-lg="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
            >
              <b-form-select
                id="per-page-select"
                v-model="perPage"
                :options="pageOptions"
                size="sm"
              ></b-form-select>
            </b-form-group>
          </b-col>

          <b-col lg="6" class="my-1">
            <b-form-group
              label="Filter"
              label-for="filter-input"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input
                  id="filter-input"
                  v-model="filter"
                  type="search"
                  placeholder="Type to Search"
                ></b-form-input>

                <b-input-group-append>
                  <b-button :disabled="!filter" @click="filter = ''"
                    >Clear</b-button
                  >
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Main table element -->
        <b-table
          :items="subscriptions"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          :filter-included-fields="filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          stacked="md"
          show-empty
          small
          @filtered="onFiltered"
          responsive
        >
          <template #cell(from)="row">
            {{ row.item.form_scripts }}
          </template>

          <template #cell(recurring_bill)="row">
            <div v-if="row.item.recurring_bill">
              <b-icon icon="check-circle-fill" variant="success"></b-icon>
            </div>
            <div v-else>
              <b-icon icon="x-circle-fill" variant="danger"></b-icon>
            </div>
          </template>

          <template #cell(payment_status)="row">
            <div v-if="row.item.payment_status">
              <b-icon icon="check-circle-fill" variant="success"></b-icon>
            </div>
            <div v-else>
              <b-icon icon="x-circle-fill" variant="danger"></b-icon>
            </div>
          </template>
          <template #cell(notes)="row">
            <span style="white-space=preline;">
              {{ row.item.notes }}
            </span>
          </template>

          <template #cell(actions)="row">
            <b-button
              v-b-modal.modal-view
              size="sm"
              @click="
                {
                  fetchSubscription(row.item);
                  modals.form = true;
                }
              "
              >View</b-button
            >
          </template>

          <template #row-details="row">
            <b-card>
              <ul>
                <li v-for="(value, key) in row.item" :key="key">
                  {{ key }}: {{ value }}
                </li>
              </ul>
            </b-card>
          </template>
        </b-table>

        <div
          slot="footer"
          class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
        >
          <div class="">
            <p class="card-category"></p>
          </div>
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0 mb-3"
          ></b-pagination>
        </div>
      </b-container>
    </div>
    <!-- info modal -->
    <b-modal id="modal-view" :title="subscription.client_name + ' ' + subscription.month_year" hide-footer>
      <subscription-view :subscription="subscription"></subscription-view>
    </b-modal>
    <!-- <modal
      :show.sync="modals.form"
      headerClasses="justify-content-center"
      class="white-content"
    >
      <subscription-view :subscription="subscription"></subscription-view>
    </modal> -->
  </div>
</template>

<script>
import {
  Table,
  TableColumn,
  DropdownMenu,
  DropdownItem,
  Dropdown
} from "element-ui";
import { mapGetters, mapActions } from "vuex";

import SubscriptionView from "@/components/Subscription/Prepaid/SubscriptionView";

export default {
  name: "subscription_list",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    SubscriptionView
  },
  computed: {
    ...mapGetters({
      subscriptions: "prepaid/monthlySubscription/subscriptions",
      subscription: "prepaid/monthlySubscription/subscription",
      pagination: "prepaid/monthlySubscription/subscriptionsPagination",
      user: "user/user",
      client: "user/clientUser"
    })
  },
  data() {
    return {
      isBusy: false,
      saving: false,
      modals: {
        form: false
      },
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: ""
      },
      fields: [
        { key: "month_year", label: "Month/Year", sortable: true },
        { key: "plan_type", sortable: true },
        { key: "monthly_fee", sortable: true },
        { key: "payment_reference", sortable: true },
        { key: "payment_status", sortable: true },
        { key: "actions", sortable: true }
      ]
    };
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async fetchSubscriptions() {
      this.isBusy = true;
      try {
        await this.$store
          .dispatch("prepaid/monthlySubscription/fetchSubscriptions", this.pagination)
          .then(() => {
            this.isBusy = false;
            this.totalRows = this.subscriptions.length;
          });
      } catch (e) {
        this.errorMessage("danger", e);
      }
    },
    async fetchSubscription(subscription) {
      this.isBusy = true;
      try {
        await this.$store
          .dispatch("prepaid/monthlySubscription/fetchSubscription", subscription)
          .then(() => {
            this.isBusy = false;
          });
      } catch (e) {
        this.errorMessage("danger", e);
      }
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.company
          ? "Company: " + error.company
          : error.detail
          ? "Detail: " + error.detail
          : error.non_field_errors
          ? error.non_field_errors
          : error,
        {
          title: `Error`,
          variant: variant,
          solid: true
        }
      );
    }
  },
  mounted() {
    this.fetchSubscriptions();
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

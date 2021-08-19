<template>
  <div>
    <div class="card">
      <div class="card-header bg-transparent border-0">
        <h3 class="mb-0">Plan Summary and Payments</h3>
      </div>
      <b-container fluid>
        <!-- User Interface controls -->

        <b-row>
          <b-col lg="2" class="my-1">
            <stats-card class="bg-gradient-default">
              <!-- Card body -->
              <div class="row">
                <div class="col">
                  <h5
                    class="card-title text-uppercase text-muted mb-0 text-white"
                  >
                    Total minutes
                  </h5>
                  <span class="h2 font-weight-bold mb-0 text-white">
                    {{ subTotal }}
                  </span>
                </div>
                <div class="col-auto">
                  <div
                    class="icon icon-shape bg-white text-dark rounded-circle shadow"
                  >
                    <i class="ni ni-watch-time"></i>
                  </div>
                </div>
              </div>
            </stats-card>
          </b-col>
        </b-row>

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
          :items="monthlyCharges"
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
          <template #cell(company)="row">
            <i class="ni ni-building"></i>
            <nuxt-link :to="'/script/' + row.item.id">{{
              row.item.company
            }}</nuxt-link>
          </template>
          <template #cell(from)="row">
            {{ row.item.form_scripts }}
          </template>

          <template #cell(payment_status)="row">
            <b-badge variant="success" v-if="row.item.payment_status"
              >Paid</b-badge
            >
            <b-badge variant="danger" v-else-if="!row.item.payment_status"
              >Unpaid</b-badge
            >
          </template>

          <template #cell(recurring_bill)="row">
            <div v-if="row.item.recurring_bill">
              <b-icon icon="check-circle-fill" variant="success"></b-icon>
            </div>
            <div v-else>
              <b-icon icon="x-circle-fill" variant="danger"></b-icon>
            </div>
          </template>

          <template #cell(account_status)="row">
            <div v-if="row.item.account_status">
              <b-icon icon="check-circle-fill" variant="success"></b-icon>
            </div>
            <div v-else>
              <b-icon icon="x-circle-fill" variant="danger"></b-icon>
            </div>
          </template>

          <template #cell(payment_reference)="row">
            <div v-if="row.item.payment_reference">
              {{ row.item.payment_reference }}
            </div>
            <div v-else>
              -
            </div>
          </template>

          <template #cell(date_paid)="row">
            <div v-if="row.item.date_paid">
              {{ row.item.date_paid }}
            </div>
            <div v-else>
              -
            </div>
          </template>

          <template #cell(actions)="row">
            <b-button
              size="sm"
              variant="primary"
              @click="
                {
                  fetchPlan(row.item);
                  modals.form = true;
                }
              "
              class="mr-1"
            >
              Update
            </b-button>
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
import StatsCard from "@/components/argon-core/Cards/StatsCard";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "company_list",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    StatsCard
  },
  computed: {
    ...mapGetters({
      monthlyCharges: "monthlyCharge/monthlyCharges",
      pagination: "monthlyCharge/monthlyChargesPagination",
      user: "user/user",
      client: "user/clientUser"
    }),
    subTotal: function() {
      return this.monthlyCharges.reduce((acc, item) => {
        return acc + parseInt(item.total_minutes);
      }, 0);
    }
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
        { key: "cost_of_plan", sortable: true },
        { key: "total_minutes", sortable: true },
        { key: "payment_status", sortable: true },
        { key: "payment_reference", sortable: true },
        { key: "date_paid", sortable: true }
      ]
    };
  },
  methods: {
    ...mapActions("monthlyCharge", ["fetchMontlhyCharges"]),
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async fetchMonthlyCharges() {
      this.isBusy = true;
      try {
        await this.$store
          .dispatch("monthlyCharge/fetchMontlhyCharges", this.pagination)
          .then(() => {
            this.isBusy = false;
          });
      } catch (e) {
        errorMessage("danger", e);
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
    this.fetchMonthlyCharges();
    this.totalRows = this.monthlyCharges.length;
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

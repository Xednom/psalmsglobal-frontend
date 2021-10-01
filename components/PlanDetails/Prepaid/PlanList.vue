<template>
  <div>
    <div class="card">
      <div class="card-header bg-transparent border-0">
        <h3 class="mb-0">Plan detail List</h3>
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
          :items="planDetails"
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

          <template #cell(actions)="row">
            <b-button
              size="sm"
              variant="primary"
              @click="
                {
                  fetchPlanDetail(row.item);
                  modals.form = true;
                }
              "
              class="mr-1"
            >
              View
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
    <!-- info modal -->
    <modal
      :show.sync="modals.form"
      headerClasses="justify-content-center"
      class="white-content"
    >
      <div class="row">
        <div class="col-xl-12 col-md-12 col-sm-12">
          <div slot="header" class="row align-items-center mb-3">
            <div class="col-12">
              <h3 class="mb-0">
                Plan details for {{ planDetail.client_name }}
              </h3>
            </div>
          </div>
          <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
            <form @submit.prevent="handleSubmit(save)">
              <div class="pl-lg-12">
                <div class="row">
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Cost of Plan"
                      placeholder="Cost of Plan"
                      name="Cost of Plan"
                      v-model="planDetail.subscription_type"
                      disabled
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Plan type"
                      placeholder="Plan type"
                      name="Plan type"
                      v-model="planDetail.monthly_fees"
                      disabled
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="Start of Plan"
                      placeholder="Start of Plan"
                      name="Start of Plan"
                      v-model="planDetail.start_of_subscription"
                      disabled
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      type="text"
                      label="End of Plan"
                      placeholder="End of Plan"
                      name="End of Plan"
                      v-model="planDetail.end_of_subscription"
                      disabled
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-6 mt-4">
                    <base-checkbox
                      v-model="planDetail.account_status"
                      class="mb-3"
                      disabled
                    >
                      Account Status
                    </base-checkbox>
                  </div>
                  <div class="col-lg-12">
                    <base-input label="Notes">
                      <textarea
                        class="form-control"
                        id="notes"
                        rows="3"
                        v-model="planDetail.notes"
                        disabled
                      ></textarea>
                    </base-input>
                  </div>
                </div>
                <!-- <base-button type="info" native-type="submit" loading v-if="saving"
              >Updating</base-button
            >
            <base-button type="info" native-type="submit" v-else
              >Update</base-button
            > -->
              </div>
            </form>
          </validation-observer>
        </div>
      </div>
    </modal>
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

import PlanUpdate from "@/components/PlanDetails/PlanUpdate";

export default {
  name: "prepaid_plan_list",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    PlanUpdate
  },
  computed: {
    ...mapGetters({
      planDetails: "prepaid/planDetail/planDetails",
      planDetail: "prepaid/planDetail/planDetail",
      pagination: "planDetail/planDetailsPagination",
      user: "user/user",
      client: "user/clientUser"
    }),
    client: {
      get() {
        return this.$store.getters["prepaid/planDetail/client"];
      },
      set(value) {
        this.setBasicStoreValue("client", value);
      }
    },
    subscription_type: {
      get() {
        return this.$store.getters["prepaid/planDetail/subscription_type"];
      },
      set(value) {
        this.setBasicStoreValue("subscription_type", value);
      }
    },
    monthly_fees: {
      get() {
        return this.$store.getters["prepaid/planDetail/monthly_fees"];
      },
      set(value) {
        this.setBasicStoreValue("monthly_fees", value);
      }
    },
    start_of_subscription: {
      get() {
        return this.$store.getters["prepaid/planDetail/start_of_subscription"];
      },
      set(value) {
        this.setBasicStoreValue("start_of_subscription", value);
      }
    },
    end_of_subscription: {
      get() {
        return this.$store.getters["prepaid/planDetail/end_of_subscription"];
      },
      set(value) {
        this.setBasicStoreValue("end_of_subscription", value);
      }
    },
    account_status: {
      get() {
        return this.$store.getters["prepaid/planDetail/account_status"];
      },
      set(value) {
        this.setBasicStoreValue("account_status", value);
      }
    },
    notes: {
      get() {
        return this.$store.getters["prepaid/planDetail/notes"];
      },
      set(value) {
        this.setBasicStoreValue("notes", value);
      }
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
        { key: "subscription_type", sortable: true },
        { key: "monthly_fees", sortable: true },
        { key: "start_of_subscription", sortable: true },
        { key: "end_of_subscription", sortable: true },
        { key: "account_status", sortable: true },
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
    // fetchPlanDetails() {
    //   this.isBusy = true;
    //   let endpoint = `/api/v1/post-paid/post-paid/`;
    //   return this.$axios
    //     .get(endpoint)
    //     .then(res => {
    //       this.isBusy = false;
    //       this.planDetails = res.data.results;
    //       this.totalRows = this.planDetails.length;
    //     })
    //     .catch(e => {
    //       this.isBusy = false;
    //       console.error(e);
    //     });
    // },
    async fetchPlanDetails() {
      this.isBusy = true;
      await this.$store
        .dispatch("prepaid/planDetail/fetchPlanDetails")
        .then(() => {
          this.totalRows = this.planDetails.length;
          this.isBusy = false;
        });
    },
    // fetchPlan(payload) {
    //   let endpoint = `/api/v1/post-paid/post-paid/${payload.id}`;
    //   return this.$axios
    //     .get(endpoint)
    //     .then(res => {
    //       this.planDetail = res.data;
    //     })
    //     .catch(e => {
    //       console.error(e);
    //     });
    // },
    async fetchPlanDetail(param) {
      await this.$store
        .dispatch("prepaid/planDetail/fetchPlanDetail", param)
        .then(() => {});
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.client
          ? "Client: " + error.client
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
    this.fetchPlanDetails();
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

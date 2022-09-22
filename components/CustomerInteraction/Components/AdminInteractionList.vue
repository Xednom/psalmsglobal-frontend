<template>
  <div>
    <div class="card">
      <div class="card-header bg-transparent border-0">
        <h3 class="mb-0">{{ interactionName }} Customer Interaction list</h3>
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

          <b-col
            lg="6"
            class="my-1"
            v-if="this.$auth.user.designation_category == 'staff'"
          >
            <b-form-group
              label="Select Account type"
              label-for="initial-sort-select"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-2"
            >
              <b-form-select
                id="account-type-select"
                v-model="accountType"
                :options="['Postpaid', 'Prepaid']"
                size="sm"
              ></b-form-select>
            </b-form-group>
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
                  @keyup.enter="fetchInteractions"
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

          <b-col
            lg="6"
            class="my-1"
            v-if="
              this.$auth.user.designation_category != 'staff' &&
                this.$auth.user.account_type == 'prepaid'
            "
          >
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
                  @keyup.enter="fetchPrepaidInteractions"
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
          <b-col
            lg="6"
            class="my-1"
            v-if="
              this.$auth.user.designation_category != 'staff' &&
                this.$auth.user.account_type == 'postpaid'
            "
          >
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
                  @keyup.enter="fetchPostpaidInteractions"
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
          <b-col lg="6" class="my-1" v-if="this.$auth.user.is_superuser">
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
                  @keyup.enter="fetchSearchPostpaidInteractionsAdmin"
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
          :items="interactions"
          :fields="fields"
          :per-page="perPage"
          :busy="isBusy"
          :filter-included-fields="filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          @filtered="onFiltered"
          stacked="md"
          show-empty
          small
          responsive
        >
          <template #table-busy>
            <div class="text-center text-default my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template #cell(ticket_number)="row">
            <nuxt-link
              :to="'/customer-interaction/' + row.item.ticket_number"
              >{{ row.item.ticket_number }}</nuxt-link
            >
          </template>
          <template #cell(company)="row">
            <i class="ni ni-building"></i>
            {{ row.item.company }}
          </template>

          <template #cell(customer_interaction_post_paid_comments)="row">
            <b-button
              size="sm"
              v-b-modal.comment-section
              @click="
                {
                  fetchInteraction(
                    row.item.ticket_number,
                    row.index,
                    $event.target
                  ),
                    (modals.comment = true);
                }
              "
              class="mr-1"
              variant="info"
            >
              view comments
            </b-button>
          </template>

          <template #cell(reason_of_the_call)="row">
            <span class="reason-of-the-call">
              {{ row.item.reason_of_the_call }}
            </span>
          </template>

          <template #cell(customer_interaction_post_paid_forms)="row">
            <b-button
              size="sm"
              @click="
                {
                  fetchForm(row.item.id, row.index, $event.target),
                    (modals.update = true);
                }
              "
              class="mr-1"
              variant="info"
            >
              <div
                v-for="form in row.item.customer_interaction_post_paid_forms"
                :key="form.id"
              >
                {{ form.form_title }}
              </div>
            </b-button>
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
            :per-page="100"
            first-number
            last-number
            align="fill"
            size="sm"
            class="my-0 mb-3"
          ></b-pagination>
        </div>
      </b-container>

      <modal :show.sync="modals.update" size="lg" body-classes="p-0">
        <b-overlay :show="show" rounded="sm">
          <form-view :form="form"></form-view>
        </b-overlay>
      </modal>

      <b-modal id="comment-section" size="lg" centered hide-footer>
        <template #modal-title>
          Comment section for Cust. Interaction of
          {{ interaction.ticket_number }}
        </template>
        <b-overlay :show="show" rounded="sm">
          <job-order-comment :interaction="interaction"></job-order-comment>
        </b-overlay>
      </b-modal>

      <!-- TODO: Add at a later date the job order modal -->
      <!-- <modal :show.sync="modals.jobOrder" size="xl" body-classes="p-0">
        <b-overlay :show="show" rounded="sm">
          <job-order-list :interaction="interaction"></job-order-list>
        </b-overlay>
      </modal> -->
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
import { mapGetters } from "vuex";

import FormView from "@/components/Form/FormView";
import JobOrderList from "@/components/JobOrder/JobOrderInteractionList";
import JobOrderComment from "@/components/CustomerInteraction/InteractionCommentSection";

export default {
  name: "AdminInteractionList",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    FormView,
    JobOrderList,
    JobOrderComment
  },
  props: {
    prepaid: { type: Boolean, default: false },
    postPaid: { type: Boolean, default: false }
  },
  computed: {
    ...mapGetters({
      // interactions: "postPaidCustomerInteraction/interactions",
      pagination: "postPaidCustomerInteraction/interactionsPagination",
      user: "user/user",
      client: "user/clientUser"
    }),
    interactionName() {
      const vm = this;
      if (vm.postPaid) {
        return "Postpaid";
      } else if (vm.prepaid) {
        return "Prepaid";
      }
    }
  },
  data() {
    return {
      interaction: {},
      form: {},
      clientUser: {},
      accountType: "",
      interactions: [],
      postPaidInteractions: [],
      prepaidInteractions: [],
      isBusy: false,
      saving: false,
      show: false,
      showJobOrder: false,
      modals: {
        update: false,
        jobOrder: false
      },
      totalRows: 1,
      currentPage: 1,
      perPage: 100,
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
        { key: "ticket_number", sortable: true },
        { key: "created_at", label: "Date call received", sortable: true },
        { key: "customer_interaction_post_paid_comments", label: "comments" },
        { key: "company", sortable: true },
        { key: "apn", sortable: true },
        { key: "reference_number", sortable: true },
        { key: "crm", sortable: true },
        { key: "leads_transferred_crm", sortable: true },
        { key: "caller_full_name", sortable: true },
        { key: "caller_phone", sortable: true },
        { key: "email", sortable: true },
        { key: "reason_of_the_call", sortable: true },
        { key: "interested_to_sell", sortable: true },
        { key: "interested_to_buy", sortable: true },
        { key: "general_call", sortable: true }
      ]
    };
  },
  watch: {
    currentPage: {
      handler: function(value) {
        if (this.postPaid) {
          this.fetchClientPostpaidInteractions().catch(error => {
            console.error(error);
          });
        } else if (this.prepaid) {
          this.fetchClientPrepaidInteractions().catch(error => {
            console.error(error);
          });
        }
      }
    }
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.fetchSearchPostpaidInteractionsAdmin();
      console.warn(filteredItems);
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async fetchPostpaidInteractions() {
      this.isBusy = true;
      let endpoint = `/api/v1/post-paid/customer-interaction-post-paid/?limit=${this.perPage}&offset=${this.perPage}search=${this.filter}`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.postPaidInteractions = res.data.results;
          if (this.postPaidInteractions.length == "1") {
            this.postPaidInteractions.forEach(item => {
              this.interactions = res.data.results;
              this.accountType = "Postpaid";
            });
          }
          if (this.accountType == "Postpaid") {
            this.interactions = res.data.results;
          }
          this.isBusy = false;
        })
        .catch(e => {
          throw e;
        });
    },
    async fetchSearchPostpaidInteractionsAdmin() {
      this.isBusy = true;
      let endpoint = `/api/v1/post-paid/customer-interaction-post-paid/?search=${this.filter}`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.interactions = res.data.results;
          if (this.postPaidInteractions.length == "1") {
            this.postPaidInteractions.forEach(item => {
              this.interactions = res.data.results;
              this.accountType = "Postpaid";
            });
          }
          if (this.accountType == "Postpaid") {
            this.interactions = res.data.results;
          }
          this.isBusy = false;
        })
        .catch(e => {
          throw e;
        });
    },
    async fetchPrepaidInteractions() {
      this.isBusy = true;
      let endpoint = `/api/v1/prepaid/customer-interaction/?search=${this.filter}`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.interactions = res.data.results;
          if (this.prepaidInteractions.length == "1") {
            this.prepaidInteractions.forEach(item => {
              this.interactions = res.data.results;
              this.accountType = "Postpaid";
            });
          }
          if (this.accountType == "prepaid") {
            this.interactions = res.data.results;
          }
          this.isBusy = false;
        })
        .catch(e => {
          throw e;
        });
    },
    async fetchClientPostpaidInteractions() {
      this.isBusy = true;
      let endpoint = `/api/v1/post-paid/customer-interaction-post-paid/?page=${this.currentPage}`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.interactions = res.data.results;
          this.totalRows = res.data.count;
          this.isBusy = false;
          this.interactions.forEach(item => {
            if (
              item.interested_to_sell == "yes" &&
              item.interested_to_buy == "yes"
            ) {
              item._cellVariants = {
                interested_to_sell: "success",
                interested_to_buy: "info"
              };
            } else if (
              item.interested_to_buy == "yes" &&
              item.interested_to_sell == "no"
            ) {
              item._cellVariants = {
                interested_to_buy: "success",
                interested_to_sell: "danger"
              };
            } else if (
              item.interested_to_sell == "no" &&
              item.interested_to_buy == "yes"
            ) {
              item._cellVariants = {
                interested_to_sell: "danger",
                interested_to_buy: "info"
              };
            }
          });
        })
        .catch(e => {
          throw e;
        });
    },
    async fetchClientPrepaidInteractions() {
      this.isBusy = true;
      let endpoint = `/api/v1/prepaid/customer-interaction/?page=${this.currentPage}`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.interactions = res.data.results;
          this.totalRows = res.data.count;
          this.isBusy = false;
          this.interactions.forEach(item => {
            if (
              item.interested_to_sell == "yes" &&
              item.interested_to_buy == "yes"
            ) {
              item._cellVariants = {
                interested_to_sell: "success",
                interested_to_buy: "info"
              };
            } else if (
              item.interested_to_buy == "yes" &&
              item.interested_to_sell == "no"
            ) {
              item._cellVariants = {
                interested_to_buy: "success",
                interested_to_sell: "danger"
              };
            } else if (
              item.interested_to_sell == "no" &&
              item.interested_to_buy == "yes"
            ) {
              item._cellVariants = {
                interested_to_sell: "danger",
                interested_to_buy: "info"
              };
            }
          });
        })
        .catch(e => {
          throw e;
        });
    },
    async fetchInteraction(id) {
      this.show = true;
      let endpoint = `/api/v1/post-paid/customer-interaction-post-paid/${id}`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.show = false;
          this.interaction = res.data;
        })
        .catch(e => {
          this.show = false;
          throw e;
        });
    },
    async fetchForm(id) {
      this.show = true;
      let endpoint = `/api/v1/interaction-form/${id}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.show = false;
          this.form = res.data;
        })
        .catch(e => {
          this.show = false;
          throw e;
        });
    },
    fetchInteractions() {
      if (this.accountType == "Prepaid") {
        this.fetchPrepaidInteractions();
      } else if (this.accountType == "Postpaid") {
        this.fetchPostpaidInteractions();
      } else {
        if (this.$auth.user.account_type == "Prepaid") {
          this.fetchPrepaidInteractions();
        } else if (this.$auth.user.account_type == "Postpaid") {
          this.fetchPostpaidInteractions();
        }
      }
    },
    adminInteractions() {
      if (this.auth.user.is_superuser) {
        this.fetchPostpaidInteractions();
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
    if (this.$auth.user.is_superuser) {
      if (this.postPaidInteractions) {
        this.fetchClientPostpaidInteractions();
      } else if (this.prepaid) {
        this.fetchClientPrepaidInteractions();
      }
    }
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
.reason-of-the-call {
  white-space: normal;
}
</style>

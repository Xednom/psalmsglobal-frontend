<template>
  <div>
    <div class="card">
      <div class="card-header bg-transparent border-0">
        <h3 class="mb-0">Ticket Summary list</h3>
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
                  @keyup.enter="fetchTicketSummary"
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
                  @keyup.enter="fetchTicketSummary"
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
          :items="summaries"
          :fields="computedFields"
          :current-page="currentPage"
          :per-page="perPage"
          :busy="isBusy"
          :filter-included-fields="filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
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
            <nuxt-link :to="'/ticket-summary/' + row.item.ticket_number">{{
              row.item.ticket_number
            }}</nuxt-link>
          </template>
          <template #cell(company)="row">
            <i class="ni ni-building"></i>
            {{ row.item.company }}
          </template>

          <template #cell(ticket_summary_comments)="row">
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
            :per-page="perPage"
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
          Comment section for Ticket Summary of
          {{ interaction.ticket_number }}
        </template>
        <b-overlay :show="show" rounded="sm">
          <interaction-comment
            :interaction="interaction"
            :user="$auth.user"
            :account-type="interaction.client_sub_category"
            type-account="ticket_summary"
          ></interaction-comment>
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
  Dropdown,
} from "element-ui";
import { mapGetters } from "vuex";

import FormView from "@/components/Form/FormView";
import JobOrderList from "@/components/JobOrder/JobOrderInteractionList";
import InteractionComment from "@/components/CustomerInteraction/InteractionCommentSection";

export default {
  name: "interaction_list",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    FormView,
    JobOrderList,
    InteractionComment,
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
        jobOrder: false,
      },
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      fields: [
        {
          key: "ticket_number",
          sortable: true,
          requiresStaff: true,
          requiresClient: true,
        },
        {
          key: "created_at",
          label: "Date call received",
          sortable: true,
          requiresStaff: true,
          requiresClient: true,
        },
        {
          key: "ticket_summary_comments",
          label: "comments",
          requiresStaff: true,
          requiresClient: true,
        },
        { key: "company", sortable: true, requiresStaff: true },
        {
          key: "apn",
          sortable: true,
          requiresStaff: true,
          requiresClient: true,
        },
        { key: "reference_number", sortable: true },
        { key: "crm", sortable: true },
        { key: "leads_transferred_crm", sortable: true },
        { key: "caller_full_name", sortable: true, requiresStaff: true },
        { key: "caller_phone", sortable: true },
        { key: "email", sortable: true, requiresStaff: true },
        { key: "reason_of_the_call", sortable: true },
        { key: "interested_to_sell", sortable: true, requiresStaff: true },
        { key: "interested_to_buy", sortable: true, requiresStaff: true },
        {
          key: "general_call",
          sortable: true,
          requiresStaff: true,
          requiresClient: true,
        },
        {
          key: "acquisition__description",
          label: "Acquisition tagging",
          sortable: true,
          requiresStaff: true,
          requiresClient: true,
        },
        {
          key: "prep_for_marketing__description",
          label: "Prep for Marketing",
          sortable: true,
          requiresStaff: true,
          requiresClient: true,
        },
        {
          key: "disposition_tagging__description",
          label: "Disposition tagging",
          sortable: true,
          requiresStaff: true,
          requiresClient: true,
        },
        {
          key: "overall_tagging__description",
          label: "Overall tagging",
          sortable: true,
          requiresStaff: true,
          requiresClient: true,
        },
      ],
    };
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async fetchTicketSummary() {
      this.isBusy = true;
      const vm = this;

      var options = {
        sort: "",
        limit: 10000,
        order: "asc",
        search: this.filter,
      };

      // options.query = {
      //   and: [["ticket_number", "eq", this.filter]],
      // };

      vm.$store
        .dispatch("ticketSummary/fetchTicketSummaries", options)
        .then(() => {
          vm.isBusy = false;
        });
    },
    async fetchClientTicketSummary() {
      this.isBusy = true;
      const vm = this;

      var options = {
        sort: "",
        limit: 10000,
        order: "asc",
      };

      // options.query = {
      //   and: [["ticket_number", "eq", this.filter]],
      // };

      vm.$store
        .dispatch("ticketSummary/fetchTicketSummaries", options)
        .then(() => {
          vm.isBusy = false;
          vm.totalRows = this.summaries.length;
        });
    },
    // async fetchClientTicketSummary() {
    //   this.isBusy = true;
    //   let endpoint = `/api/v1/post-paid/ticket-summary/?limit=10000`;
    //   return await this.$axios
    //     .get(endpoint)
    //     .then((res) => {
    //       this.summaries = res.data.results;
    //       this.totalRows = this.summaries.length;
    //       this.isBusy = false;
    //       this.summaries.forEach((item) => {
    //         if (
    //           item.interested_to_sell == "yes" &&
    //           item.interested_to_buy == "yes"
    //         ) {
    //           item._cellVariants = {
    //             interested_to_sell: "success",
    //             interested_to_buy: "info",
    //           };
    //         } else if (
    //           item.interested_to_buy == "yes" &&
    //           item.interested_to_sell == "no"
    //         ) {
    //           item._cellVariants = {
    //             interested_to_buy: "success",
    //             interested_to_sell: "danger",
    //           };
    //         } else if (
    //           item.interested_to_sell == "no" &&
    //           item.interested_to_buy == "yes"
    //         ) {
    //           item._cellVariants = {
    //             interested_to_sell: "danger",
    //             interested_to_buy: "info",
    //           };
    //         }
    //       });
    //     })
    //     .catch((e) => {
    //       throw e;
    //     });
    // },
    async fetchInteraction(id) {
      this.show = true;
      let endpoint = `/api/v1/post-paid/ticket-summary/${id}`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.show = false;
          this.interaction = res.data;
        })
        .catch((e) => {
          this.show = false;
          throw e;
        });
    },
    async fetchForm(id) {
      this.show = true;
      let endpoint = `/api/v1/interaction-form/${id}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.show = false;
          this.form = res.data;
        })
        .catch((e) => {
          this.show = false;
          throw e;
        });
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
          solid: true,
        }
      );
    },
  },
  computed: {
    ...mapGetters({
      summaries: "ticketSummary/ticketSummaries",
      pagination: "ticketSummary/ticketSummariesPagination",
      user: "user/user",
      client: "user/clientUser",
    }),
    computedFields() {
      if (
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        return this.fields.filter((field) => field.requiresClient);
      } else {
        return this.fields.filter((field) => field.requiresStaff);
      }
    },
  },
  mounted() {
    if (
      this.$auth.user.designation_category == "new_client" ||
      this.$auth.user.designation_category == "current_client" ||
      this.$auth.user.designation_category == "affiliate_partner" ||
      this.$auth.user.sub_category == "ftm"
    ) {
      this.fetchClientTicketSummary();
    }
  },
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

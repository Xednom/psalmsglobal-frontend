<template>
  <div class="content">
    <div class="row mt-5">
      <div class="col-12">
        <card card-body-classes="table-full-width">
          <div>
            <b-button
              variant="success"
              @click="modals.create = true"
              v-if="$auth.user.designation_category == 'staff'"
              >Add interaction record</b-button
            >
            <b-container fluid>
              <b-row>
                <b-col sm="12" md="4" lg="4" class="my-1 pull-right">
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
                <b-col lg="6" class="my-1 pull-right">
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
                :items="records"
                :fields="computedFields"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :busy="isBusy"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                stacked="md"
                show-empty
                small
                @filtered="onFiltered"
              >
                <template #table-busy>
                  <div class="text-center text-default my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                  </div>
                </template>
                <template #cell(apn)="row">
                  <nuxt-link
                    :to="'/job-order/property-detail/' + row.item.apn"
                    >{{ row.item.apn }}</nuxt-link
                  >
                </template>

                <template #cell(actions)="row">
                  <b-button
                    size="sm"
                    @click="
                      {
                        fetchInteractionRecord(row.item.id),
                          (modals.info = true);
                      }
                    "
                    class="mr-1"
                  >
                    Info
                  </b-button>
                </template>
              </b-table>
            </b-container>
          </div>
          <div
            slot="footer"
            class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
          >
            <div class="">
              <p class="card-category"></p>
            </div>
            <b-pagination
              v-model="currentPage"
              :total-rows="interactionRecordCount"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
          </div>
        </card>
      </div>
    </div>
    <!-- info modal -->
    <modal
      :show.sync="modals.info"
      headerClasses="justify-content-center"
      class="white-content"
    >
      <record-view :interaction="record"></record-view>
    </modal>

    <modal
      :show.sync="modals.create"
      headerClasses="justify-content-center"
      class="white-content"
    >
      <record-create
        :interaction="interactionRecord"
        :refresh="refresh"
      ></record-create>
    </modal>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import swal from "sweetalert2";

import RecordCreate from "@/components/InteractionRecord/RecordInteractionCreate";
import RecordView from "@/components/InteractionRecord/RecordInfo";

import { mapGetters } from "vuex";

export default {
  name: "interaction_record_list",
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    RecordCreate,
    RecordView,
  },
  props: {
    interactionRecord: {
      Type: Object,
      default: {}
    },
    ticketSummary: {
      Type: Object,
    },
    userSubcategory: {
      Type: Object,
    },
  },
  computed: {
    ...mapGetters({
      summaryRecords: "interactionRecord/ticket_summaries",
    }),
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
    queriedData() {
      let result = this.tableData;
      if (this.searchedData.length > 0) {
        result = this.searchedData;
      }
      return result.slice(this.from, this.to);
    },
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
    computedFields() {
      if (
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        return this.fields.filter((field) => !field.requiresStaff);
      } else {
        return this.fields.filter((field) => !field.requiresClient);
      }
    },
    interactionRecordCount() {
      if (this.records) {
        return this.records.length;
      }
    },
  },
  data() {
    return {
      searchQuery: "",
      searchedData: [],
      record: {},
      records: [],
      user: {},
      fuseSearch: null,
      isBusy: false,
      error: "",
      fields: [
        { key: "ticket_number", sortable: true },
        { key: "date_called", sortable: true },
        { key: "total_minutes", sortable: true },
        { key: "actions", label: "Actions" },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      modals: {
        classic: false,
        create: false,
        comments: false,
        info: false,
      },
    };
  },
  methods: {
    handleLike(index, row) {
      swal({
        title: `You liked ${row.name}`,
        buttonsStyling: false,
        type: "success",
        confirmButtonClass: "btn btn-success btn-fill",
      });
    },
    handleEdit(index, row) {
      swal({
        title: `You want to edit ${row.name}`,
        buttonsStyling: false,
        confirmButtonClass: "btn btn-info btn-fill",
      });
    },

    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async fetchInteractionRecord(id) {
      if (this.interactionRecord.client_account_type == "postpaid") {
        this.fetchPostpaidInteractionRecord(id);
      } else if (this.interactionRecord.client_account_type == "prepaid") {
        this.fetchPrepaidInteractionRecord(id);
      }
    },
    async fetchPostpaidInteractionRecord(id) {
      let endpoint = `/api/v1/post-paid/interaction-record/${id}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.record = res.data;
        })
        .catch((e) => {
          throw e;
        });
    },
    async fetchPrepaidInteractionRecord(id) {
      let endpoint = `/api/v1/prepaid/interaction-record/${id}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.record = res.data;
        })
        .catch((e) => {
          throw e;
        });
    },
    fetchPostpaidInteractionRecords() {
      this.isBusy = true;
      let endpoint = `/api/v1/post-paid/interaction-record/?search=${this.interactionRecord.id}`;
      return this.$axios
        .get(endpoint)
        .then((res) => {
          this.isBusy = false;
          this.records = res.data.results;
        })
        .catch((e) => {
          this.isBusy = false;
          console.error(e);
        });
    },
    fetchPrepaidInteractionRecords() {
      this.isBusy = true;
      let endpoint = `/api/v1/prepaid/interaction-record/?search=${this.interactionRecord.id}`;
      return this.$axios
        .get(endpoint)
        .then((res) => {
          this.isBusy = false;
          this.records = res.data.results;
          console.log(this.records);
        })
        .catch((e) => {
          this.isBusy = false;
          console.error(e);
        });
    },
    fetchTicketSummaries() {
      const vm = this;
      vm.isBusy = true;
      vm.$store
        .dispatch("interactionRecord/fetchSummaryRecords")
        .then(() => {
          vm.isBusy = false;
          console.warn("FTM records: ", vm.summaryRecords)
        });
    },
    fetchInteractionRecords() {
      if (this.interactionRecord.client_account_type == "postpaid") {
        this.fetchPostpaidInteractionRecords();
      } else if (this.interactionRecord.client_account_type == "prepaid") {
        this.fetchPrepaidInteractionRecords();
      } else if (this.userSubcategory == "ftm") {
        this.fetchTicketSummaries();
      }
    },
    refresh() {
      this.fetchInteractionRecords();
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.apn
          ? "APN: " + error.apn
          : error.state
          ? "State: " + errors.state
          : errors.county
          ? "County" + error.county
          : error.size
          ? "Size: " + error.username
          : error.property_status
          ? "Property status: " + error.property_status
          : error.asking_price
          ? "Asking price: " + error.asking_price
          : error.finance_terms
          ? "Finance terms: " + error.finance_terms
          : error.cash_terms
          ? "Cash terms: " + error.cash_terms
          : error.other_terms
          ? "Other terms: " + error.other_terms
          : error.notes
          ? "Notes: " + error.notes
          : error.non_field_errors
          ? error.non_field_errors
          : error,
        {
          title: `Something went wrong`,
          variant: variant,
          solid: true,
        }
      );
    },
  },
  mounted() {
    this.fetchInteractionRecords();
  },
};
</script>
<style scoped>
.pagination-select,
.search-input {
  width: 200px;
}
</style>

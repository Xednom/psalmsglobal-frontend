<template>
  <div class="content">
    <div class="row">
      <div class="col-12">
        <card card-body-classes="table-full-width">
          <div>
            <div class="card-header bg-transparent border-0">
              <h3 class="mb-0">Plan Details</h3>
            </div>
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
                :items="planDetails"
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
                responsive
              >
                <template #table-busy>
                  <div class="text-center text-default my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                  </div>
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
              :total-rows="totalRows"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import swal from "sweetalert2";

import { mapGetters } from "vuex";

export default {
  name: "record_list",
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
    ...mapGetters({
      planDetails: "vodaconnect/planDetail/planDetails",
      pagination: "vodaconnect/planDetail/planDetailsPagination"
    }),
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
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    },
    computedFields() {
      if (
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        return this.fields.filter(field => !field.requiresStaff);
      } else {
        return this.fields.filter(field => !field.requiresClient);
      }
    }
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
      loading: false,
      error: "",
      fields: [
        {
          key: "due_date",
          sortable: true
        },
        { key: "client_name", sortable: true },
        { key: "plan_type", sortable: true },
        { key: "total_cost", sortable: true },
        { key: "recurring_bill", sortable: true },
        { key: "paypal_details_for_billing", sortable: true }
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
        content: ""
      },
      modals: {
        classic: false,
        create: false,
        comments: false,
        info: false
      }
    };
  },
  methods: {
    handleLike(index, row) {
      swal({
        title: `You liked ${row.name}`,
        buttonsStyling: false,
        type: "success",
        confirmButtonClass: "btn btn-success btn-fill"
      });
    },
    handleEdit(index, row) {
      swal({
        title: `You want to edit ${row.name}`,
        buttonsStyling: false,
        confirmButtonClass: "btn btn-info btn-fill"
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
    async fetchPlanDetails() {
      this.isBusy = true;
      try {
        await this.$store
          .dispatch("vodaconnect/planDetail/fetchPlanDetails", this.pagination)
          .then(() => {
            this.totalRows = this.planDetails.length;
            this.isBusy = false;
          });
      } catch (e) {
        errorMessage("danger", e);
      }
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
.pagination-select,
.search-input {
  width: 200px;
}
</style>

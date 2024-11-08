<template>
  <div class="content">
    <div class="row mt-5">
      <div class="col-12">
        <card card-body-classes="table-full-width">
          <b-tabs v-model="tabIndex" card v-if="this.$auth.user.designation_category == 'staff'">
            <b-tab title="Call log report(Postpaid)" :title-link-class="linkClass(0)">
              <record-postpaid-list></record-postpaid-list>
            </b-tab>
            <b-tab title="Call log report(Prepaid)" :title-link-class="linkClass(1)" lazy>
              <record-prepaid-list></record-prepaid-list>
            </b-tab>
          </b-tabs>
          <div
            v-if="
              this.$auth.user.designation_category != 'staff' &&
                this.$auth.user.account_type == 'postpaid'
            "
          >
            <record-postpaid-list></record-postpaid-list>
          </div>
          <div
            v-else-if="
              this.$auth.user.designation_category != 'staff' &&
                this.$auth.user.account_type == 'prepaid'
            "
          >
            <record-prepaid-list></record-prepaid-list>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import swal from "sweetalert2";

import RecordCreate from "@/components/InteractionRecord/Create";
import RecordUpdate from "@/components/InteractionRecord/RecordUpdate";

import RecordPostpaidList from "@/components/InteractionRecord/Postpaid/RecordList";
import RecordPrepaidList from "@/components/InteractionRecord/Prepaid/RecordList";

export default {
  name: "record_list",
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    RecordCreate,
    RecordUpdate,
    RecordPostpaidList,
    RecordPrepaidList
  },
  computed: {
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
    },
    totalMinutes: function() {
      return this.records.reduce((acc, item) => {
        return acc + parseInt(item.total_minutes);
      }, 0);
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
      loading: false,
      error: "",
      fields: [
        {
          key: "customer_interaction_post_paid",
          label: "Customer Interaction ticket",
          sortable: true
        },
        { key: "date_called", sortable: true },
        { key: "total_minutes", sortable: true },
        {
          key: "client_feedback_status",
          label: "Dispute status",
          sortable: true
        },
        { key: "actions", label: "Actions" }
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
    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ["bg-dark", "text-light"];
      } else {
        return ["bg-light", "text-dark"];
      }
    },
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
    async fetchInteractionRecord(id) {
      this.loading = true;
      let endpoint = `/api/v1/post-paid/interaction-record/${id}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.loading = false;
          this.record = res.data;
        })
        .catch(e => {
          throw e;
        });
    },
    fetchInteractionRecords() {
      this.isBusy = true;
      let endpoint = `/api/v1/post-paid/interaction-record/`;
      return this.$axios
        .get(endpoint)
        .then(res => {
          this.isBusy = false;
          this.records = res.data.results;
        })
        .catch(e => {
          this.isBusy = false;
          console.error(e);
        });
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
          solid: true
        }
      );
    }
  },
  mounted() {
    this.fetchInteractionRecords();
  }
};
</script>
<style scoped>
.pagination-select,
.search-input {
  width: 200px;
}
</style>

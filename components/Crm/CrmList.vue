<template>
  <div>
    <div class="card">
      <div class="card-header bg-transparent border-0">
        <h3 class="mb-0">CRM List</h3>
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
          :items="crms"
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
        >
        <template #cell(client)="row">
          <i class="ni ni-circle-08"></i> {{ row.item.client_code }}
        </template>
          <template #cell(company)="row">
            <i class="ni ni-building"></i>
            <nuxt-link :to="'/crm/' + row.item.id">{{
              row.item.company
            }}</nuxt-link>
          </template>
          <template #cell(crm)="row">
            <div v-if="row.item.crm">
              <b-icon icon="check-circle-fill" variant="success"></b-icon>
            </div>
            <div v-else>
              <b-icon icon="x-circle-fill" variant="danger"></b-icon>
            </div>
          </template>

          <template #cell(actions)="row">
            <b-button
              size="sm"
              @click="info(row.item, row.index, $event.target)"
              class="mr-1"
            >
              Info modal
            </b-button>
            <b-button size="sm" @click="row.toggleDetails">
              {{ row.detailsShowing ? "Hide" : "Show" }} Details
            </b-button>
          </template>

          <template #cell(crm_login)="row">
            <div v-if="!row.crm_login">
              <span>-</span>
            </div>
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
import { mapGetters, mapActions } from "vuex";

export default {
  name: "company_list",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu
  },
  computed: {
    ...mapGetters({
      crms: "crm/crms",
      pagination: "crm/crmsPagination",
      user: "user/user",
      client: "user/clientUser"
    })
  },
  data() {
    return {
      crm: {},
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
        { key: "client", label: "Client code", sortable: true },
        { key: "company", sortable: true },
        { key: "crm", sortable: true },
        { key: "crm_url", sortable: true },
        { key: "type_of_crm", sortable: true },
        { key: "crm_login", sortable: true },
        { key: "notes", sortable: true }
      ]
    };
  },
  methods: {
    // ...mapActions("crm", ["updateCompany"]),
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async fetchCrms() {
      this.isBusy = true;
      await this.$store.dispatch("crm/fetchCrms", this.pagination).then(() => {
        this.isBusy = false;
      });
    },
    async fetchCrm(id) {
      let endpoint = `/api/v1/crm/${id}`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.crm = res.data;
          console.log(this.company);
        })
        .catch(e => {
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
          solid: true
        }
      );
    }
  },
  mounted() {
    this.fetchCrms();
    this.totalRows = this.crms.length;
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

<template>
  <div>
    <div class="card">
      <div class="card-header bg-transparent border-0">
        <h3 class="mb-0">Scripts</h3>
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
                  :input="fetchForms"
                  type="search"
                  placeholder="Type to Search"
                  disabled
                ></b-form-input>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Main table element -->
        <b-table
          v-if="filter"
          :items="forms"
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
          <template #cell(company)="row">
            <i class="ni ni-building"></i>
            {{ row.item.company }}
          </template>
          <template #cell(form_title)="row">
            {{ row.item.form_title }}
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

          <template #cell(actions)="row">
            <b-button
              size="sm"
              @click="
                {
                  fetchForm(row.item.id_form);
                  modals.form = true;
                }
              "
              class="mr-1"
            >
              Info
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

      <modal size="lg" :show.sync="modals.form">
        <b-overlay :show="showsForm" rounded="sm">
          <div class="container" v-if="form.attribute_forms">
            <h3>
              Script information for {{ form.company }} - {{ form.form_title }}
            </h3>
            <div id="form-script" class="col-lg-12">
              <b-card-text>
                <div
                  class="mb-3"
                  v-for="(form, index) in form.attribute_forms"
                  :key="index"
                >
                  <div class="mt-5" v-if="form.data_type == 'text'">
                    <span>
                      <strong
                        ><div v-dompurify-html="form.value_text"></div
                      ></strong>
                    </span>
                  </div>
                  <div class="mb-3" v-else-if="form.data_type == 'question'">
                    <p>
                      <span v-dompurify-html="form.value_question"></span>
                      <textarea
                        class="form-control"
                        name="input-question"
                        v-model="form.input_question"
                        id=""
                        cols="30"
                      ></textarea>
                    </p>
                  </div>
                </div>
              </b-card-text>
            </div>
          </div>
        </b-overlay>
        <div class="modal-footer">
          <b-button class="mt-3 pull-right" variant="primary" block @click="modals.form = false"
            >Close</b-button
          >
        </div>
      </modal>
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

export default {
  name: "form_view_list",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu
  },
  props: {
    filter: {
      Type: String,
      default: null,
      description: "Company form data"
    }
  },
  computed: {
    ...mapGetters({
      pagination: "form/formsPagination",
      user: "user/user",
      client: "user/clientUser"
    })
  },
  data() {
    return {
      limit: 10000,
      form: {
        data_type: "",
        value_text: "",
        value_question: "",
        input_question: "",
        original_script: false
      },
      forms: [],
      isBusy: false,
      saving: false,
      showsForm: false,
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
      filterOn: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: ""
      },
      fields: [
        { key: "company", sortable: true },
        { key: "form_title", sortable: true },
        { key: "actions" }
      ]
    };
  },
  computed: {
    async fetchForms() {
      let endpoint = `/api/v1/form/?search=${this.filter}&limit=${this.limit}`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.forms = res.data.results;
        })
        .catch(e => {
          throw e;
        });
    }
  },
  methods: {
    // ...mapActions("crm", ["updateCompany"]),
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async fetchForm(id) {
      this.showsForm = true;
      let endpoint = `/api/v1/form/${id}`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.showsForm = false;
          this.form = res.data;
          this.form.original_script = false;
        })
        .catch(e => {
          this.showsForm = false;
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
    this.totalRows = this.forms.length;
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

<template>
  <div>
    <div class="card">
      <div class="card-header bg-transparent border-0">
        <h3 class="mb-0">Account Files list</h3>
      </div>
      <b-container fluid>
        <!-- User Interface controls -->
        <b-row>
          <b-col></b-col>
          <b-col lg="6" class="my-1">
            <base-button
              class="btn-job-order"
              size="md"
              type="neutral"
              @click="modals.form = true"
              v-if="$auth.user.designation_category !='staff'"
              >Create an Account file</base-button
            >
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
          :items="accountFiles"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          :filter-included-fields="filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          :busy="isBusy"
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

          <template #cell(url)="row">
            <a :href="row.item.url" target="_blank">{{ row.item.url }}</a>
          </template>
          <template #cell(job_title)="row">
            {{ row.item.job_title }}
          </template>
          <template #cell(url_of_the_completed_jo)="row">
            <span v-if="row.item.url_of_the_completed_jo">
              <a :href="row.item.url_of_the_completed_jo" target="_blank">
                {{ row.item.url_of_the_completed_jo }}
              </a>
            </span>
            <span v-else-if="!row.item.url_of_the_completed_jo">
              -
            </span>
          </template>

          <template #cell(actions)="row">
            <b-button
              size="sm"
              @click="
                {
                  fetchAccountFile(row.item.id, row.index, $event.target),
                    (modals.update = true);
                }
              "
              class="mr-1"
              variant="info"
            >
              Update
            </b-button>
          </template>
        </b-table>

        <!--Form modal-->
        <modal :show.sync="modals.form" size="lg" body-classes="p-0">
          <h6 slot="header" class="modal-title">Create a File</h6>
          <card
            type="secondary"
            header-classes="bg-transparent pb-5"
            body-classes="px-lg-5 py-lg-5"
            class="border-0 mb-0"
          >
            <template>
              <div class="text-center text-muted mb-4">
                <small></small>
              </div>
              <form role="form" @submit.prevent="save">
                <div class="row">
                  <div class="col-md-6">
                    <base-input
                      label="File Name"
                      alternative
                      class="mb-3"
                      placeholder="File Name"
                      v-model="account.file_name"
                    >
                    </base-input>
                  </div>
                  <div class="col-md-6">
                    <base-input
                      label="URL"
                      alternative
                      class="mb-3"
                      placeholder="URL"
                      v-model="account.url"
                    >
                    </base-input>
                  </div>
                  <!-- <div
                    class="col-md-6"
                  >
                    <div class="col-lg-12" v-if="haveClient">
                      <label>Client Codes</label>
                      <vue-typeahead-bootstrap
                        v-model="account.client"
                        :ieCloseFix="false"
                        :data="clientCodes"
                        :serializer="item => item.client_code"
                        :value="clientKeyword"
                        @hit="getClient"
                        @input="onSearchInputClient"
                        placeholder="Search a Client code"
                      />

                      <div class="row">
                        <div class="col-md-6 mt-2" v-if="haveClient">
                          <b-button
                            variant="primary"
                            size="sm"
                            @click="assignToTicket"
                            >I have a Ticket</b-button
                          >
                        </div>
                      </div>
                    </div>
                  </div> -->
                  <div class="col-md-12">
                    <base-input label="File description">
                      <textarea
                        class="form-control"
                        id="fileDescription"
                        rows="3"
                        v-model="account.file_description"
                        placeholder="File description"
                      ></textarea>
                    </base-input>
                  </div>
                </div>

                <div class="text-center">
                  <base-button
                    type="primary"
                    native-type="submit"
                    loading
                    v-if="saving"
                    >Submit</base-button
                  >
                  <base-button type="primary" native-type="submit" v-else
                    >Submit</base-button
                  >
                </div>
              </form>
            </template>
          </card>
        </modal>

        <!-- update modal -->
        <modal
          :show.sync="modals.update"
          size="lg"
          headerClasses="justify-content-center"
          class="white-content"
        >
          <b-overlay :show="show" rounded="sm">
            <div class="container">
              <account-update
                :account="account"
                :refresh="refresh"
              ></account-update>
            </div>
          </b-overlay>
        </modal>

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
import { debounce } from "lodash";
import {
  Table,
  TableColumn,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Select,
  Option
} from "element-ui";
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import VueTypeaheadBootstrap from "vue-typeahead-bootstrap";
import { mapGetters, mapActions } from "vuex";

import JobOrderView from "@/components/JobOrder/JobOrderView";
import AccountUpdate from "@/components/AccountFiles/AccountUpdate";

export default {
  name: "job_order_list",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Select.name]: Select,
    [Option.name]: Option,
    flatPicker,
    JobOrderView,
    AccountUpdate,
    VueTypeaheadBootstrap
  },
  computed: {
    ...mapGetters({
      accountFiles: "accountFiles/accountFiles",
      pagination: "accountFiles/accountFilesPagination",
      staff: "user/staff",
      user: "user/user",
      client: "user/clientUser"
    })
  },
  data() {
    return {
      ticketKeyword: "",
      clientKeyword: "",
      clientEmail: "",
      jobOrder: {},
      // jobOrders: [],
      callerInteractions: [],
      clientCodes: [],
      account: {
        file: "",
        url: "",
        file_description: "",
        client: null
      },
      haveClient: false,
      haveTicket: true,
      clientUser: {},
      isBusy: false,
      saving: false,
      show: false,
      modals: {
        form: false,
        info: false,
        update: false
      },
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: "",
      filterOn: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: ""
      },
      fields: [
        { key: "client", sortable: true },
        { key: "file_name", sortable: true },
        { key: "url", sortable: true },
        { key: "actions" }
      ]
    };
  },
  methods: {
    ...mapActions("accountFiles", ["reset", "saveAccount"]),
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    reset() {
      this.account.client = null;
      this.account.file_name = "";
      this.account.url = "";
      this.account.file_description = "";
    },
    onSearchInputTicket(text) {
      this.ticketKeyword = text;
    },
    onSearchInputClient(text) {
      this.clientKeyword = text;
    },
    assignToClient() {
      this.haveClient = true;
      this.haveTicket = false;
    },
    assignToTicket() {
      this.haveTicket = true;
      this.haveClient = false;
    },
    getCallerInteraction: debounce(function() {
      this.$axios
        .get(
          `/api/v1/post-paid/customer-interaction-post-paid/?search=${this.account.caller_interaction_record}`
        )
        .then(res => {
          this.callerInteractions = res.data.results;
          console.log(this.callerInteractions);
          if (this.callerInteractions.length == 0) {
            this.haveClient = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }, 700),
    getClient: debounce(function() {
      this.$axios
        .get(`/api/auth/client-code/?search=${this.account.client}`)
        .then(res => {
          this.clientCodes = res.data.results;
          this.clientCodes.forEach(item => {
            console.log(item.client_email);
            this.clientEmail = item.client_email;
          });
          console.log(this.clientCodes);
        })
        .catch(err => {
          console.log(err);
        });
    }, 700),
    async fetchAccountFiles() {
      this.isBusy = true;
      await this.$store
        .dispatch("accountFiles/fetchAccountFiles", this.pagination)
        .then(() => {
          this.totalRows = this.accountFiles.length;
          this.isBusy = false;
        });
    },
    async refresh() {
      this.fetchAccountFiles();
    },
    async fetchAccountFile(id) {
      this.show = true;
      let endpoint = `/api/v1/account-files/${id}`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.show = false;
          this.account = res.data;
        })
        .catch(e => {
          this.show = false;
          throw e;
        });
    },
    async fetchClient(id) {
      try {
        await this.$store.dispatch("user/fetchClientUser", id).then(() => {});
      } catch (err) {
        console.error(err);
      }
    },
    async fetchStaff(id) {
      try {
        await this.$store.dispatch("user/fetchStaff", id).then(() => {});
      } catch (err) {
        console.error(err);
      }
    },
    async fetchMe() {
      try {
        await this.$store.dispatch("user/fetchUser").then(() => {
          if (
            this.$auth.user.designation_category == "new_client" ||
            this.$auth.user.designation_category == "current_client" ||
            this.$auth.user.designation_category == "affiliate_partner"
          ) {
            this.fetchClient(this.$auth.user.id);
          } else {
            this.fetchStaff(this.$auth.user.id);
          }
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async save() {
      if (
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        const accountPayload = {
          client: this.client.client_code,
          file_name: this.account.file_name,
          url: this.account.url,
          file_description: this.account.file_description
        };
        try {
          this.saving = true;
          await this.saveAccount(accountPayload)
            .then(() => {
              this.saving = false;
              this.reset();
              this.successMessage("success");
              this.fetchAccountFiles();
            })
            .catch(e => {
              console.log(e);
              this.errorMessage("danger", e.response.data);
            });
        } catch (e) {
          throw e;
        }
      }
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully added a new File!", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.client
          ? "Client: " + error.client
          : error.due_date
          ? "Due date: " + error.due_date
          : error.request_date
          ? "Request date: " + error.request_date
          : error.job_description
          ? "Job Description: " + error.job_description
          : error.job_title
          ? "Job title: " + error.job_title
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
    this.fetchMe();
    this.fetchAccountFiles();
    // setTimeout(() => this.fetchAccountFiles(), 1000);
  },
  watch: {
    ticketKeyword: debounce(function(oldKeyword, newKeyword) {
      if (newKeyword !== "" && newKeyword !== oldKeyword) {
        this.getCallerInteraction();
      } else if (!newKeyword) {
        this.jobOrders = [];
      }
    }, 500),
    clientKeyword: debounce(function(oldKeyword, newKeyword) {
      if (newKeyword !== "" && newKeyword !== oldKeyword) {
        this.getClient();
      } else if (!newKeyword) {
        this.jobOrders = [];
      }
    }, 500)
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
.btn-job-order {
  float: right;
}
</style>

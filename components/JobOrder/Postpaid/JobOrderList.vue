<template>
  <div>
    <div class="card">
      <b-container fluid>
          <b-row>
            <b-col lg="3" class="my-1 mt-2">
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
                      {{ totalMinutes }}
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
            <b-col></b-col>
            <b-col lg="6" class="my-1 mt-3">
              <base-button
                class="btn-job-order"
                size="md"
                type="neutral"
                @click="modals.form = true"
                >Create a Job Order</base-button
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
            :items="jobOrders"
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
            <template #cell(job_title)="row">
              {{ row.item.job_title }}
            </template>
            <template #cell(caller_interaction_record)="row">
              <span v-if="row.item.caller_interaction_record">
                {{ row.item.caller_interaction_record }}
              </span>
              <span v-else>
                Independently created
              </span>
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
                    fetchJobOrder(row.item.id, row.index, $event.target),
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
          <h6 slot="header" class="modal-title">Create Job Order Request</h6>
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
                  <div class="col-md-4">
                    <base-input label="Request date">
                      <flat-picker
                        slot-scope="{ focus, blur }"
                        @on-open="focus"
                        @on-close="blur"
                        :config="{ allowInput: true }"
                        class="form-control datepicker"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        v-model="job.request_date"
                        placeholder="Request date"
                      >
                      </flat-picker>
                    </base-input>
                  </div>
                  <div class="col-md-4">
                    <base-input label="Due date">
                      <flat-picker
                        slot-scope="{ focus, blur }"
                        @on-open="focus"
                        @on-close="blur"
                        :config="{ allowInput: true }"
                        class="form-control datepicker"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        v-model="job.due_date"
                        placeholder="Due date"
                      >
                      </flat-picker>
                    </base-input>
                  </div>
                  <div
                    class="col-md-4"
                    v-if="$auth.user.designation_category == 'staff'"
                  >
                    <base-input
                      label="Total time consumed"
                      alternative
                      class="mb-3"
                      placeholder="Total time consumed"
                      v-model="job.total_time_consumed"
                      @input="onlyNumbers"
                    >
                    </base-input>
                  </div>
                  <div
                    class="col-md-6"
                    v-if="$auth.user.designation_category == 'staff'"
                  >
                    <base-input
                      label="Job title"
                      alternative
                      class="mb-3"
                      placeholder="Job title"
                      v-model="job.job_title"
                    >
                    </base-input>
                  </div>
                  <div
                    class="col-md-12"
                    v-if="$auth.user.designation_category != 'staff'"
                  >
                    <base-input
                      label="Job title"
                      alternative
                      class="mb-3"
                      placeholder="Job title"
                      v-model="job.job_title"
                    >
                    </base-input>
                  </div>
                  <div
                    class="col-md-6"
                    v-if="$auth.user.designation_category == 'staff'"
                  >
                    <div class="col-lg-12" v-if="haveTicket">
                      <label>Caller interaction ticket</label>
                      <vue-typeahead-bootstrap
                        v-model="job.caller_interaction_record"
                        :ieCloseFix="false"
                        :data="callerInteractions"
                        :serializer="item => item.ticket_number"
                        :value="ticketKeyword"
                        @hit="getCallerInteractionPostpaid"
                        @input="onSearchInputTicket"
                        placeholder="Search a Caller Interaction"
                      />
                      <div class="row">
                        <div class="col-md-6 mt-2" v-if="haveTicket">
                          <b-button
                            variant="primary"
                            size="sm"
                            @click="assignToClient"
                            >I have a Client</b-button
                          >
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-12" v-else-if="haveClient">
                      <label>Client Codes</label>
                      <vue-typeahead-bootstrap
                        v-model="job.client"
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
                  </div>
                  <div class="col-md-12">
                    <base-input label="Job description">
                      <textarea
                        class="form-control"
                        id="jobDescription"
                        rows="3"
                        v-model="job.job_description"
                        placeholder="Job Description"
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
              <job-order-update
                :jobOrder="jobOrder"
                :refresh="refresh"
              ></job-order-update>
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
import JobOrderUpdate from "@/components/JobOrder/JobOrderUpdate";
import JobOrderPrepaid from "@/components/JobOrder/Prepaid/JobOrderList";

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
    JobOrderUpdate,
    JobOrderPrepaid,
    VueTypeaheadBootstrap
  },
  props: {
    interaction: {
      Type: Object,
      description: "Interaction data ticket use to create job order"
    }
  },
  computed: {
    ...mapGetters({
      jobOrders: "jobOrder/jobOrders",
      pagination: "jobOrder/jobOrdersPagination",
      staff: "user/staff",
      user: "user/user",
      client: "user/clientUser"
    }),
    totalMinutes: function() {
      return this.jobOrders.reduce((acc, item) => {
        return acc + parseInt(item.total_time_consumed);
      }, 0);
    }
  },
  data() {
    return {
      tabIndex: 0,
      ticketKeyword: "",
      clientKeyword: "",
      clientEmail: "",
      jobOrder: {},
      // jobOrders: [],
      callerInteractions: [],
      clientCodes: [],
      job: {
        caller_interaction_record: null,
        due_date: "",
        request_date: "",
        job_title: "",
        total_time_consumed: "",
        job_description: "",
        url_of_the_completed_jo: "",
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
        { key: "agent_code", sortable: true },
        {
          key: "ticket_number",
          label: "Job order ticket number",
          sortable: true
        },
        { key: "caller_interaction_record", sortable: true },
        { key: "job_title", sortable: true },
        { key: "url_of_the_completed_jo", sortable: true },
        { key: "status", sortable: true },
        { key: "actions" }
      ]
    };
  },
  methods: {
    ...mapActions("jobOrder", ["reset", "saveJobOrder"]),
    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ["bg-dark", "text-light"];
      } else {
        return ["bg-light", "text-dark"];
      }
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    onlyNumbers: function() {
      this.job.total_time_consumed = this.job.total_time_consumed.replace(
        /[^0-9.]/g,
        ""
      );
    },
    reset() {
      this.job.caller_interaction_record = null;
      this.job.client = null;
      this.job.due_date = "";
      this.job.request_date = "";
      this.job.job_title = "";
      this.job.total_time_consumed = "";
      this.job.job_description = "";
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
    getCallerInteractionPostpaid: debounce(function() {
      this.$axios
        .get(
          `/api/v1/post-paid/customer-interaction-post-paid/?search=${this.job.caller_interaction_record}`
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
        .get(`/api/auth/client-code/?search=${this.job.client}`)
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
    async fetchJobOrders() {
      this.isBusy = true;
      await this.$store
        .dispatch("jobOrder/fetchJobOrders", this.pagination)
        .then(() => {
          this.totalRows = this.jobOrders.length;
          this.isBusy = false;
        });
    },
    async callBackJobOrders() {
      await this.$store
        .dispatch("jobOrder/fetchJobOrders", this.pagination)
        .then(() => {
          this.totalRows = this.jobOrders.length;
        });
    },
    async refresh() {
      this.fetchJobOrders();
    },
    async fetchJobOrder(id) {
      this.show = true;
      let endpoint = `/api/v1/post-paid/job-order/${id}`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.show = false;
          this.jobOrder = res.data;
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
        const jobOrderPayload = {
          client: this.client.client_code,
          caller_interaction_record: this.job.caller_interaction_record,
          request_date: this.job.request_date,
          due_date: this.job.due_date,
          job_title: this.job.job_title,
          job_description: this.job.job_description
        };
        try {
          this.saving = true;
          await this.saveJobOrder(jobOrderPayload)
            .then(() => {
              this.saving = false;
              this.reset();
              this.successMessage("success");
              this.fetchJobOrders();
            })
            .catch(e => {
              console.log(e);
            });
        } catch (e) {
          throw e;
        }
      } else if (this.$auth.user.designation_category == "staff") {
        const jobOrderPayload = {
          caller_interaction_record: this.job.caller_interaction_record,
          client: this.job.client,
          client_email: this.clientEmail,
          va_assigned: [this.staff.id],
          request_date: this.job.request_date,
          due_date: this.job.due_date,
          total_time_consumed: this.job.total_time_consumed,
          job_title: this.job.job_title,
          job_description: this.job.job_description
        };
        try {
          this.saving = true;
          await this.saveJobOrder(jobOrderPayload)
            .then(() => {
              this.saving = false;
              this.reset();
              this.successMessage("success");
              this.callBackJobOrders();
            })
            .catch(e => {
              this.saving = false;
              console.log(e.response.data);
              this.errorMessage("danger", e.response.data);
            });
        } catch (e) {
          this.saving = false;
        }
      }
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully added a new Job Order!", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.caller_interaction_record
          ? "Caller interaction record: " + error.caller_interaction_record
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
    this.fetchJobOrders();
    // setTimeout(() => this.fetchJobOrders(), 1000);
  },
  watch: {
    ticketKeyword: debounce(function(oldKeyword, newKeyword) {
      if (newKeyword !== "" && newKeyword !== oldKeyword) {
        this.getCallerInteractionPostpaid();
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

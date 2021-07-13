<template>
  <div>
    <div class="card">
      <div class="card-header bg-transparent border-0">
        <h3 class="mb-0">Job Order Request</h3>
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
                  <div class="col-md-6">
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
                  <div class="col-md-6">
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
                  <div class="col-md-6">
                    <base-input
                      label="Job title"
                      alternative
                      class="mb-3"
                      placeholder="Job title"
                      v-model="job.job_title"
                    >
                    </base-input>
                  </div>
                  <div class="col-md-6">
                    <div class="col-lg-12">
                      <label>Caller interaction ticket</label>
                      <vue-typeahead-bootstrap
                        class="mb-4"
                        v-model="job.caller_interaction_record"
                        :ieCloseFix="false"
                        :data="callerInteractions"
                        :serializer="item => item.ticket_number"
                        :value="keyword"
                        @hit="getCallerInteraction"
                        @input="onSearchInput"
                        placeholder="Search a Caller Interaction"
                      />
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
          <div class="container">
            <job-order-update
              :jobOrder="jobOrder"
              :refresh="refresh"
            ></job-order-update>
          </div>
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
      pagination: "jobOrder/jobOrdersPagination",
      staff: "user/staff",
      user: "user/user",
      client: "user/clientUser"
    })
  },
  data() {
    return {
      keyword: "",
      jobOrder: {},
      jobOrders: [],
      callerInteractions: [],
      job: {
        caller_interaction_record: null,
        due_date: "",
        request_date: "",
        job_title: "",
        job_description: ""
      },
      clientUser: {},
      isBusy: false,
      saving: false,
      modals: {
        form: false,
        info: false,
        update: false
      },
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
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
        { key: "caller_interaction_record", label:" Caller interaction ticket ", sortable: true },
        { key: "ticket_number", label:"Job order ticket number", sortable: true },
        { key: "job_title", sortable: true },
        { key: "actions" }
      ]
    };
  },
  methods: {
    ...mapActions("jobOrder", ["reset", "saveJobOrder"]),
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    reset() {
      this.job.caller_interaction_record = null;
      this.job.due_date = "";
      this.job.request_date = "";
      this.job.job_title = "";
      this.job.job_description = "";
    },
    onSearchInput(text) {
      this.keyword = text;
    },
    getCallerInteraction: debounce(function() {
      this.$axios
        .get(
          `/api/v1/post-paid/customer-interaction-post-paid/?search=${this.job.caller_interaction_record}`
        )
        .then(res => {
          this.callerInteractions = res.data.results;
        })
        .catch(err => {
          console.log(err);
        });
    }, 700),
    async fetchJobOrders() {
      this.isBusy = true;
      let endpoint = `/api/v1/post-paid/job-order-general/?search=${this.interaction.ticket_number}`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.jobOrders = res.data.results;
          this.isBusy = false;
        })
        .catch(e => {
          throw e;
        });
    },
    async refresh() {
      this.fetchJobOrders();
    },
    async fetchJobOrder(id) {
      let endpoint = `/api/v1/post-paid/job-order/${id}`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.jobOrder = res.data;
        })
        .catch(e => {
          throw e;
        });
    },
    async fetchClient(id) {
      try {
        await this.$store.dispatch("user/fetchClient", id).then(() => {});
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
          client: this.clientUser.client_code,
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
          va_assigned: [this.staff.id],
          request_date: this.job.request_date,
          due_date: this.job.due_date,
          job_title: this.job.job_title,
          job_description: this.job.job_description
        };
        try {
          this.saving = true;
          await this.saveJobOrder(jobOrderPayload).then(() => {
            this.saving = false;
            this.reset();
            this.successMessage("success");
            this.fetchJobOrders();
          });
        } catch (e) {
          throw e;
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
    this.fetchMe();
    setTimeout(() => this.fetchJobOrders(), 1000);
    this.totalRows = this.jobOrders.length;
  },
  watch: {
    keyword: debounce(function(oldKeyword, newKeyword) {
      if (newKeyword !== "" && newKeyword !== oldKeyword) {
        this.getCallerInteraction();
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

<template>
  <div>
    <div class="card">
      <div class="card-header bg-transparent border-0">
        <h3 class="mb-0">Job Order Request</h3>
      </div>
      <b-container fluid>
        <b-card no-body>
          <b-tabs
            v-model="tabIndex"
            card
            v-if="this.$auth.user.designation_category == 'staff'"
          >
            <b-tab title="Job order(Postpaid)" :title-link-class="linkClass(0)">
              <job-order-postpaid></job-order-postpaid>
            </b-tab>
            <b-tab title="Job order(Prepaid)" :title-link-class="linkClass(1)"
              ><job-order-prepaid></job-order-prepaid
            ></b-tab>
          </b-tabs>

          <div
            v-if="
              this.$auth.user.designation_category != 'staff' &&
                this.$auth.user.account_type == 'postpaid'
            "
          >
            <job-order-postpaid></job-order-postpaid>
          </div>
          <div
            v-else-if="
              this.$auth.user.designation_category != 'staff' &&
                this.$auth.user.account_type == 'prepaid'
            "
          >
            <job-order-prepaid></job-order-prepaid>
          </div>
        </b-card>
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
import JobOrderPostpaid from "@/components/JobOrder/Postpaid/JobOrderList";

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
    JobOrderPostpaid,
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
              this.fetchJobOrders();
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

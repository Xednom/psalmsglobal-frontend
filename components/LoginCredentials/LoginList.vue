<template>
  <div>
    <div class="card">
      <div class="card-header bg-transparent border-0">
        <h3 class="mb-0">Login Credentials</h3>
      </div>
      <b-container fluid>
        <!-- User Interface controls -->

        <b-row>
          <b-col></b-col>
          <b-col lg="2" class="my-1">
            <base-button
              class="btn-job-order"
              size="md"
              type="neutral"
              @click="modals.form = true"
              v-if="$auth.user.designation_category != 'staff'"
              >Create a Login credential</base-button
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
          :items="logins"
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
          responsive
        >
          <template #cell(from)="row">
            {{ row.item.form_scripts }}
          </template>

          <template #cell(recurring_bill)="row">
            <div v-if="row.item.recurring_bill">
              <b-icon icon="check-circle-fill" variant="success"></b-icon>
            </div>
            <div v-else>
              <b-icon icon="x-circle-fill" variant="danger"></b-icon>
            </div>
          </template>

          <template #cell(url)="row">
            <a :href="row.item.url" target="_blank">{{ row.item.url }}</a>
          </template>

          <template #cell(status)="row">
            <div v-if="row.item.status">
              <b-icon icon="check-circle-fill" variant="success"></b-icon>
            </div>
            <div v-else>
              <b-icon icon="x-circle-fill" variant="danger"></b-icon>
            </div>
          </template>
          <template #cell(notes)="row">
            <span style="white-space=preline;">
              {{ row.item.notes }}
            </span>
          </template>

          <template #cell(actions)="row">
            <b-button
              v-b-modal.modal-view
              size="sm"
              @click="
                {
                  fetchLogin(row.item.id);
                }
              "
              >View</b-button
            >
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

    <!--Form modal-->
    <modal :show.sync="modals.form" size="lg" body-classes="p-0">
      <h6 slot="header" class="modal-title">Create a Login</h6>
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
                  label="Category"
                  alternative
                  class="mb-3"
                  placeholder="Category"
                  v-model="category"
                >
                </base-input>
              </div>
              <div class="col-md-6">
                <base-input
                  label="URL"
                  alternative
                  class="mb-3"
                  placeholder="URL"
                  v-model="url"
                >
                </base-input>
              </div>
              <div class="col-md-6">
                <base-input
                  label="Username"
                  alternative
                  class="mb-3"
                  placeholder="Username"
                  v-model="username"
                >
                </base-input>
              </div>
              <div class="col-md-6">
                <base-input
                  label="Password"
                  alternative
                  class="mb-3"
                  placeholder="Password"
                  v-model="password"
                >
                </base-input>
              </div>
              <div class="col-md-12">
                <base-input label="Notes">
                  <textarea
                    class="form-control"
                    id="fileDescription"
                    rows="3"
                    v-model="notes"
                    placeholder="Notes"
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
    <!-- info modal -->
    <b-modal size="lg" id="modal-view" :title="'Login credentials - '+login.category" hide-footer>
      <login-view :login="login"></login-view>
    </b-modal>
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

import LoginView from "@/components/LoginCredentials/LoginView";

import CreateLoginMixin from "@/mixins/CreateLoginMixin.js";

export default {
  name: "login_credential_list",
  mixins: [CreateLoginMixin],
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    LoginView
  },
  computed: {
    ...mapGetters({
      logins: "loginCredentials/loginCredentials",
      login: "loginCredentials/loginCredential",
      pagination: "loginCredentials/loginCredentialsPagination",
      user: "user/user",
      client: "user/clientUser"
    }),
    category: {
      get() {
        return this.$store.getters[
          "loginCredentials/category"
        ];
      },
      set(value) {
        this.setBasicStoreValue("category", value);
      }
    },
    url: {
      get() {
        return this.$store.getters[
          "loginCredentials/url"
        ];
      },
      set(value) {
        this.setBasicStoreValue("url", value);
      }
    },
    username: {
      get() {
        return this.$store.getters[
          "loginCredentials/username"
        ];
      },
      set(value) {
        this.setBasicStoreValue("username", value);
      }
    },
    password: {
      get() {
        return this.$store.getters[
          "loginCredentials/password"
        ];
      },
      set(value) {
        this.setBasicStoreValue("password", value);
      }
    },
    notes: {
      get() {
        return this.$store.getters[
          "loginCredentials/notes"
        ];
      },
      set(value) {
        this.setBasicStoreValue("notes", value);
      }
    },
  },
  data() {
    return {
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
        { key: "client", sortable: true },
        { key: "category", sortable: true },
        { key: "url", sortable: true },
        { key: "username", sortable: true },
        { key: "actions", sortable: true }
      ]
    };
  },
  methods: {
    ...mapActions("loginCredentials", ["reset", "saveLogin"]),
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
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
        const loginPayload = {
          client: this.client.client_code,
          category: this.category,
          url: this.url,
          notes: this.notes,
          username: this.username,
          password: this.password
        };
        try {
          this.saving = true;
          await this.saveLogin(loginPayload)
            .then(() => {
              this.saving = false;
              this.reset();
              this.successMessage("success");
              this.fetchLogins();
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
    async fetchLogins() {
      this.isBusy = true;
      try {
        await this.$store
          .dispatch("loginCredentials/fetchLoginCredentials", this.pagination)
          .then(() => {
            this.isBusy = false;
            this.totalRows = this.logins.length;
          });
      } catch (e) {
        errorMessage("danger", e);
      }
    },
    async fetchLogin(login) {
      this.isBusy = true;
      try {
        await this.$store
          .dispatch("loginCredentials/fetchLoginCredential", login)
          .then(() => {
            this.isBusy = false;
          });
      } catch (e) {
        errorMessage("danger", e);
      }
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully added a new Login Credentials", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.client
          ? "Client: " + error.client
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
    this.fetchLogins();
    this.fetchMe();
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

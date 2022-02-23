<template>
  <div>
    <div class="card">
      <b-container fluid>
        <!-- User Interface controls -->
        <b-row>
          <b-col></b-col>
          <b-col lg="6" class="my-1">
            <nuxt-link to="/forum/create"
              ><base-button
                class="btn-job-order create-button mt-3"
                size="md"
                type="neutral"
                @click="modals.form = true"
                v-if="$auth.user.designation_category != 'staff'"
                >Create a Thread</base-button
              ></nuxt-link
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
          :items="threads"
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

          <template #cell(title)="row">
            <nuxt-link :to="'/forum/' + row.item.id">{{
              row.item.title
            }}</nuxt-link>
          </template>

          <template #cell(is_active)="row">
            <span v-if="row.item.is_active">
              <b-badge variant="success">active</b-badge>
            </span>
            <span v-else>
              <b-badge variant="danger">inactive</b-badge>
            </span>
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
import ForumMixin from "@/mixins/ForumMixin.js";

import { mapGetters } from "vuex";

export default {
  name: "forum-list",
  mixins: [ForumMixin],
  components: {},
  data() {
    return {
      totalRows: 1,
      currentPage: 1,
      perPage: 15,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      isBusy: false,
      filter: null,
      posting: false,
      show: false,
      fields: [
        { key: "title", sortable: true },
        { key: "author_username", label: "author", sortable: true },
        { key: "is_active", label: "status", sortable: true }
      ],
      modals: {
        form: false,
        update: false
      }
    };
  },
  computed: {
    ...mapGetters({
      threads: "forum/threads",
      pagination: "forum/forumsPagination",
      staff: "user/staff",
      user: "user/user",
      client: "user/clientUser"
    })
  },
  methods: {
    async fetchThreads() {
      this.show = true;
      await this.$store.dispatch("forum/fetchThreads").then(() => {
        this.totalRows = this.threads.length;
        this.show = false;
      });
    },
    async fetchThread(id) {
      await this.$store.dispatch("forum/fetchThread", id).then(() => {});
    },
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
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.title
          ? "Title: " + error.title
          : error.content
          ? "Content: " + error.content
          : error.author
          ? "Author: " + error.author
          : error.staff_carbon_copy
          ? "Staff carbon copy: " + error.staff_carbon_copy
          : error.client_carbon_copy
          ? "Client carbon copy: " + error.client_carbon_copy
          : error.is_active
          ? "Active: " + error.is_active
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
  async mounted() {
    await this.fetchThreads();
  }
};
</script>
<style>
.create-button {
  float: right;
}
</style>

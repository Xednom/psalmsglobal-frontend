<template>
  <div>
    <div class="card">
      <b-container fluid>
        <!-- User Interface controls -->
        <b-row>
          <b-col></b-col>
          <b-col lg="6" class="my-1">
            <nuxt-link to="/resolution/create"
              ><base-button
                class="btn-job-order create-button mt-3"
                size="md"
                type="neutral"
                @click="modals.form = true"
                v-if="$auth.user.designation_category != 'staff'"
                >Create a Resolution</base-button
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
          :items="resolutions"
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

          <template #cell(id)="row">
            <nuxt-link :to="'/resolution/' + row.item.id">{{
              row.item.id
            }}</nuxt-link>
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
import ResolutionMixin from "@/mixins/ResolutionMixin";

import { mapGetters } from "vuex";

export default {
  name: "resolutions-list",
  mixins: [ResolutionMixin],
  components: {},
  data() {
    return {
      totalRows: 1,
      currentPage: 1,
      perPage: 100,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      isBusy: false,
      filter: null,
      posting: false,
      show: false,
      fields: [
        { key: "id", sortable: true },
        { key: "category", sortable: true },
        { key: "description", sortable: true },
        { key: "status", sortable: true }
      ],
      modals: {
        form: false,
        update: false
      }
    };
  },
  computed: {
    ...mapGetters({
      resolutions: "resolution/resolutions",
      pagination: "resolution/resolutionsPagination",
      staff: "user/staff",
      user: "user/user",
      client: "user/clientUser"
    })
  },
  methods: {
    async fetchResolutions() {
      this.show = true;
      await this.$store.dispatch("resolution/fetchResolutions").then(() => {
        this.totalRows = this.resolutions.length;
        this.show = false;
      });
    },
    async fetchNewsFeed(id) {
      await this.$store.dispatch("newsfeed/fetchNewsFeed", id).then(() => {});
    },
    async save() {
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        this.loading = true;
        if (
          this.$auth.user.designation_category == "new_client" ||
          this.$auth.user.designation_category == "current_client" ||
          this.$auth.user.designation_category == "affiliate_partner"
        ) {
          try {
            await this.$axios
              .post(`/api/v1/newsfeed/${this.newsFeed.id}/comment/`, {
                comment: this.comment
              })
              .then(() => {
                this.loading = false;
                this.success = true;
                this.comment = "";
                this.fetchNewsFeeds();
              });
          } catch (err) {
            console.log(err);
            this.success = false;
            this.error = err;
            this.errorMessage(this.error);
          }
        } else {
          const payload = {
            job_order_comments: {
              newsfeed: this.newsFeed.id,
              user: this.$auth.user.id,
              comment: this.comment
            }
          };
          await this.$axios
            .post(`/api/v1/newsfeed/${this.newsFeed.id}/comment/`, {
              comment: this.comment
            })
            .then(() => {
              this.loading = false;
              this.success = true;
              this.comment = "";
              this.fetchNewsFeeds();
            });
          this.fetchNewsFeeds();
        }
      }
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
    errorMessage(error) {
      if (error.newsfeed) {
        return "newsfeed: " + this.error.newsfeed;
      } else if (error.user) {
        return "User: " + this.error.user;
      } else if (error.comment) {
        return "Comment: " + this.error.comment;
      } else if (error.non_field_errors) {
        return this.error.non_field_errors;
      }
    }
  },
  async mounted() {
    await this.fetchResolutions();
  }
};
</script>
<style>
.create-button {
  float: right;
}
</style>

<template>
  <div>
    <div class="card">
      <div class="card-header bg-transparent border-0">
        <div class="col-8">
          <h3 class="mb-0">Property Info list</h3>
        </div>
      </div>

      <b-container fluid>
        <!-- User Interface controls -->
        <b-row>
          <b-col></b-col>
          <b-col lg="6" class="my-1 text-right">
            <base-button
              class="btn-job-order"
              size="md"
              type="success"
              @click="modals.upload = true"
              >Upload</base-button
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
          :items="propertyInfos"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          :busy="isBusy"
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
          <template #table-busy>
            <div class="text-center text-default my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template #cell(apn)="row">
            <nuxt-link :to="'/callme-info/' + row.item.apn">{{
              row.item.ticket_number
            }}</nuxt-link>
          </template>
          <template #cell(company_name)="row">
            <b-button
              size="sm"
              @click="
                {
                  (modals.info = true), fetchCallMeInfo(row.item.id);
                }
              "
              class="mr-1"
            >
              <i class="ni ni-building"></i>
              {{ row.item.company_name }}
            </b-button>
          </template>
        </b-table>

        <modal size="lg" :show.sync="modals.upload">
          <base-input
            label="Excel file"
            alternative
            class="mb-3"
            placeholder="Excel file"
            prepend-icon="ni ni-briefcase-24"
            v-model="file"
          >
          </base-input>
          <div class="text-center">
            <base-button
              type="primary"
              native-type="submit"
              loading
              v-if="uploading"
              >Parsing</base-button
            >
            <base-button type="primary" native-type="submit" v-else @click="parseFile"
              >Parse</base-button
            >
          </div>
        </modal>

        <modal size="lg" :show.sync="modals.info">
          <h6 slot="header" class="modal-title">
            CallMe information
          </h6>
          <form @submit.prevent="save">
            <div id="callme-info" class="col-lg-12">
              <b-card-text>
                <div class="row">
                  <div class="col-lg-4">
                    <base-input
                      label="Company owner name"
                      alternative
                      class="mb-3"
                      placeholder="Company owner name"
                      prepend-icon="ni ni-building"
                      v-model="callMeInfo.company_name"
                      disabled
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-4">
                    <base-input
                      label="APN"
                      alternative
                      class="mb-3"
                      placeholder="APN"
                      v-model="callMeInfo.apn"
                      disabled
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-4">
                    <base-input
                      label="Reference"
                      alternative
                      class="mb-3"
                      placeholder="Reference"
                      v-model="callMeInfo.reference"
                      disabled
                    >
                    </base-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6">
                    <base-input
                      label="First name"
                      alternative
                      class="mb-3"
                      placeholder="First name"
                      v-model="callMeInfo.first_name"
                      disabled
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input
                      label="Last name"
                      alternative
                      class="mb-3"
                      placeholder="Last name"
                      v-model="callMeInfo.last_name"
                      disabled
                    >
                    </base-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <base-input label="Short Legal Description">
                      <textarea
                        class="form-control"
                        id="notes"
                        rows="3"
                        v-model="callMeInfo.short_legal_description"
                        disabled
                      ></textarea>
                    </base-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-3">
                    <base-input
                      label="Property City"
                      alternative
                      class="mb-3"
                      placeholder="Property City"
                      v-model="callMeInfo.property_city"
                      disabled
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-3">
                    <base-input
                      label="Property State"
                      alternative
                      class="mb-3"
                      placeholder="Property State"
                      v-model="callMeInfo.property_state"
                      disabled
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-3">
                    <base-input
                      label="Property County"
                      alternative
                      class="mb-3"
                      placeholder="Property County"
                      v-model="callMeInfo.property_county"
                      disabled
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-3">
                    <base-input
                      label="Property Zip"
                      alternative
                      class="mb-3"
                      placeholder="Property Zip"
                      v-model="callMeInfo.property_zip"
                      disabled
                    >
                    </base-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <base-input label="Property Address">
                      <textarea
                        class="form-control"
                        id="notes"
                        rows="3"
                        v-model="callMeInfo.property_address"
                        disabled
                      ></textarea>
                    </base-input>
                  </div>
                </div>
                <h6 class="heading-small text-muted mb-4">
                  Buyer offer info
                </h6>
                <div class="row">
                  <div class="col-lg-6">
                    <base-input label="Buyer offer amount">
                      <textarea
                        class="form-control"
                        id="notes"
                        rows="3"
                        v-model="callMeInfo.buyer_offer_amount"
                        disabled
                      ></textarea>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Approved option amount">
                      <textarea
                        class="form-control"
                        id="notes"
                        rows="3"
                        v-model="callMeInfo.approved_option_amount"
                        disabled
                      ></textarea>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Other terms">
                      <textarea
                        class="form-control"
                        id="notes"
                        rows="3"
                        v-model="callMeInfo.other_terms"
                        disabled
                      ></textarea>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Approved option amount">
                      <textarea
                        class="form-control"
                        id="notes"
                        rows="3"
                        v-model="callMeInfo.approved_option_amount"
                        disabled
                      ></textarea>
                    </base-input>
                  </div>
                </div>
                <h6 class="heading-small text-muted mb-4">
                  Seller counter offer
                </h6>
                <div class="row">
                  <div class="col-lg-6">
                    <base-input label="Seller offer amount">
                      <textarea
                        class="form-control"
                        id="notes"
                        rows="3"
                        v-model="callMeInfo.seller_offer_amount"
                      ></textarea>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Other offer terms">
                      <textarea
                        class="form-control"
                        id="notes"
                        rows="3"
                        v-model="callMeInfo.other_offer_terms"
                      ></textarea>
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <base-input label="Notes">
                      <textarea
                        class="form-control"
                        id="notes"
                        rows="3"
                        v-model="callMeInfo.notes"
                      ></textarea>
                    </base-input>
                  </div>
                  <div class="col-lg-6">
                    <base-input label="Offer status">
                      <el-select
                        v-model="callMeInfo.offer_status"
                        filterable
                        placeholder="Choose a Status"
                        rules="required"
                      >
                        <el-option
                          v-for="option in offerStatuses"
                          :key="option.id"
                          :label="option.name"
                          :value="option.name"
                        >
                        </el-option>
                      </el-select>
                    </base-input>
                  </div>
                  <div class="col-lg-12">
                    <base-input label="Offer status note">
                      <textarea
                        class="form-control"
                        id="notes"
                        rows="3"
                        v-model="callMeInfo.offer_status_notes"
                      ></textarea>
                    </base-input>
                  </div>
                </div>
              </b-card-text>
            </div>
            <base-button
              type="secondary"
              native-type="submit"
              loading
              v-if="saving"
              >Update</base-button
            >
            <base-button type="primary" native-type="submit" v-else
              >Update</base-button
            >
          </form>
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
import {
  Table,
  TableColumn,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Select,
  Option
} from "element-ui";
import DropzoneFileUpload from "@/components/argon-core/Inputs/DropzoneFileUpload";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "callme_list",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Select.name]: Select,
    [Option.name]: Option,
    DropzoneFileUpload
  },
  computed: {
    ...mapGetters({
      propertyInfos: "callMeInfo/propertyInfos",
      pagination: "callMeInfo/propertyInfosPagination",
      user: "user/user",
      client: "user/clientUser"
    })
  },
  data() {
    return {
      file: null,
      callMeInfo: {},
      callMeInfos: [],
      offerStatuses: [],
      inputs: {
        fileSingle: []
      },
      isBusy: false,
      saving: false,
      uploading: false,
      modals: {
        upload: false
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
        { key: "company_name", label: "Company", sortable: true },
        { key: "apn", sortable: true },
        { key: "reference", sortable: true },
        { key: "full_name", sortable: true },
        { key: "property_state", sortable: true },
        { key: "property_county", sortable: true },
        { key: "property_city", sortable: true }
      ]
    };
  },
  methods: {
    ...mapActions("callMeInfo", ["reset", "updateCallMeInfo", "upload"]),
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async fetchPropertyInfos() {
      this.isBusy = true;
      await this.$store
        .dispatch("callMeInfo/fetchPropertyInfos", this.pagination)
        .then(() => {
          this.isBusy = false;
        });
    },
    async parseFile() {
      var data = new FormData();
      data.append("file", this.file);
      if (
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        this.uploading = true;
        console.log(this.file);
        await this.upload(data)
          .then(() => {
            this.uploading = false;
            this.fetchPropertyInfos();
            this.successUploadMessage("success");
          })
          .catch(e => {
            this.uploading = false;
            this.errorMessage("danger", e.response.data);
          });
      }
    },
    async save() {
      const propertyPayload = {
        id: this.callMeInfo.id,
        company: this.callMeInfo.company,
        apn: this.callMeInfo.apn,
        reference: this.callMeInfo.reference,
        seller_offer_amount: this.callMeInfo.seller_offer_amount,
        other_offer_terms: this.callMeInfo.other_offer_terms,
        notes: this.callMeInfo.notes,
        offer_status: this.callMeInfo.offer_status,
        offer_status_notes: this.callMeInfo.offer_status_notes
      };

      if (this.$auth.user.designation_category == "staff") {
        try {
          this.saving = true;
          await this.updateCallMeInfo(propertyPayload);
          this.saving = false;
          this.successMessage("success");
        } catch (e) {
          console.log(e);
        }
      }
    },
    async fetchOfferStatus() {
      let endpoint = `/api/v1/offer-status/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.offerStatuses = res.data.results;
        })
        .catch(e => {
          console.log(e);
        });
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully updated this Property Info!", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
    },
    successUploadMessage(variant = null) {
      this.$bvToast.toast("Successfully parsed your Property Info!", {
        title: `Successful`,
        variant: variant,
        solid: true
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
  async mounted() {
    await this.fetchPropertyInfos();
    this.totalRows = this.propertyInfos.length;
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

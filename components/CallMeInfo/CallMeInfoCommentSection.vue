<template>
  <div id="comment-section">
    <div class="col-md-12">
      <form @submit.prevent="save">
        <div class="form-row">
          <div class="col-sm-12 col-md-12">
            <textarea
              v-if="typeOfComment == 'customer'"
              class="form-control"
              placeholder="Comment"
              v-model="comment_offer_tab_customer"
              :rules="{ required: true }"
            >
            </textarea>
            <textarea
              v-if="typeOfComment == 'client'"
              class="form-control"
              placeholder="Comment"
              v-model="comment_offer_tab_client"
              :rules="{ required: true }"
            >
            </textarea>
            <textarea
              v-if="typeOfComment == 'agent'"
              class="form-control"
              placeholder="Comment"
              v-model="comment_sales_agent_notes"
              :rules="{ required: true }"
            >
            </textarea>
          </div>
        </div>
        <!-- <div class="form-row">
          <div class="col-sm-12 col-md-12">
            <textarea
              class="form-control"
              placeholder="Comment"
              v-model="comment"
              :rules="{ required: true }"
            >
            </textarea>
          </div>
        </div> -->

        <div slot="footer">
          <div class="pull-right mt-3 mb-3">
            <base-button
              v-if="!loading"
              native-type="submit"
              slot="footer"
              type="primary"
              size="sm"
            >
              Post
            </base-button>
            <base-button
              v-else
              native-type="submit"
              slot="footer"
              type="primary"
              size="sm"
              disabled
            >
              Posting...
            </base-button>
          </div>
        </div>
      </form>
      <div class="form-row" v-if="typeOfComment == 'agent'">
        <base-table
          :data="item.property_info_comment_tab_agents"
          thead-classes="text-primary"
        >
          <template slot-scope="{ row }">
            <td>
              <blockquote class="blockquote">
                <p class="mb-0 comment-section">
                  {{ row.comment }}
                </p>
                <footer class="blockquote-footer">
                  {{ row.commenter }}
                  commented at <strong>{{ row.created_at }}</strong>
                </footer>
              </blockquote>
            </td>
          </template>
        </base-table>
      </div>
      <div class="form-row" v-if="typeOfComment == 'client'">
        <base-table
          :data="item.property_info_comment_tab_clients"
          thead-classes="text-primary"
        >
        {{ item.property_info_comment_tab_clients }}
          <template slot-scope="{ row }">
            <td>
              <blockquote class="blockquote">
                <p class="mb-0 comment-section">
                  {{ row.comment }}
                </p>
                <footer class="blockquote-footer">
                  {{ row.commenter }}
                  commented at <strong>{{ row.created_at }}</strong>
                </footer>
              </blockquote>
            </td>
          </template>
        </base-table>
      </div>
      <div class="form-row" v-if="typeOfComment == 'customer'">
        <base-table
          :data="item.property_info_comment_tab_customers"
          thead-classes="text-primary"
        >
          <template slot-scope="{ row }">
            <td>
              <blockquote class="blockquote">
                <p class="mb-0 comment-section">
                  {{ row.comment }}
                </p>
                <footer class="blockquote-footer">
                  {{ row.commenter }}
                  commented at <strong>{{ row.created_at }}</strong>
                </footer>
              </blockquote>
            </td>
          </template>
        </base-table>
      </div>
    </div>
  </div>
</template>
  
  <script>
import BaseTable from "~/components/argon-core/BaseTable.vue";

// import CreateCustomeritemMixin from "@/mixins/CreatePostPaiditemMixin.js";

export default {
  components: {
    BaseTable,
  },
  //   mixins: [CreateCustomeritemMixin],
  props: {
    item: {
      type: Object,
      description: "The Item object",
    },
    user: {
      type: String,
      description: "User info",
    },
    accountType: {
      type: String,
      description: "Company's user account type",
    },
    typeAccount: {
      type: String,
    },
    typeOfComment: {
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      saving: false,
      error: "",
    };
  },
  methods: {
    async refreshPropertyInfo(payload) {
      let endpoint = `/api/v1/callme-info/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.item = res.data;
        })
        .catch((e) => {
          console.log(e);
          throw e;
        });
    },
    async save() {
      this.loading = true;
      console.info("user: ", this.$auth.user);
      console.info("type of comment: ", this.typeOfComment);
      try {
        if (this.typeOfComment == "customer") {
          console.warn("Commented");
          await this.$axios.post(
            `/api/v1/property-info/${this.item.id}/customer-comment/`,
            {
              comment: this.comment_offer_tab_customer,
            }
          );
          this.loading = false;
          this.success = true;
          this.comment_offer_tab_customer = "";
          this.refreshPropertyInfo(this.item.id);
        }
        if (this.typeOfComment == "client") {
          console.warn("Commented");
          await this.$axios.post(
            `/api/v1/property-info/${this.item.id}/client-comment/`,
            {
              comment: this.comment_offer_tab_client,
            }
          );
          this.loading = false;
          this.success = true;
          this.comment_offer_tab_client = "";
          this.refreshPropertyInfo(this.item.id);
        }
        if (this.typeOfComment == "agent") {
          console.warn("Commented");
          await this.$axios.post(
            `/api/v1/property-info/${this.item.id}/agent-comment/`,
            {
              comment: this.comment_sales_agent_notes,
            }
          );
          this.loading = false;
          this.success = true;
          this.comment_sales_agent_notes = "";
          this.refreshPropertyInfo(this.item.id);
        }
      } catch (err) {
        console.log(err);
        this.success = false;
        this.loading = false;
        this.error = err.response.data;
        this.errorMessage("danger", this.error);
      }
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.customer_item_post_paid
          ? "Customer item: " + error.customer_item_post_paid
          : error.customer_item_prepaid
          ? "Customer item: " + error.customer_item_prepaid
          : error.detail
          ? "Detail: " + error.detail
          : error.comment
          ? "Comment: " + error.comment
          : error.non_field_errors
          ? error.non_field_errors
          : error,
        {
          title: `Error`,
          variant: variant,
          solid: true,
        }
      );
    },
    setBasicStoreValue(fieldName, value) {
      this.$store.commit("callMeInfo/setBasicField", {
        field: fieldName,
        value: value,
      });
    },
  },
  computed: {
    comment_offer_tab_customer: {
      get() {
        return this.$store.getters["callMeInfo/comment_offer_tab_customer"];
      },
      set(value) {
        this.setBasicStoreValue("comment_offer_tab_customer", value);
      },
    },
    comment_offer_tab_client: {
      get() {
        return this.$store.getters["callMeInfo/comment_offer_tab_client"];
      },
      set(value) {
        this.setBasicStoreValue("comment_offer_tab_client", value);
      },
    },
    comment_sales_agent_notes: {
      get() {
        return this.$store.getters["callMeInfo/comment_sales_agent_notes"];
      },
      set(value) {
        this.setBasicStoreValue("comment_sales_agent_notes", value);
      },
    },
  },
};
</script>
  
  ,<style scoped>
.comment-section {
  white-space: normal;
}
</style>
  
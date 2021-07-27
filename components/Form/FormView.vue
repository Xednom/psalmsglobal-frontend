<template>
  <div>
    <div class="card">
      <div class="container mt-2" v-if="form.attribute_forms">
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
                <span v-dompurify-html="form.value_text"></span>
              </div>
              <div class="mb-3" v-else-if="form.data_type == 'question'">
                <p>
                  <span
                    ><div v-dompurify-html="form.value_question">></div></span
                  >
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
    form: {
      Type: Object,
      default: null,
      description: "Form view data"
    }
  },
  data() {
    return {
      limit: 10000,
      forms: [],
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
    },
    valueText() {
      this.form.attribute_forms.forEach(item => {
        console.log(item.value_text);
        return this.$sanitize(item.value_text);
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
    copyThreadInfoToClipboard(id) {
      var copyText = document.getElementById(id).innerText;
      var input_temp = document.createElement("textarea");
      input_temp.innerHTML = copyText;
      document.body.appendChild(input_temp);
      input_temp.select();
      input_temp.setSelectionRange(0, 99999); /*For mobile devices*/
      document.execCommand("copy");
      document.body.removeChild(input_temp);
      this.copySuccess("success");
    },
    emitForm() {
      this.$emit("form-script", this.form);
      this.emitSuccess("success");
    },
    emitSuccess(variant = null) {
      this.$bvToast.toast(`Successfully emitted the script`, {
        title: "Success",
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
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

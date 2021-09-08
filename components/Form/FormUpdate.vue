<template>
  <b-overlay :show="show" rounded="sm">
    <div class="row">
      <div class="col-xl-12 col-md-12 col-sm-12">
        <card>
          <div slot="header" class="row align-items-center">
            <div class="col-8">
              <h3 class="mb-0">Update Form attribute for a Company</h3>
            </div>
            <div class="col-4 text-right">
              <nuxt-link to="/form/">
                <base-button type="info"
                  >Back to Form list</base-button
                ></nuxt-link
              >
            </div>
          </div>
          <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
            <form @submit.prevent="handleSubmit(save)">
              <h6 class="heading-small text-muted mb-4">
                Form attribute information
              </h6>

              <div class="pl-lg-4">
                <div class="row">
                  <div class="col-lg-4">
                    <base-input label="Company">
                      <el-select
                        v-model="form.company"
                        filterable
                        placeholder="Choose a Company"
                        rules="required"
                      >
                        <el-option
                          v-for="option in companies"
                          :key="option.id"
                          :label="option.company"
                          :value="option.company_name"
                        >
                        </el-option>
                      </el-select>
                    </base-input>
                  </div>
                  <div class="col-lg-4">
                    <base-input
                      type="text"
                      label="Form Title"
                      placeholder="Form Title"
                      name="Form Title"
                      v-model="form.form_title"
                      rules="required"
                    >
                    </base-input>
                  </div>
                  <div class="col-lg-4">
                    <label for="tags-separators">Mailing Lists</label>
                    <b-form-tags
                      input-id="tags-separators"
                      v-model="form.mailing_lists"
                      separator=" ,;"
                      placeholder="Enter new email"
                      remove-on-delete
                      name="Mailing lists"
                      required
                    ></b-form-tags>
                    <small class="text-muted"
                      >Enter new email separated by space</small
                    >
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-1 mt-4">
                    <base-checkbox v-model="form.status" class="mb-3">
                      Status
                    </base-checkbox>
                  </div>
                </div>
              </div>
              <hr class="my-4" />

              <div class="pl-lg-4">
                <div>
                  <h6 class="heading-small text-muted mb-4">
                    Form Attribute
                  </h6>
                </div>

                <div class="text-right">
                  <b-button variant="primary" @click="modals.view = true"
                    >View your Form</b-button
                  >
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <draggable
                      v-model="form.attribute_forms"
                      group="people"
                      @start="drag = true"
                      @end="drag = false"
                    >
                      <div v-for="item in form.attribute_forms" :key="item.id">
                        <div class="card">
                          <div class="col-sm-12 col-md-3 mt-3">
                            <base-input label="Data Type">
                              <el-select
                                v-model="item.data_type"
                                filterable
                                placeholder="Choose a data type"
                                rules="required"
                              >
                                <el-option
                                  v-for="option in dataTypeOptions"
                                  :key="option.id"
                                  :label="option.label"
                                  :value="option.value"
                                >
                                </el-option>
                              </el-select>
                            </base-input>
                          </div>
                          <div
                            class="col-xs-12 col-md-12 mb-3"
                            v-if="item.data_type == 'text'"
                          >
                            <label>Text</label>
                            <html-editor
                              v-model="item.value_text"
                            ></html-editor>
                          </div>
                          <div
                            class="col-sm-12 col-md-12 mb-3"
                            v-if="item.data_type == 'question'"
                          >
                            <label>Question</label>
                            <html-editor
                              v-model="item.value_question"
                            ></html-editor>
                          </div>
                        </div>
                      </div>
                    </draggable>
                    <div class="row">
                      <div class="col-xs-12">
                        <button
                          type="button"
                          class="btn btn-success mt-4 mb-4"
                          @click="addRow"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
            </form>
          </validation-observer>
        </card>
      </div>

      <modal :show.sync="modals.view" size="lg" body-classes="p-0">
        <form-view :form="form"></form-view>
      </modal>
    </div>
  </b-overlay>
</template>

<script>
import { Select, Option } from "element-ui";
import { mapGetters, mapActions } from "vuex";

import CreateFormMixin from "@/mixins/CreateFormMixin.js";

import HtmlEditor from "@/components/argon-core/Inputs/HtmlEditor";
import FormView from "@/components/Form/FormView";

import draggable from "vuedraggable";

export default {
  name: "crm_list",
  mixins: [CreateFormMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    HtmlEditor,
    FormView,
    draggable
  },
  computed: {
    ...mapGetters({
      companies: "company/companies",
      pagination: "company/companiesPagination",
      user: "user/user",
      client: "user/company"
    })
  },
  data() {
    return {
      form: {},
      isBusy: false,
      saving: false,
      show: false,
      modals: {
        view: false
      },
      attribute_forms: [],
      dataTypeOptions: [
        { value: "text", label: "Text" },
        { value: "question", label: "Question" }
      ]
    };
  },
  methods: {
    ...mapActions("form", ["reset", "updateForm"]),
    async fetchCompanies() {
      this.isBusy = true;
      await this.$store
        .dispatch("company/fetchCompanies", this.pagination)
        .then(() => {
          this.isBusy = false;
        });
    },
    async fetchForm(payload) {
      this.loading = true;
      this.show = true;
      let endpoint = `/api/v1/form/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          this.loading = false;
          this.show = false;
          this.form = res.data;
        })
        .catch(e => {
          this.loading = false;
          this.show = false;
          console.log(e);
          throw e;
        });
    },
    async fetchClient(id) {
      let endpoint = `/api/auth/client/${id}/`;
      try {
        await this.$axios.get(endpoint).then(res => {
          this.clientUser = res.data;
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async save() {
      const formPayload = {
        id: this.form.id,
        company: this.form.company,
        form_title: this.form.form_title,
        status: this.form.status,
        mailing_lists: this.form.mailing_lists,
        attribute_forms: this.form.attribute_forms
      };

      if (
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        try {
          this.saving = true;
          await this.updateForm(formPayload)
            .then(() => {
              this.saving = false;
              this.reset();
              this.successMessage("success");
            })
            .catch(e => {
              this.saving = false;
              this.error = e.response.data;
              this.errorMessage("danger", this.error);
            });
        } catch (e) {
          this.saving = false;
          this.error = e.response.data;
          this.errorMessage("danger", this.error);
        }
      }
      this.saving = false;
    },
    successMessage(variant = null) {
      this.$bvToast.toast(
        "Successfully updated a Form attribute information!",
        {
          title: `Successful`,
          variant: variant,
          solid: true
        }
      );
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.client
          ? "Company: " + error.client
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
    },
    addRow: function() {
      this.form.attribute_forms.push({
        data_type: "",
        value_text: "",
        value_question: ""
      });
    },
    deleteRow: function(e, item) {
      e.preventDefault();
      var index = this.form.attribute_forms
        .map(function(item) {
          console.log(item);
          return item;
        })
        .indexOf(item);
      this.form.attribute_forms.splice(index, 1);
    }
  },
  mounted() {
    this.fetchCompanies();
    this.fetchForm(this.$route.params.id);
    if (
      this.$auth.user.designation_category == "new_client" ||
      this.$auth.user.designation_category == "current_client" ||
      this.$auth.user.designation_category == "affiliate_partner"
    ) {
      this.fetchClient(this.$auth.user.id);
    }
  }
};
</script>

<style scoped>
.company-info {
  float: right;
}
</style>

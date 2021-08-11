<template>
  <div class="row">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <card>
        <div slot="header" class="row align-items-center">
          <div class="col-8">
            <h3 class="mb-0">Add new Form attribute for a Company</h3>
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
              Script information
            </h6>

            <div class="pl-lg-4">
              <div class="row">
                <div class="col-lg-3">
                  <label>Company</label>
                  <vue-typeahead-bootstrap
                    class="mb-4"
                    v-model="company"
                    :ieCloseFix="false"
                    :data="companies"
                    :serializer="item => item.company_name"
                    @hit="selectedCompany = $event"
                    :disabledValues="
                      selectedCompany ? [selectedCompany.company_name] : []
                    "
                    placeholder="Search a Company"
                    @input="getCompany"
                  />
                </div>
                <div class="col-lg-4">
                  <base-input
                    type="text"
                    label="Form Title"
                    placeholder="Form Title"
                    name="Form Title"
                    v-model="form_title"
                    rules="required"
                  >
                  </base-input>
                </div>
                <div class="col-lg-4">
                  <label for="tags-separators">Mailing Lists</label>
                  <b-form-tags
                    input-id="tags-separators"
                    v-model="mailing_lists"
                    separator=" ,;"
                    placeholder="Enter new email"
                    remove-on-delete
                    name="Mailing lists"
                    required
                  ></b-form-tags>
                  <small class="text-muted"
                    >Enter new email separated by space, comma or
                    semicolon</small
                  >
                </div>
              </div>
            </div>
            <hr class="my-4" />

            <div class="pl-lg-4">
              <h6 class="heading-small text-muted mb-4">
                Form Attribute
              </h6>
              <div class="row">
                <div class="col-lg-12">
                  <div v-for="(item, index) in attribute_forms" :key="index">
                    <div class="row">
                      <div class="col-xs-1">
                        <button
                          class="btn btn-link"
                          @click="deleteRow($event, item.id)"
                        >
                          <b-icon
                            icon="x-circle-fill"
                            variant="danger"
                          ></b-icon>
                        </button>
                      </div>
                      <div class="col-sm-12 col-md-2">
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
                        class="col-xs-12 col-md-12"
                        v-if="item.data_type == 'text'"
                      >
                        <label>Text</label>
                        <html-editor v-model="item.value_text"></html-editor>
                      </div>

                      <div
                        class="col-sm-12 col-md-12"
                        v-if="item.data_type == 'question'"
                      >
                        <label>Question</label>
                        <html-editor
                          v-model="item.value_question"
                        ></html-editor>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-xs-12">
                      <button
                        type="button"
                        class="btn btn-success mt-4 mb-4"
                        @click="addRow"
                      >
                        Add form attribute
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
  </div>
</template>

<script>
import { Select, Option } from "element-ui";
import { mapGetters, mapActions } from "vuex";

import CreateFormMixin from "@/mixins/CreateFormMixin.js";
import VueTypeaheadBootstrap from "vue-typeahead-bootstrap";
import { debounce } from "lodash";

import HtmlEditor from "@/components/argon-core/Inputs/HtmlEditor";

export default {
  name: "form_create",
  mixins: [CreateFormMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    VueTypeaheadBootstrap,
    HtmlEditor
  },
  computed: {
    ...mapGetters({
      // companies: "company/companies",
      pagination: "company/companiesPagination",
      user: "user/user",
      client: "user/company"
    }),
    company: {
      get() {
        return this.$store.getters["form/company"];
      },
      set(value) {
        this.setBasicStoreValue("company", value);
      }
    },
    form_title: {
      get() {
        return this.$store.getters["form/form_title"];
      },
      set(value) {
        this.setBasicStoreValue("form_title", value);
      }
    },
    mailing_lists: {
      get() {
        return this.$store.getters["form/mailing_lists"];
      },
      set(value) {
        this.setBasicStoreValue("mailing_lists", value);
      }
    },
    status: {
      get() {
        return this.$store.getters["form/status"];
      },
      set(value) {
        this.setBasicStoreValue("status", value);
      }
    },
  },
  data() {
    return {
      query: "",
      companies: [],
      selectedCompany: null,
      originalScript: true,
      isBusy: false,
      saving: false,
      modals: {
        form: false
      },
      attribute_forms: [],
      dataTypeOptions: [
        { value: "text", label: "Text" },
        { value: "question", label: "Question" }
      ]
    };
  },
  methods: {
    ...mapActions("form", ["reset", "saveForm"]),
    flush() {
      this.attribute_forms.splice(0);
    },
    getCompany: debounce(function() {
      this.$axios
        .get(`/api/v1/company/?search=${this.company}`)
        .then(res => {
          this.companies = res.data.results;
        })
        .catch(err => {
          console.log(err);
        });
    }, 700),
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
        company: this.company,
        form_title: this.form_title,
        attribute_forms: this.attribute_forms,
        mailing_lists: this.mailing_lists,
        original_script: this.originalScript
      };

      if (
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        try {
          this.saving = true;
          await this.saveForm(formPayload)
            .then(() => {
              this.saving = false;
              this.reset();
              this.flush();
              this.$refs.formValidator.reset();
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
      this.$bvToast.toast("Successfully added a Form attribute information!", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
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
      this.attribute_forms.push({
        data_type: "",
        value_text: "",
        value_question: ""
      });
    },
    deleteRow: function(e, item) {
      e.preventDefault();
      var index = this.attribute_forms
        .map(function(item) {
          return item.id;
        })
        .indexOf(item);
      this.attribute_forms.splice(index, 1);
    }
  },
  mounted() {
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

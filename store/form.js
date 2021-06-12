const blankState = {
    form_title: "",
    company: "",
    attribute_forms: []
  };
  
  export const state = () => ({
    ...blankState,
    forms: [],
    form: {},
    formsPagination: {
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1
    },
  });
  
  export const getters = {
    form_title: state => state.form_title,
    company: state => state.company,
    attribute_forms: state => state.attribute_forms,
    formsPagination: state => state.formsPagination,
    forms: state => state.forms,
    form: state => {
        return state.form
    },
  };
  
  export const mutations = {
    setForm(state, payload) {
      state.form = payload.form;
    },
    setForms(state, payload) {
      state.forms = payload.forms;
    },
    setFormsPagination(state, payload) {
      state.formsPagination = payload;
    },
    setBasicField(state, {field, value}) {
      state[field] = value;
    },
    reset(state) {
      Object.assign(state, blankState);
    }
  };
  
  function getOffset(urlStr) {
    if (!urlStr) {
      return 0;
    }
    const url = new URL(urlStr);
    return parseInt(url.searchParams.get("offset"));
  }
  
  export const actions = {
    async fetchForms({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/form/", { params: params })
        .then(res => {
          commit("setForms", { forms: res.data.results });
          const offset = getOffset(res.data.previous);
          commit("setFormsPagination", {
            offset: offset,
            count: res.data.count,
            showing: res.data.results.length,
            currentPage: offset / 12 + 1
          });
          return res;
        })
        .catch(e => {
          throw e;
        });
    },
    async fetchUser({ commit, dispatch }) {
      let endpoint = `/auth/users/me/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          commit("setUser", { user: res.data });
          return res;
        })
        .catch(e => {
          throw e;
        });
    },
    async fetchForm({ commit, dispatch }, payload) {
      let endpoint = `/api/v1/form/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          commit("setForm", { form: res.data });
        })
        .catch(e => {
          throw e;
        });
    },
    async fetchAdminUser({ commit, dispatch }, payload) {
      let endpoint = `/auth/admin-users-list/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          commit("setUser", {user: res.data} );
        })
        .catch(e => {
          throw e;
        });
    },
    async saveForm({ commit }, payload) {
      let url = "/api/v1/form/";
      try {
        return await this.$axios.post(url, payload).then(() => {
          commit("setBasicField", payload);
        })
      } catch(err) {
        console.error(err)
      }
    },
    async updateForm({ commit }, payload) {
      let url = `/api/v1/form/${payload.id}/`;
      let method = "put";
      return await this.$axios[method](url, payload).then((res) => {
        return res.data;
      });
    },
    reset({commit}) {
      commit("reset");
    }
  };
  
const blankState = {
    form_title: "",
    company: "",
    company_address: "",
    form: null,
    attribute: null,
    mailing_lists: "",
    value_text: "",
    value_question: "",
    status: false,
  };
  
  export const state = () => ({
    ...blankState,
    scripts: [],
    script: {},
    scriptsPagination: {
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1
    }
  });
  
  export const getters = {
    company: state => state.company,
    company_address: state => state.company_address,
    form: state => state.form,
    attribute: state => state.attribute,
    mailing_lists: state => state.mailing_lists,
    value_text: state => state.value_text,
    value_question: state => state.value_question,
    status: state => state.status,
    scriptsPagination: state => state.scriptsPagination,
    scripts: state => state.scripts,
    script: state => {
        return state.script
    }
  };
  
  export const mutations = {
    setScript(state, payload) {
      state.script = payload.script;
    },
    setScripts(state, payload) {
      state.scripts = payload.scripts;
    },
    setScriptsPagination(state, payload) {
      state.scriptsPagination = payload;
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
    async fetchScripts({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/script/", { params: params })
        .then(res => {
          commit("setScripts", { scripts: res.data.results });
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
    async fetchScript({ commit, dispatch }, payload) {
      let endpoint = `/api/v1/script/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          commit("setScript", { script: res.data });
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
    async saveScript({ commit }, payload) {
      let url = "/api/v1/script/";
      try {
        return await this.$axios.post(url, payload).then(() => {
          commit("setBasicField", payload);
        })
      } catch(err) {
        console.error(err)
      }
    },
    async updateScript({ commit }, payload) {
      let url = `/api/v1/script/${payload.id}/`;
      let method = "put";
      return await this.$axios[method](url, payload).then((res) => {
        return res.data;
      });
    },
    reset({commit}) {
      commit("reset");
    }
  };
  
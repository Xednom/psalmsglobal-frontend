const blankState = {
    company: "",
    crm: false,
    type_of_crm: "",
    crm_url: "",
    crm_login: "",
    notes: "",
  };
  
  export const state = () => ({
    ...blankState,
    crms: [],
    companyCrm: {},
    crmsPagination: {
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1
    }
  });
  
  export const getters = {
    company: state => state.company,
    crm: state => state.crm,
    type_of_crm: state => state.type_of_crm,
    crm_url: state => state.crm_url,
    crm_login: state => state.crm_login,
    notes: state => state.notes,
    crmsPagination: state => state.crmsPagination,
    crms: state => state.crms,
    companyCrm: state => {
        return state.crm
    }
  };
  
  export const mutations = {
    setCrm(state, payload) {
      state.companyCrm = payload.companyCrm;
    },
    setCrms(state, payload) {
      state.crms = payload.crms;
    },
    setCrmsPagination(state, payload) {
      state.crmsPagination = payload;
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
    async fetchCrms({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/crm/", { params: params })
        .then(res => {
          commit("setCrms", { crms: res.data.results });
          const offset = getOffset(res.data.previous);
          commit("setCrmsPagination", {
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
    async fetchCrm({ commit, dispatch }, payload) {
      let endpoint = `/api/v1/crm/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          commit("setCrm", { companyCrm: res.data });
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
    async saveCrm({ commit }, payload) {
      let url = "/api/v1/crm/";
      try {
        return await this.$axios.post(url, payload).then(() => {
          commit("setBasicField", payload);
        })
      } catch(err) {
        console.error(err)
      }
    },
    async updateCrm({ commit }, payload) {
      let url = `/api/v1/crm/${payload.id}/`;
      let method = "put";
      return await this.$axios[method](url, payload).then((res) => {
        return res.data;
      });
    },
    reset({commit}) {
      commit("reset");
    }
  };
  
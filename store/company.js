const blankState = {
    company_owner_name: "",
    company_name: "",
    business_type: "",
    company_phone: "",
    company_email: "",
    company_complete_address: "",
    company_forwarding_email: "",
    paypal_email: "",
    notes: ""
  };
  
  export const state = () => ({
    ...blankState,
    companies: [],
    company: {},
    companiesPagination: {
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1
    }
  });
  
  export const getters = {
    company_owner_name: state => state.company_owner_name,
    company_name: state => state.company_name,
    business_type: state => state.business_type,
    company_phone: state => state.company_phone,
    company_email: state => state.company_email,
    company_complete_address: state => state.company_complete_address,
    company_forwarding_email: state => state.company_forwarding_email,
    paypal_email: state => state.paypal_email,
    notes: state => state.notes,
    companiesPagination: state => state.companiesPagination,
    companies: state => state.companies,
    company: state => {
        return state.company
    }
  };
  
  export const mutations = {
    setCompany(state, payload) {
      state.company = payload.company;
    },
    setCompanies(state, payload) {
      state.companies = payload.companies;
    },
    setCompaniesPagination(state, payload) {
      state.companiesPagination = payload;
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
    async fetchCompanies({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/company/", { params: params })
        .then(res => {
          commit("setCompanies", { companies: res.data.results });
          const offset = getOffset(res.data.previous);
          commit("setCompaniesPagination", {
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
    async fetchCompany({ commit, dispatch }, payload) {
      let endpoint = `/api/v1/company/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          commit("setCompany", { company: res.data });
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
    async saveCompany({ commit }, payload) {
      let url = "/api/v1/company/";
      try {
        return await this.$axios.post(url, payload).then(() => {
          commit("setBasicField", payload);
        })
      } catch(err) {
        console.error(err)
      }
    },
    async updateCompany({ commit }, payload) {
      let url = `/api/v1/company/${payload.id}/`;
      let method = "put";
      return await this.$axios[method](url, payload).then((res) => {
        return res.data;
      });
    },
    reset({commit}) {
      commit("reset");
    }
  };
  
export const state = () => ({
    monthlyCharges: [],
    monthlyCharge: {},
    monthlyChargesPagination: {
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1
    }
  });
  
  export const getters = {
    monthlyChargesPagination: state => state.monthlyChargesPagination,
    monthlyCharges: state => state.monthlyCharges,
    monthlyCharge: state => {
      return state.monthlyCharge;
    }
  };
  
  export const mutations = {
    setMonthlyCharge(state, payload) {
      state.monthlyCharge = payload.monthlyCharge;
    },
    setMonthlyCharges(state, payload) {
      state.monthlyCharges = payload.monthlyCharges;
    },
    setMonthlyChargesPagination(state, payload) {
      state.monthlyChargesPagination = payload;
    },
    setBasicField(state, { field, value }) {
      state[field] = value;
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
    async fetchMontlhyCharges({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/post-paid/monthly-charge/", { params: params })
        .then(res => {
          commit("setMonthlyCharges", { monthlyCharges: res.data.results });
          const offset = getOffset(res.data.previous);
          commit("setMonthlyChargesPagination", {
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
    async fetchMonthlyCharge({ commit }, payload) {
      return await this.$axios
        .get(`/api/v1/post-paid/monthly-charge/${payload.id}/`)
        .then(res => {
          commit("setMonthlyCharge", { monthlyCharge: res.data });
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
    async fetchAdminUser({ commit, dispatch }, payload) {
      let endpoint = `/auth/admin-users-list/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          commit("setUser", { user: res.data });
        })
        .catch(e => {
          throw e;
        });
    },
    async saveMonthlyCharge({ commit }, payload) {
      let url = "/api/v1/post-paid/monthly-charge/";
      try {
        return await this.$axios.post(url, payload).then(() => {
          commit("setBasicField", payload);
        });
      } catch (err) {
        console.error(err);
      }
    },
    async updateMonthlyCharge({ commit }, payload) {
      let url = `/api/v1/post-paid/monthly-charge/${payload.id}/`;
      let method = "put";
      return await this.$axios[method](url, payload).then(res => {
        commit("setMonthlyCharge", payload);
      });
    }
  };
  
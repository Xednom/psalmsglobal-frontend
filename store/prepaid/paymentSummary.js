export const state = () => ({
    paymentSummaries: [],
    paymentSummary: {},
    paymentSummariesPagination: {
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1
    }
  });
  
  export const getters = {
    paymentSummariesPagination: state => state.paymentSummariesPagination,
    paymentSummaries: state => state.paymentSummaries,
    paymentSummary: state => {
      return state.paymentSummary;
    }
  };
  
  export const mutations = {
    setPaymentSummary(state, payload) {
      state.paymentSummary = payload.paymentSummary;
    },
    setPaymentSummaries(state, payload) {
      state.paymentSummaries = payload.paymentSummaries;
    },
    setPaymentSummariesPagination(state, payload) {
      state.paymentSummariesPagination = payload;
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
    async fetchPaymentSummaries({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/prepaid/payment-summary/", { params: params })
        .then(res => {
          commit("setPaymentSummaries", { paymentSummaries: res.data.results });
          const offset = getOffset(res.data.previous);
          commit("setPaymentSummariesPagination", {
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
    async fetchPaymentSummary({ commit }, payload) {
      return await this.$axios
        .get(`/api/v1/prepaid/payment-summary/${payload.id}/`)
        .then(res => {
          commit("setPaymentSummary", { paymentSummary: res.data });
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
    async savePaymentSummary({ commit }, payload) {
      let url = "/api/v1/prepaid/payment-summary/";
      try {
        return await this.$axios.post(url, payload).then(() => {
          commit("setBasicField", payload);
        });
      } catch (err) {
        console.error(err);
      }
    },
    async updatePaymentSummary({ commit }, payload) {
      let url = `/api/v1/prepaid/payment-summary/${payload.id}/`;
      let method = "put";
      return await this.$axios[method](url, payload).then(res => {
        commit("setPaymentSummary", payload);
      });
    }
  };
  
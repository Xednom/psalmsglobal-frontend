export const state = () => ({
    subscriptions: [],
    subscription: {},
    subscriptionsPagination: {
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1
    }
  });
  
  export const getters = {
    subscriptionsPagination: state => state.subscriptionsPagination,
    subscriptions: state => state.subscriptions,
    subscription: state => {
      return state.subscription;
    }
  };
  
  export const mutations = {
    setSubscription(state, payload) {
      state.subscription = payload.subscription;
    },
    setSubscriptions(state, payload) {
      state.subscriptions = payload.subscriptions;
    },
    setSubscriptionsPagination(state, payload) {
      state.subscriptionsPagination = payload;
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
    async fetchSubscriptions({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/prepaid/prepaid-subscription/", { params: params })
        .then(res => {
          commit("setSubscriptions", { subscriptions: res.data.results });
          const offset = getOffset(res.data.previous);
          commit("setSubscriptionsPagination", {
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
    async fetchSubscription({ commit }, payload) {
      return await this.$axios
        .get(`/api/v1/prepaid/prepaid-subscription/${payload.id}/`)
        .then(res => {
          commit("setSubscription", { subscription: res.data });
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
      let url = "/api/v1/prepaid/prepaid-subscription/";
      try {
        return await this.$axios.post(url, payload).then(() => {
          commit("setBasicField", payload);
        });
      } catch (err) {
        console.error(err);
      }
    },
    async updateMonthlyCharge({ commit }, payload) {
      let url = `/api/v1/prepaid/prepaid-subscription/${payload.id}/`;
      let method = "put";
      return await this.$axios[method](url, payload).then(res => {
        commit("setMonthlyCharge", payload);
      });
    }
  };
  
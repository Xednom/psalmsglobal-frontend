export const state = () => ({
  accountBalances: [],
  accountBalance: {},
  accountBalancesPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1
  }
});

export const getters = {
  accountBalancesPagination: state => state.accountBalancesPagination,
  accountBalances: state => state.accountBalances,
  accountBalance: state => {
    return state.accountBalance;
  }
};

export const mutations = {
  setAccountBalance(state, payload) {
    state.accountBalance = payload.accountBalance;
  },
  setAccountBalances(state, payload) {
    state.accountBalances = payload.accountBalances;
  },
  setAccountBalancesPagination(state, payload) {
    state.accountBalancesPagination = payload;
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
  async fetchAccountBalances({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/post-paid/account-balance/", { params: params })
      .then(res => {
        commit("setAccountBalances", { accountBalances: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setAccountBalancesPagination", {
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
  async fetchAccountBalance({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/post-paid/account-balance/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then(res => {
        commit("setAccountBalance", { accountBalance: res.data });
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
  }
};

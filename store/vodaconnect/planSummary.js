const blankState = {
  client: null,
  month_year: "",
  plan_type: "",
  total_minutes: 0.0,
  cost_of_plan: 0.0,
  payment_reference: "",
  status: "",
  date_of_paid: null
};

export const state = () => ({
  ...blankState,
  summaries: [],
  summary: {},
  summariesPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1
  }
});

export const getters = {
  date_of_paid: state => state.date_of_paid,
  client: state => state.client,
  month_year: state => state.month_year,
  plan_type: state => state.plan_type,
  total_minutes: state => state.total_minutes,
  cost_of_plan: state => state.cost_of_plan,
  payment_reference: state => state.payment_reference,
  status: state => state.status,
  summariesPagination: state => state.summariesPagination,
  summaries: state => state.summaries,
  summary: state => {
    return state.summary;
  }
};

export const mutations = {
  setSummary(state, payload) {
    state.summary = payload.summary;
  },
  setSummaries(state, payload) {
    state.summaries = payload.summaries;
  },
  setSummariesPagination(state, payload) {
    state.summariesPagination = payload;
  },
  setBasicField(state, { field, value }) {
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
  async fetchSummaries({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/vodaconnect/plan-summary-and-payment/", { params: params })
      .then(res => {
        commit("setSummaries", { summaries: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setSummariesPagination", {
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
  async fetchSummary({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/vodaconnect/plan-summary-and-payment/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then(res => {
        commit("setSummary", { summary: res.data });
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
  async saveSummary({ commit }, payload) {
    let url = "/api/v1/vodaconnect/plan-summary-and-payment/";
    let method = "post";
    if (payload.id) {
      method = "put";
      url += `${payload.id}/`;
    }
    return await this.$axios[method](url, payload).then(() => {
      return res.data;
    });
  },
  reset({ commit }) {
    commit("reset");
  }
};

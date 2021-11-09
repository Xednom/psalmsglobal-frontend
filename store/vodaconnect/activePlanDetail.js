const blankState = {
  client: null,
  plan_type: null,
  total_minutes_included: 0.0,
  cost_of_plan: 0.0,
  start_of_plan: null,
  end_of_plan: null,
  account_status: true,
  recurring_bill: true
};

export const state = () => ({
  ...blankState,
  activePlanDetails: [],
  activePlanDetail: {},
  activePlanDetailsPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1
  }
});

export const getters = {
  client: state => state.client,
  plan_type: state => state.plan_type,
  total_minutes_included: state => state.total_minutes_included,
  cost_of_plan: state => state.cost_of_plan,
  start_of_plan: state => state.start_of_plan,
  end_of_plan: state => state.end_of_plan,
  account_status: state => state.account_status,
  recurring_bill: state => state.recurring_bill,
  activePlanDetailsPagination: state => state.activePlanDetailsPagination,
  activePlanDetails: state => state.activePlanDetails,
  activePlanDetail: state => {
    return state.activePlanDetail;
  }
};

export const mutations = {
  setActivePlanDetail(state, payload) {
    state.activePlanDetail = payload.activePlanDetails;
  },
  setActivePlanDetails(state, payload) {
    state.activePlanDetails = payload.activePlanDetails;
  },
  setActivePlanDetailsPagination(state, payload) {
    state.activePlanDetailsPagination = payload;
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
  async fetchActivePlanDetails({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/vodaconnect/active-plan-detail/", { params: params })
      .then(res => {
        commit("setActivePlanDetails", { activePlanDetails: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setActivePlanDetailsPagination", {
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
    let endpoint = `/api/v1/vodaconnect/active-plan-detail/${payload}/`;
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
        commit("setUser", { user: res.data });
      })
      .catch(e => {
        throw e;
      });
  },
  async saveActivePlanDetail({ commit }, payload) {
    let url = "/api/v1/vodaconnect/active-plan-detail/";
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

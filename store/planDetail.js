const blankState = {
  client: null,
  plan_type: null,
  total_minutes: "",
  cost_of_plan: null,
  start_of_plan: "",
  end_of_plan: "",
  account_status: false,
  recurring_bill: false,
  notes: ""
};

export const state = () => ({
  ...blankState,
  planDetails: [],
  planTypes: [],
  costOfPlans: [],
  planDetail: {},
  planDetailsPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1
  }
});

export const getters = {
  client: state => state.client,
  plan_type: state => state.plan_type,
  total_minutes: state => state.total_minutes,
  cost_of_plan: state => state.cost_of_plan,
  start_of_plan: state => state.start_of_plan,
  end_of_plan: state => state.end_of_plan,
  account_status: state => state.account_status,
  recurring_bill: state => state.recurring_bill,
  notes: state => state.notes,
  planDetailsPagination: state => state.planDetailsPagination,
  planDetails: state => state.planDetails,
  planDetail: state => {
    return state.planDetail;
  },
  costOfPlans: state => state.costOfPlans,
  planTypes: state => state.planTypes
};

export const mutations = {
  setPlanDetail(state, payload) {
    state.planDetail = payload.planDetail;
  },
  setPlanDetails(state, payload) {
    state.planDetails = payload.planDetails;
  },
  setPlanTypes(state, payload) {
    state.planTypes = payload.planTypes;
  },
  setCostOfPlans(state, payload) {
    state.costOfPlans = payload.costOfPlans;
  },
  setPlanDetailsPagination(state, payload) {
    state.planDetailsPagination = payload;
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
  async fetchPlanDetails({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/post-paid/post-paid/", { params: params })
      .then(res => {
        commit("setPlanDetails", { planDetails: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setPlanDetailsPagination", {
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
  async fetchPlanDetail({ commit }, payload) {
    return await this.$axios
      .get(`/api/v1/post-paid/post-paid/${payload.id}/`)
      .then(res => {
        commit("setPlanDetail", { planDetail: res.data });
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
  async fetchPlanTypes({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/post-paid/plan-types/`;
    return await this.$axios
      .get(endpoint)
      .then(res => {
        commit("setPlanTypes", { planTypes: res.data.results });
      })
      .catch(e => {
        throw e;
      });
  },
  async fetchCostOfPlans({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/post-paid/cost-of-plan/`;
    return await this.$axios
      .get(endpoint)
      .then(res => {
        commit("setCostOfPlans", { costOfPlans: res.data.results });
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
  async savePlan({ commit }, payload) {
    let url = "/api/v1/post-paid/post-paid/";
    try {
      return await this.$axios.post(url, payload).then(() => {
        commit("setBasicField", payload);
      });
    } catch (err) {
      console.error(err);
    }
  },
  async updatePlanDetail({ commit }, payload) {
    let url = `/api/v1/post-paid/post-paid/${payload.id}/`;
    let method = "put";
    return await this.$axios[method](url, payload).then(res => {
      return res.data;
    });
  },
  reset({ commit }) {
    commit("reset");
  }
};

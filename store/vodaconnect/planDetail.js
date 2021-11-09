const blankState = {
    client: null,
    month_year: "",
    plan_type: "",
    total_cost: 0.0,
    recurring_bill: null,
    paypal_details_for_billing: "",
    status: "",
    due_date: null
  };
  
  export const state = () => ({
    ...blankState,
    planDetails: [],
    planDetail: {},
    planDetailsPagination: {
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1
    }
  });
  
  export const getters = {
    due_date: state => state.due_date,
    client: state => state.client,
    month_year: state => state.month_year,
    plan_type: state => state.plan_type,
    total_cost: state => state.total_cost,
    recurring_bill: state => state.recurring_bill,
    paypal_details_for_billing: state => state.paypal_details_for_billing,
    status: state => state.status,
    planDetailsPagination: state => state.planDetailsPagination,
    planDetails: state => state.planDetails,
    planDetail: state => {
      return state.planDetail;
    }
  };
  
  export const mutations = {
    setPlanDetails(state, payload) {
      state.planDetail = payload.planDetail;
    },
    setPlanDetails(state, payload) {
      state.planDetails = payload.planDetails;
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
        .get("/api/v1/vodaconnect/plan-detail/", { params: params })
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
    async fetchPlanDetail({ commit, dispatch }, payload) {
      let endpoint = `/api/v1/vodaconnect/plan-detail/${payload}/`;
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
    async savePlanDetail({ commit }, payload) {
      let url = "/api/v1/vodaconnect/plan-detail/";
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
  
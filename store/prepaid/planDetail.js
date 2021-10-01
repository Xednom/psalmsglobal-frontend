const blankState = {
    client: null,
    subscription_type: null,
    monthly_fees: "",
    start_of_subscription: "",
    end_of_subscription: "",
    account_status: false,
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
    subscription_type: state => state.subscription_type,
    monthly_fees: state => state.monthly_fees,
    start_of_subscription: state => state.start_of_subscription,
    end_of_subscription: state => state.end_of_subscription,
    account_status: state => state.account_status,
    notes: state => state.notes,
    planDetailsPagination: state => state.planDetailsPagination,
    planDetails: state => state.planDetails,
    planDetail: state => {
      return state.planDetail;
    },
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
        .get("/api/v1/prepaid/prepaid-account/", { params: params })
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
        .get(`/api/v1/prepaid/prepaid-account/${payload.id}/`)
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
      let url = "/api/v1/prepaid/prepaid-account/";
      try {
        return await this.$axios.post(url, payload).then(() => {
          commit("setBasicField", payload);
        });
      } catch (err) {
        console.error(err);
      }
    },
    async updatePlanDetail({ commit }, payload) {
      let url = `/api/v1/prepaid/prepaid-account/${payload.id}/`;
      let method = "put";
      return await this.$axios[method](url, payload).then(res => {
        return res.data;
      });
    },
    reset({ commit }) {
      commit("reset");
    }
  };
  
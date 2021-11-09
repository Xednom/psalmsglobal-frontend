const blankState = {
  client: null,
  order_request_date: "",
  request_date_initiated: "",
  date_line_activated: "",
  date_line_terminated: "",
  phone_line_status: "",
  client_company_user_category: ""
};

export const state = () => ({
  ...blankState,
  activationDetails: [],
  activationDetail: {},
  activationDetailsPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1
  }
});

export const getters = {
  client: state => state.client,
  order_request_date: state => state.order_request_date,
  request_date_initiated: state => state.request_date_initiated,
  date_line_activated: state => state.date_line_activated,
  date_line_terminated: state => state.date_line_terminated,
  phone_line_status: state => state.phone_line_status,
  client_company_user_category: state => state.client_company_user_category,
  activationDetailsPagination: state => state.activationDetailsPagination,
  activationDetails: state => state.activationDetails,
  activationDetail: state => {
    return state.activationDetail;
  }
};

export const mutations = {
  setActivationDetail(state, payload) {
    state.activationDetail = payload.activationDetail;
  },
  setActivationDetails(state, payload) {
    state.activationDetails = payload.activationDetails;
  },
  setActivationDetailsPagination(state, payload) {
    state.activationDetailsPagination = payload;
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
  async fetchActivationDetails({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/vodaconnect/activation-detail/", { params: params })
      .then(res => {
        commit("setActivationDetails", { activationDetails: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setActivationDetailsPagination", {
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
  async fetchActivationDetail({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/vodaconnect/activation-detail/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then(res => {
        commit("setActivationDetail", { activationDetail: res.data });
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
  async saveActivationDetail({ commit }, payload) {
    let url = "/api/v1/vodaconnect/activation-detail/";
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

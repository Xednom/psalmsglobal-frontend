const blankState = {
  caller_interaction_record: null,
  request_date: "",
  due_date: "",
  job_title: "",
  job_description: "",
  client_notes: "",
  va_notes: "",
  status: "",
  date_completed: "",
  total_time_consumed: "",
  url_of_the_completed_jo: "",
  client: {},
  va_assigned: {},
  comment: "",
  query: "",
};

export const state = () => ({
  ...blankState,
  jobOrders: [],
  summaryJobOrders: [],
  summaryJobOrder: {},
  jobOrder: {},
  jobOrdersPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1,
  },
  summaryJobOrdersPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1,
  },
});

export const getters = {
  caller_interaction_record: (state) => state.caller_interaction_record,
  request_date: (state) => state.request_date,
  due_date: (state) => state.due_date,
  job_title: (state) => state.job_title,
  job_description: (state) => state.job_description,
  client_notes: (state) => state.client_notes,
  va_notes: (state) => state.va_notes,
  status: (state) => state.status,
  date_completed: (state) => state.date_completed,
  total_time_consumed: (state) => state.total_time_consumed,
  url_of_the_completed_jo: (state) => state.url_of_the_completed_jo,
  client: (state) => state.client,
  va_assigned: (state) => state.va_assigned,
  jobOrdersPagination: (state) => state.jobOrdersPagination,
  summaryJobOrdersPagination: (state) => state.summaryJobOrdersPagination,
  jobOrders: (state) => state.jobOrders,
  summaryJobOrders: (state) => state.summaryJobOrders,
  comment: (state) => state.comment,
  query: (state) => state.query,
  jobOrder: (state) => {
    return state.jobOrder;
  },
  summaryJobOrder: (state) => {
    return state.summaryJobOrder;
  },
};

export const mutations = {
  setJobOrder(state, payload) {
    state.jobOrder = payload.jobOrder;
  },
  setJobOrders(state, payload) {
    state.jobOrders = payload.jobOrders;
  },
  setJobOrdersPagination(state, payload) {
    state.jobOrdersPagination = payload;
  },
  setSummaryJobOrder(state, payload) {
    state.summaryJobOrder = payload.summaryJobOrder;
  },
  setSummaryJobOrders(state, payload) {
    state.summaryJobOrders = payload.summaryJobOrders;
  },
  setSummaryJobOrdersPagination(state, payload) {
    state.summaryJobOrdersPagination = payload;
  },
  setBasicField(state, { field, value }) {
    state[field] = value;
  },
  reset(state) {
    Object.assign(state, blankState);
  },
};

function getOffset(urlStr) {
  if (!urlStr) {
    return 0;
  }
  const url = new URL(urlStr);
  return parseInt(url.searchParams.get("offset"));
}

export const actions = {
  async fetchJobOrders({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/post-paid/job-order-general/", { params: params })
      .then((res) => {
        commit("setJobOrders", { jobOrders: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setJobOrdersPagination", {
          offset: offset,
          count: res.data.count,
          showing: res.data.results.length,
          currentPage: offset / 12 + 1,
        });
        return res;
      })
      .catch((e) => {
        throw e;
      });
  },
  async fetchTicketSummaryJobOrders({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/post-paid/job-order-ticket-summary/", { params: params })
      .then((res) => {
        commit("setSummaryJobOrders", { summaryJobOrders: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setSummaryJobOrdersPagination", {
          offset: offset,
          count: res.data.count,
          showing: res.data.results.length,
          currentPage: offset / 12 + 1,
        });
        return res;
      })
      .catch((e) => {
        throw e;
      });
  },
  async fetchUser({ commit, dispatch }) {
    let endpoint = `/auth/users/me/`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setUser", { user: res.data });
        return res;
      })
      .catch((e) => {
        throw e;
      });
  },
  async fetchJobOrder({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/post-paid/job-order/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setJobOrder", { jobOrder: res.data });
      })
      .catch((e) => {
        throw e;
      });
  },
  async fetchSummaryJobOrder({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/post-paid/job-order-ticket-summary/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setSummaryJobOrder", { summaryJobOrder: res.data });
        console.warn("Summary Job Order: ", res.data);
      })
      .catch((e) => {
        throw e;
      });
  },
  async fetchAdminUser({ commit, dispatch }, payload) {
    let endpoint = `/auth/admin-users-list/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setUser", { user: res.data });
      })
      .catch((e) => {
        throw e;
      });
  },
  async saveJobOrder({ commit }, payload) {
    let url = "/api/v1/post-paid/job-order/";
    return await this.$axios.post(url, payload).then(() => {
      commit("setBasicField", payload);
    });
  },
  async saveJobOrderTicketSummary({ commit }, payload) {
    let url = "/api/v1/post-paid/job-order-ticket-summary/";

    if (payload.ticket_number) {
      let method = "put";
      url += payload.ticket_number + "/"
      return await this.$axios[method](url, payload).then(() => {
        commit("setBasicField", payload);
      });
    } else {
      let method = "post";
      return await this.$axios[method](url, payload).then(() => {
        commit("setBasicField", payload);
      });
    }
  },
  async updatePostpaidJobOrder({ commit }, payload) {
    let url = `/api/v1/post-paid/job-order-general/${payload.ticket_number}/`;
    let method = "put";
    return await this.$axios[method](url, payload).then((res) => {
      return res.data;
    });
  },
  async addPostpaidComment({ commit }, payload) {
    let url = `/api/v1/job-order/${payload.id}/comment/`;
    return await this.$axios.post(url, payload).then((res) => {
      commit("setBasicField", payload);
    });
  },
  async addTicketSummaryComment({ commit }, payload) {
    let url = `/api/v1/job-order-ticket-summary/${payload.id}/comment/`;
    return await this.$axios.post(url, payload).then((res) => {
      commit("setBasicField", payload);
    });
  },
  reset({ commit }) {
    commit("reset");
  },
};

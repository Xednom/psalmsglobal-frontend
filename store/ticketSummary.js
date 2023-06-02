const blankState = {
  ticket_number: "",
  company: null,
  agent: null,
  apn: "",
  reference_number: "",
  county: "",
  state: "",
  address: "",
  caller_full_name: "",
  caller_phone: "",
  email: "",
  reason_of_the_call: "",
  interested_to_sell: null,
  interested_to_buy: null,
  general_call: null,
  total_minutes: 0,
  crm: "",
  leads_transferred_crm: "",
  script_answer: "",
  comment: "",
};

export const state = () => ({
  ...blankState,
  ticketSummaries: [],
  interestedToSells: [],
  interestedToBuys: [],
  generalCalls: [],
  ticketSummary: {},
  ticketSummariesPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1,
  },
});

export const getters = {
  ticket_number: (state) => state.ticket_number,
  company: (state) => state.company,
  agent: (state) => state.agent,
  apn: (state) => state.apn,
  reference_number: (state) => state.reference_number,
  county: (state) => state.county,
  state: (state) => state.state,
  address: (state) => state.address,
  caller_full_name: (state) => state.caller_full_name,
  caller_phone: (state) => state.caller_phone,
  email: (state) => state.email,
  reason_of_the_call: (state) => state.reason_of_the_call,
  interested_to_sell: (state) => state.interested_to_sell,
  interested_to_buy: (state) => state.interested_to_buy,
  general_call: (state) => state.general_call,
  total_minutes: (state) => state.total_minutes,
  crm: (state) => state.crm,
  leads_transferred_crm: (state) => state.leads_transferred_crm,
  script_answer: (state) => state.script_answer,
  ticketSummariesPagination: (state) => state.ticketSummariesPagination,
  interestedToBuys: (state) => state.interestedToBuys,
  interestedToSells: (state) => state.interestedToSells,
  generalCalls: (state) => state.generalCalls,
  ticketSummaries: (state) => state.ticketSummaries,
  ticketSummary: (state) => {
    return state.ticketSummary;
  },
  comment: (state) => state.comment,
};

export const mutations = {
  setTicketSummary(state, payload) {
    state.ticketSummary = payload.ticketSummary;
  },
  setTicketSummaries(state, payload) {
    state.ticketSummaries = payload.ticketSummaries;
  },
  setInterestedToBuys(state, payload) {
    state.interestedToBuys = payload.interestedToBuys;
  },
  setInterestedToSells(state, payload) {
    state.interestedToSells = payload.interestedToSells;
  },
  setGeneralCalls(state, payload) {
    state.generalCalls = payload.generalCalls;
  },
  setTicketSummariesPagination(state, payload) {
    state.ticketSummariesPagination = payload;
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
  async fetchTicketSummaries({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/post-paid/ticket-summary/", {
        params: params,
      })
      .then((res) => {
        commit("setTicketSummaries", { ticketSummaries: res.data.results });
        console.warn("Ticket summaries")
        const offset = getOffset(res.data.previous);
        commit("setTicketSummariesPagination", {
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
  async fetchInterestedToBuy({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/post-paid/interested-to-buy/", { params: params })
      .then((res) => {
        commit("setInterestedToBuys", { interestedToBuys: res.data.results });
        return res;
      })
      .catch((e) => {
        throw e;
      });
  },
  async fetchInterestedToSell({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/post-paid/interested-to-sell/", { params: params })
      .then((res) => {
        commit("setInterestedToSells", {
          interestedToSells: res.data.results,
        });
        return res;
      })
      .catch((e) => {
        throw e;
      });
  },
  async fetchGeneralCalls({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/post-paid/general-call/", { params: params })
      .then((res) => {
        commit("setGeneralCalls", {
          generalCalls: res.data.results,
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
  async fetchTicketSummary({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/post-paid/ticket-summary/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setTicketSummary", { ticketSummary: res.data });
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
  async saveTicketSummary({ commit }, payload) {
    let url = "/api/v1/post-paid/ticket-summary/";
    let method = "post";
    if (payload.id) {
      method = "put";
      return await this.$axios[method](url, payload).then((res) => {
        commit("setBasicField", payload);
      });
    }
    return await this.$axios[method](url, payload).then((res) => {
      console.warn("REs ticket summary: ", res)
      this.$router.push({
        name: "ticket-summary-id",
        params: { id: res.data.ticket_number },
      });
      commit("setBasicField", payload);
    });
  },
  async updateTicketSummary({ commit }, payload) {
    let url = `/api/v1/post-paid/ticket-summary/${payload.ticket_number}/`;
    let method = "put";
    return await this.$axios[method](url, payload).then((res) => {
      return res.data;
    });
  },
  reset({ commit }) {
    commit("reset");
  },
};

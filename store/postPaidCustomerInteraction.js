const blankState = {
  ticket_number: "",
  company: null,
  apn: "",
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
  comment: ""
};

export const state = () => ({
  ...blankState,
  interactions: [],
  interestedToSells: [],
  interestedToBuys: [],
  generalCalls: [],
  interaction: {},
  interactionsPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1
  }
});

export const getters = {
  ticket_number: state => state.ticket_number,
  company: state => state.company,
  apn: state => state.apn,
  caller_full_name: state => state.caller_full_name,
  caller_phone: state => state.caller_phone,
  email: state => state.email,
  reason_of_the_call: state => state.reason_of_the_call,
  interested_to_sell: state => state.interested_to_sell,
  interested_to_buy: state => state.interested_to_buy,
  general_call: state => state.general_call,
  total_minutes: state => state.total_minutes,
  crm: state => state.crm,
  leads_transferred_crm: state => state.leads_transferred_crm,
  script_answer: state => state.script_answer,
  interactionsPagination: state => state.interactionsPagination,
  interestedToBuys: state => state.interestedToBuys,
  interestedToSells: state => state.interestedToSells,
  generalCalls: state => state.generalCalls,
  interactions: state => state.interactions,
  interaction: state => {
    return state.interaction;
  },
  comment: state => state.comment,
};

export const mutations = {
  setInteraction(state, payload) {
    state.interaction = payload.interaction;
  },
  setInteractions(state, payload) {
    state.interactions = payload.interactions;
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
  setInteractionsPagination(state, payload) {
    state.interactionsPagination = payload;
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
  async fetchInteractions({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/post-paid/customer-interaction-post-paid/", { params: params })
      .then(res => {
        commit("setInteractions", { interactions: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setInteractionsPagination", {
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
  async fetchInterestedToBuy({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/post-paid/interested-to-buy/", { params: params })
      .then(res => {
        commit("setInterestedToBuys", { interestedToBuys: res.data.results });
        return res;
      })
      .catch(e => {
        throw e;
      });
  },
  async fetchInterestedToSell({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/post-paid/interested-to-sell/", { params: params })
      .then(res => {
        commit("setInterestedToSells", {
            interestedToSells: res.data.results
        });
        return res;
      })
      .catch(e => {
        throw e;
      });
  },
  async fetchGeneralCalls({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/post-paid/general-call/", { params: params })
      .then(res => {
        commit("setGeneralCalls", {
            generalCalls: res.data.results
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
  async fetchInteraction({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/post-paid/customer-interaction-post-paid/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then(res => {
        commit("setInteraction", { interaction: res.data });
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
  async saveInteraction({ commit }, payload) {
    let url = "/api/v1/post-paid/customer-interaction-post-paid/";
    try {
      return await this.$axios.post(url, payload).then(() => {
        commit("setBasicField", payload);
      });
    } catch (err) {
      console.error(err);
    }
  },
  async updateInteraction({ commit }, payload) {
    let url = `/api/v1/post-paid/customer-interaction-post-paid/${payload.ticket_number}/`;
    let method = "put";
    return await this.$axios[method](url, payload).then(res => {
      return res.data;
    });
  },
  reset({ commit }) {
    commit("reset");
  }
};

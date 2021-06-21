const blankState = {
  date_called: "",
  ticket_number: "",
  customer_interaction_post_paid: null,
  client: null,
  agent: null,
  total_minutes: 0,
  summary: ""
};

export const state = () => ({
  ...blankState,
  interactions: [],
  interaction: {},
  interactionsPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1
  }
});

export const getters = {
  date_called: state => state.date_called,
  ticket_number: state => state.ticket_number,
  customer_interaction_post_paid: state => state.customer_interaction_post_paid,
  client: state => state.client,
  agent: state => state.agent,
  total_minutes: state => state.total_minutes,
  summary: state => state.summary,
  recordsPagination: state => state.recordsPagination,
  records: state => state.records,
  record: state => {
    return state.record;
  }
};

export const mutations = {
  setRecord(state, payload) {
    state.record = payload.record;
  },
  setRecords(state, payload) {
    state.records = payload.records;
  },
  setRecordsPagination(state, payload) {
    state.recordsPagination = payload;
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
  async fetchRecords({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/post-paid/interaction-record/", { params: params })
      .then(res => {
        commit("setRecords", { records: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setRecordsPagination", {
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
  async fetchRecord({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/post-paid/interaction-record/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then(res => {
        commit("setRecord", { record: res.data });
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
  async saveRecord({ commit }, payload) {
    let url = "/api/v1/post-paid/interaction-record/";
    try {
      return await this.$axios.post(url, payload).then(() => {
        commit("setBasicField", payload);
      });
    } catch (err) {
      console.error(err);
    }
  },
  async updateRecord({ commit }, payload) {
    let url = `/api/v1/post-paid/interaction-record/${payload.id}/`;
    let method = "put";
    return await this.$axios[method](url, payload).then(res => {
      return res.data;
    });
  },
  reset({ commit }) {
    commit("reset");
  }
};

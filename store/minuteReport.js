export const state = () => ({
  minuteReports: [],
  minuteReport: {},
  minuteReportsPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1
  }
});

export const getters = {
  minuteReportsPagination: state => state.minuteReportsPagination,
  minuteReports: state => state.minuteReports,
  minuteReport: state => {
    return state.minuteReport;
  }
};

export const mutations = {
  setMinuteReport(state, payload) {
    state.minuteReport = payload.minuteReport;
  },
  setMinuteReports(state, payload) {
    state.minuteReports = payload.minuteReports;
  },
  setMinuteReportsPagination(state, payload) {
    state.minuteReportsPagination = payload;
  },
  setBasicField(state, { field, value }) {
    state[field] = value;
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
  async fetchMinuteReports({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/post-paid/minutes-report/", { params: params })
      .then(res => {
        commit("setMinuteReports", { minuteReports: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setMinuteReportsPagination", {
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
  async fetchMinuteReport({ commit }, payload) {
    return await this.$axios
      .get(`/api/v1/post-paid/minutes-report/${payload.id}/`)
      .then(res => {
        commit("setPlanDetail", { minuteReport: res.data });
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
  async saveMinuteReport({ commit }, payload) {
    let url = "/api/v1/post-paid/minutes-report/";
    try {
      return await this.$axios.post(url, payload).then(() => {
        commit("setBasicField", payload);
      });
    } catch (err) {
      console.error(err);
    }
  },
  async updatePlanDetail({ commit }, payload) {
    let url = `/api/v1/post-paid/minutes-report/${payload.id}/`;
    let method = "put";
    return await this.$axios[method](url, payload).then(res => {
      return res.data;
    });
  }
};

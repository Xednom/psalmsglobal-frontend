const blankState = {
  company: "",
  sub_number: false,
  caller_id_detail: "",
  vodaconnect_plan: null,
  original_line: "",
  call_forwarding_number: "",
  vodaconnect_line_type: null
};

export const state = () => ({
  ...blankState,
  phoneSystems: [],
  vodaConnectLineTypes: [],
  vodaConnectPlans: [],
  phoneSystem: {},
  phoneSystemsPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1
  }
});

export const getters = {
  company: state => state.company,
  sub_number: state => state.sub_number,
  caller_id_detail: state => state.caller_id_detail,
  vodaconnect_plan: state => state.vodaconnect_plan,
  original_line: state => state.original_line,
  call_forwarding_number: state => state.call_forwarding_number,
  phoneSystemsPagination: state => state.phoneSystemsPagination,
  vodaConnectPlans: state => state.vodaConnectPlans,
  vodaConnectLineTypes: state => state.vodaConnectLineTypes,
  phoneSystems: state => state.phoneSystems,
  phoneSystem: state => {
    return state.phoneSystem;
  }
};

export const mutations = {
  setPhoneSystem(state, payload) {
    state.phoneSystem = payload.phoneSystem;
  },
  setVodaConnectLineTypes(state, payload) {
    state.vodaConnectLineTypes = payload.vodaConnectLineTypes;
  },
  setVodaConnectPlans(state, payload) {
    state.vodaConnectPlans = payload.vodaConnectPlans;
  },
  setPhoneSystemsPagination(state, payload) {
    state.phoneSystemsPagination = payload;
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
  async fetchPhoneSystems({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/phone-system/", { params: params })
      .then(res => {
        commit("setPhoneSystems", { phoneSystems: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setPhoneSystemsPagination", {
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
  async fetchVodaConnectPlans({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/vodaconnect-plan/", { params: params })
      .then(res => {
        commit("setVodaConnectPlans", { vodaConnectPlans: res.data.results });
        return res;
      })
      .catch(e => {
        throw e;
      });
  },
  async fetchVodaConnectLineTypes({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/vodaconnect-line-type/", { params: params })
      .then(res => {
        commit("setVodaConnectLineTypes", { vodaConnectLineTypes: res.data.results });
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
  async fetchPhoneSystem({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/phone-system/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then(res => {
        commit("setPhoneSystem", { phoneSystem: res.data });
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
  async savePhone({ commit }, payload) {
    let url = "/api/v1/phone-system/";
    try {
      return await this.$axios.post(url, payload).then(() => {
        commit("setBasicField", payload);
      });
    } catch (err) {
      console.error(err);
    }
  },
  async updatePhone({ commit }, payload) {
    let url = `/api/v1/phone-system/${payload.id}/`;
    let method = "put";
    return await this.$axios[method](url, payload).then(res => {
      return res.data;
    });
  },
  reset({ commit }) {
    commit("reset");
  }
};

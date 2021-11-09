const blankState = {
  date: "",
  client: null,
  vodaconnect_number: "",
  type_charge: "",
  amount: 0.0,
  payment_reference: "",
  payment_status: "",
  notes: ""
};

export const state = () => ({
  ...blankState,
  otherCharges: [],
  otherCharge: {},
  otherChargesPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1
  }
});

export const getters = {
  date: state => state.date,
  client: state => state.client,
  vodaconnect_number: state => state.vodaconnect_number,
  type_charge: state => state.type_charge,
  amount: state => state.amount,
  payment_reference: state => state.payment_reference,
  payment_status: state => state.payment_status,
  notes: state => state.notes,
  otherChargesPagination: state => state.otherChargesPagination,
  otherCharges: state => state.otherCharges,
  otherCharge: state => {
    return state.otherCharge;
  }
};

export const mutations = {
  setOtherCharge(state, payload) {
    state.otherCharge = payload.otherCharge;
  },
  setOtherCharges(state, payload) {
    state.otherCharges = payload.otherCharges;
  },
  setOtherChargesPagination(state, payload) {
    state.otherChargesPagination = payload;
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
  async fetchOtherCharges({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/vodaconnect/other-charge/", { params: params })
      .then(res => {
        commit("setOtherCharges", { otherCharges: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setOtherChargesPagination", {
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
  async fetchOtherCharge({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/vodaconnect/other-charge/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then(res => {
        commit("setOtherCharge", { otherCharge: res.data });
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
  async saveOtherCharge({ commit }, payload) {
    let url = "/api/v1/vodaconnect/active-plan-detail/";
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

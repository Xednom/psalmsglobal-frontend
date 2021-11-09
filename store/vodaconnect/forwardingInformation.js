const blankState = {
  client: null,
  client_name: "",
  forwarding_number: "",
  notes: "",
  forwarding_information_total_number_of_extensions: [],
  forwarding_information_zip_trunk_logins: [],
  forwarding_information_other_logins: []
};

export const state = () => ({
  ...blankState,
  informations: [],
  information: {},
  informationsPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1
  }
});

export const getters = {
  client: state => state.client,
  client_name: state => state.client_name,
  forwarding_number: state => state.forwarding_number,
  notes: state => state.notes,
  forwarding_information_total_number_of_extensions: state => state.forwarding_information_total_number_of_extensions,
  forwarding_information_zip_trunk_logins: state => state.forwarding_information_zip_trunk_logins,
  forwarding_information_other_logins: state => state.forwarding_information_other_logins,
  informationsPagination: state => state.informationsPagination,
  informations: state => state.informations,
  information: state => {
    return state.information;
  }
};

export const mutations = {
  setInformation(state, payload) {
    state.information = payload.information;
  },
  setInformations(state, payload) {
    state.informations = payload.informations;
  },
  setInformationsPagination(state, payload) {
    state.informationsPagination = payload;
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
  async fetchInformations({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/vodaconnect/forwarding-information/", { params: params })
      .then(res => {
        commit("setInformations", { informations: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setInformationsPagination", {
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
  async fetchInformation({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/vodaconnect/forwarding-information/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then(res => {
        commit("setInformation", { information: res.data });
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
  async saveInformation({ commit }, payload) {
    let url = "/api/v1/vodaconnect/forwarding-information/";
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

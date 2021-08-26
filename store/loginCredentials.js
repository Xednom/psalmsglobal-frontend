const blankState = {
  client: null,
  staff: null,
  category: "",
  url: "",
  username: "",
  password: "",
  notes: ""
};

export const state = () => ({
  ...blankState,
  loginCredentials: [],
  loginCredential: {},
  loginCredentialsPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1
  }
});

export const getters = {
  client: state => state.client,
  staff: state => state.staff,
  url: state => state.url,
  category: state => state.category,
  username: state => state.username,
  password: state => state.password,
  notes: state => state.notes,
  loginCredentials: state => state.loginCredentials,
  loginCredentialsPagination: state => state.loginCredentialsPagination,
  loginCredential: state => {
    return state.loginCredential;
  }
};

export const mutations = {
  setLoginCredential(state, payload) {
    state.loginCredential = payload.loginCredential;
  },
  setLoginCredentials(state, payload) {
    state.loginCredentials = payload.loginCredentials;
  },
  setLoginCredentialsPagination(state, payload) {
    state.loginCredentialsPagination = payload;
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
  async fetchLoginCredentials({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/login-credentials/", { params: params })
      .then(res => {
        commit("setLoginCredentials", { loginCredentials: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setLoginCredentialsPagination", {
          offset: offset,
          count: res.data.count,
          next: res.data.next,
          previous: res.data.previous,
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
  async fetchLoginCredential({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/login-credentials/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then(res => {
        commit("setLoginCredential", { loginCredential: res.data });
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
  async saveLogin({ commit }, payload) {
    let url = "/api/v1/login-credentials/";
    return await this.$axios.post(url, payload).then(() => {
      commit("setBasicField", payload);
    });
  },
  async updateLogin({ commit }, payload) {
    let url = `/api/v1/login-credentials/${payload.id}/`;
    let method = "put";
    return await this.$axios[method](url, payload).then(res => {
      return res.data;
    });
  },
  reset({ commit }) {
    commit("reset");
  }
};

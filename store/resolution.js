const resolutionBlankState = {
  category: null,
  description: "",
  assigned_to: null,
  client: null,
  status: ""
};

const resolutionConvoBlankState = {
  resolution: null,
  user: null,
  comment: ""
};

export const state = () => ({
  ...resolutionBlankState,
  ...resolutionConvoBlankState,
  resolutions: [],
  resolutionConversations: [],
  resolutionCategory: [],
  resolutionObj: {},
  resolutionConversation: {},
  resolutionsPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1
  },
  resolutionConvertionsPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1
  }
});

export const getters = {
  category: state => state.category,
  description: state => state.description,
  assigned_to: state => state.assigned_to,
  client: state => state.client,
  status: state => state.status,
  resolution: state => state.resolution,
  user: state => state.user,
  comment: state => state.comment,
  resolutions: state => state.resolutions,
  resolutionConversations: state => state.resolutionConversations,
  resolutionCategory: state => state.resolutionCategory,
  resolutionsPagination: state => state.resolutionsPagination,
  resolutionConvertionsPagination: state =>
    state.resolutionConvertionsPagination,
  resolutionObj: state => {
    return state.resolutionObj;
  },
  resolutionConversation: state => {
    return state.resolutionConversation;
  }
};

export const mutations = {
  setResolutions(state, payload) {
    state.resolutions = payload.resolutions;
  },
  setResolution(state, payload) {
    state.resolutionObj = payload.resolutionObj;
  },
  setResolutionConversations(state, payload) {
    state.resolutionConversations = payload.resolutionConversations;
  },
  setResolutionCategory(state, payload) {
    state.resolutionCategory = payload.resolutionCategory;
  },
  setResolutionsPagination(state, payload) {
    state.resolutionsPagination = payload;
  },
  setResolutionConversationsPagination(state, payload) {
    state.resolutionConvertionsPagination = payload;
  },
  setBasicField(state, { field, value }) {
    state[field] = value;
  },
  resetResolution(state) {
    Object.assign(state, resolutionBlankState);
  },
  resetResolutionConversation(state) {
    Object.assign(state, resolutionConvoBlankState);
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
  async fetchResolutions({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/resolution/", { params: params })
      .then(res => {
        commit("setResolutions", { resolutions: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setResolutionsPagination", {
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
  async fetchResolutionConversations({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/resolution-conversation/", { params: params })
      .then(res => {
        commit("setResolutions", { resolutionConversations: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setResolutionConversationsPagination", {
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
  async fetchResolutionCategory({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/resolution-category/", { params: params })
      .then(res => {
        commit("setResolutionCategory", {
          resolutionCategory: res.data.results
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
  async fetchResolution({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/resolution/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then(res => {
        commit("setResolution", { resolutionObj: res.data });
        return res;
      })
      .catch(e => {});
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
  async saveResolution({ commit }, payload) {
    let url = `/api/v1/resolution/`;
    let method = "post";
    if (payload.id) {
      method = "put";
      url += `${payload.id}/`;
      return await this.$axios[method](url, payload);
    }
    return await this.$axios[method](url, payload).then(res => {
      this.$router.push({
        name: "resolution-id",
        params: { id: res.data.id }
      });
    });
  },
  async saveResolutionConversation({ commit }, payload) {
    let url = `/api/v1/resolution-conversation/`;
    let method = "post";
    if (payload.id) {
      method = "put";
      url += `${payload.id}/`;
      return await this.$axios[method](url, payload);
    }
    return await this.$axios[method](url, payload).then(res => {});
  },
  resetResolution({ commit }) {
    commit("resetResolution");
  },
  resetResolutionConversation({ commit }) {
    commit("resetResolutionConversation");
  }
};

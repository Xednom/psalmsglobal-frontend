const blankState = {
    client: "",
    file_name: "",
    url: "",
    file_description: "",
    staff: "",
  };
  
  export const state = () => ({
    ...blankState,
    accountFiles: [],
    accountFile: {},
    accountFilesPagination: {
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1,
    },
  });
  
  export const getters = {
    client: (state) => state.client,
    file_name: (state) => state.file_name,
    url: (state) => state.url,
    file_description: (state) => state.file_description,
    staff: (state) => state.staff,
    accountFiles: (state) => state.accountFiles,
    accountFilesPagination: (state) => state.accountFilesPagination,
    accountFile: (state) => {
      return state.accountFile;
    },
  };
  
  export const mutations = {
    setAccountFile(state, payload) {
      state.accountFile = payload.accountFile;
    },
    setAccountFiles(state, payload) {
      state.accountFiles = payload.accountFiles;
    },
    setAccountFilesPagination(state, payload) {
      state.accountsPagination = payload;
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
    async fetchAccountFiles({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/account-files/", { params: params })
        .then((res) => {
          commit("setAccountFiles", { accountFiles: res.data.results });
          const offset = getOffset(res.data.previous);
          commit("setAccountFilesPagination", {
            offset: offset,
            count: res.data.count,
          //   next: res.data.next,
          //   previous: res.data.previous,
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
    async fetchAccountFile({ commit, dispatch }, payload) {
      let endpoint = `/api/v1/account-files/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          commit("setAccountFile", { accountFile: res.data });
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
    async saveAccount({ commit }, payload) {
      let url = "/api/v1/account-files/";
      try {
        return await this.$axios.post(url, payload).then(() => {
          commit("setBasicField", payload);
        });
      } catch (err) {
        console.error(err);
      }
    },
    async updateAccountFiles({ commit }, payload) {
      let url = `/api/v1/account-files/${payload.id}/`;
      let method = "put";
      return await this.$axios[method](url, payload).then((res) => {
        return res.data;
      });
    },
    reset({ commit }) {
      commit("reset");
    },
  };
  
const blankState = {
    vodaconnect_number: "",
    client: null,
    client_name: "",
    client_code: "",
    company_name: "",
  };
  
  export const state = () => ({
    ...blankState,
    voipInformations: [],
    voipInformation: {},
    voipInformationsPagination: {
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1
    }
  });
  
  export const getters = {
    vodaconnect_number: state => state.vodaconnect_number,
    client: state => state.client,
    client_code: state => state.client_code,
    company_name: state => state.company_name,
    voipInformationsPagination: state => state.voipInformationsPagination,
    voipInformations: state => state.voipInformations,
    voipInformation: state => {
      return state.voipInformation;
    }
  };
  
  export const mutations = {
    setVoipInformation(state, payload) {
      state.voipInformation = payload.voipInformation;
    },
    setVoipInformations(state, payload) {
      state.voipInformations = payload.voipInformations;
    },
    setVoipInformationsPagination(state, payload) {
      state.voipInformationsPagination = payload;
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
    async fetchVoipInformations({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/vodaconnect/voip-information/", { params: params })
        .then(res => {
          commit("setVoipInformations", { voipInformations: res.data.results });
          const offset = getOffset(res.data.previous);
          commit("setVoipInformationsPagination", {
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
    async fetchVoipInformation({ commit, dispatch }, payload) {
      let endpoint = `/api/v1/vodaconnect/voip-information/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          commit("setVoipInformation", { voipInformation: res.data });
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
    async saveVoipInformation({ commit }, payload) {
      let url = "/api/v1/vodaconnect/voip-information/";
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
  
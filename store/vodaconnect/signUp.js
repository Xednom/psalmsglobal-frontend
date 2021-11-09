const blankState = {
    file_description: "",
    url: ""
  };
  
  export const state = () => ({
    ...blankState,
    signUps: [],
    signUp: {},
    signUpsPagination: {
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1
    }
  });
  
  export const getters = {
    file_description: state => state.file_description,
    order_request_date: state => state.order_request_date,
    signUpsPagination: state => state.signUpsPagination,
    signUps: state => state.signUps,
    signUp: state => {
      return state.signUp;
    }
  };
  
  export const mutations = {
    setSignUp(state, payload) {
      state.signUp = payload.signUp;
    },
    setSignUps(state, payload) {
      state.signUps = payload.signUps;
    },
    setSignUpsPagination(state, payload) {
      state.signUpsPagination = payload;
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
    async fetchSignUps({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/vodaconnect/vodaconnect-signup/", { params: params })
        .then(res => {
          commit("setSignUps", { signUps: res.data.results });
          const offset = getOffset(res.data.previous);
          commit("setSignUpsPagination", {
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
    async fetchActivationDetail({ commit, dispatch }, payload) {
      let endpoint = `/api/v1/vodaconnect/vodaconnect-signup/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          commit("setSignUp", { signUp: res.data });
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
    async saveSignUp({ commit }, payload) {
      let url = "/api/v1/vodaconnect/vodaconnect-signup/";
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
  
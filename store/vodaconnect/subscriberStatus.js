const blankState = {
    client: null,
    status_in_production: "",
    type_of_request: "",
    testimony: "",
  };
  
  export const state = () => ({
    ...blankState,
    subscriberStatuses: [],
    subscriberStatus: {},
    subscriberStatusesPagination: {
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1
    }
  });
  
  export const getters = {
    client: state => state.client,
    status_in_production: state => state.status_in_production,
    type_of_request: state => state.type_of_request,
    testimony: state => state.testimony,
    subscriberStatusesPagination: state => state.subscriberStatusesPagination,
    subscriberStatuses: state => state.subscriberStatuses,
    subscriberStatus: state => {
      return state.subscriberStatus;
    }
  };
  
  export const mutations = {
    setSubscriberStatus(state, payload) {
      state.subscriberStatus = payload.subscriberStatus;
    },
    setSubscriberStatuses(state, payload) {
      state.subscriberStatuses = payload.subscriberStatuses;
    },
    setSubscriberStatusesPagination(state, payload) {
      state.subscriberStatusesPagination = payload;
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
    async fetchSubscriberStatuses({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/vodaconnect/subscriber-status/", { params: params })
        .then(res => {
          commit("setSubscriberStatuses", { subscriberStatuses: res.data.results });
          const offset = getOffset(res.data.previous);
          commit("setSubscriberStatusesPagination", {
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
    async fetchSubscriberStatus({ commit, dispatch }, payload) {
      let endpoint = `/api/v1/vodaconnect/subscriber-status/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          commit("setSubscriberStatus", { subscriberStatus: res.data });
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
      let url = "/api/v1/vodaconnect/subscriber-status/";
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
  
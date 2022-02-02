const blankState = {
    post_paid: null,
    rating: 5,
    comment: "",
    client: null,
  };
  
  export const state = () => ({
    ...blankState,
    interactionRates: [],
    interactionRate: {},
  });
  
  export const getters = {
    post_paid: state => state.post_paid,
    rating: state => state.rating,
    comment: state => state.comment,
    client: state => state.client,
    interactionRates: state => state.interactionRates,
    interactionRate: state => {
      return state.interactionRate;
    }
  };
  
  export const mutations = {
    setInteractionRate(state, payload) {
      state.interactionRate = payload.interactionRate;
    },
    setInteractionRates(state, payload) {
      state.interactionRates = payload.interactionRates;
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
    async savePostpaidRating({ commit }, payload) {
      console.log(payload);
      let url = `/api/v1/postpaid/${payload.post_paid}/rate/`;
      return await this.$axios.post(url, payload).then(() => {
        commit("setBasicField", payload);
      });
    },
    async savePrepaidRating({ commit }, payload) {
      console.log(payload);
      let url = `/api/v1/prepaid/${payload.prepaid}/rate/`;
      return await this.$axios.post(url, payload).then(() => {
        commit("setBasicField", payload);
      });
    },
    reset({ commit }) {
      commit("reset");
    }
  };
  
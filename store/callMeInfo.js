const blankState = {
  company: null,
  apn: "",
  reference: "",
  property_size: "",
  short_legal_description: "",
  property_address: "",
  property_city: "",
  property_county: "",
  property_state: "",
  property_zip: "",
  first_name: "",
  last_name: "",
  company_name: "",
  buyer_offer_amount: "",
  approved_option_amount: "",
  other_terms: "",
  seller_offer_amount: "",
  other_offer_terms: "",
  notes: "",
  offer_status: null,
  offer_status_notes: ""
};

export const state = () => ({
  ...blankState,
  callMeInfos: [],
  propertyInfos: [],
  propertyInfo: {},
  callMeInfo: {},
  offerStatuses: [],
  callMeInfosPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1
  },
  propertyInfosPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1
  }
});

export const getters = {
  company: state => state.company,
  apn: state => state.apn,
  reference: state => state.reference,
  property_size: state => state.property_size,
  short_legal_description: state => state.short_legal_description,
  property_address: state => state.property_address,
  property_city: state => state.property_city,
  property_county: state => state.property_county,
  property_state: state => state.property_state,
  property_zip: state => state.property_zip,
  first_name: state => state.first_name,
  last_name: state => state.last_name,
  company_name: state => state.company_name,
  buyer_offer_amount: state => state.buyer_offer_amount,
  approved_option_amount: state => state.approved_option_amount,
  other_terms: state => state.other_terms,
  seller_offer_amount: state => state.seller_offer_amount,
  other_offer_terms: state => state.other_offer_terms,
  notes: state => state.notes,
  offer_status: state => state.offer_status,
  offer_status_notes: state => state.offer_status_notes,
  callMeInfosPagination: state => state.callMeInfosPagination,
  propertyInfosPagination: state => state.propertyInfosPagination,
  offerStatuses: state => state.offerStatuses,
  callMeInfos: state => state.callMeInfos,
  propertyInfos: state => state.propertyInfos,
  callMeInfo: state => {
    return state.callMeInfo;
  },
  proeprtyInfo: state => {
    return state.propertyInfo;
  }
};

export const mutations = {
  setCallMeInfo(state, payload) {
    state.callMeInfo = payload.callMeInfo;
  },
  setCallMeInfos(state, payload) {
    state.callMeInfos = payload.callMeInfos;
  },
  setPropertyInfo(state, payload) {
    state.propertyInfo = payload.propertyInfo;
  },
  setPropertyInfos(state, payload) {
    state.propertyInfos = payload.propertyInfos;
  },
  setOfferStatuses(state, payload) {
    state.offerStatuses = payload.offerStatuses;
  },
  setCallMeInfosPagination(state, payload) {
    state.callMeInfosPagination = payload;
  },
  setPropertyInfosPagination(state, payload) {
    state.propertyInfosPagination = payload;
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
  async fetchCallMeInfos({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/post-paid/callme-info/", { params: params })
      .then(res => {
        commit("setCallMeInfos", { callMeInfos: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setCallMeInfosPagination", {
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
  async fetchPropertyInfos({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/property-info/", { params: params })
      .then(res => {
        commit("setPropertyInfos", { propertyInfos: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setPropertyInfosPagination", {
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
  async fetchCallMeInfo({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/callme-info/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then(res => {
        commit("setInteraction", { interaction: res.data });
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
  async saveCallMeInfo({ commit }, payload) {
    let url = "/api/v1/callme-info/";
    try {
      return await this.$axios.post(url, payload).then(res => {
        commit("setBasicField", payload);
      });
    } catch (err) {
      console.error(err);
    }
  },
  async updateCallMeInfo({ commit }, payload) {
    let url = `/api/v1/callme-info/${payload.id}/`;
    let method = "put";
    return await this.$axios[method](url, payload).then(res => {
      return res.data;
    });
  },
  reset({ commit }) {
    commit("reset");
  }
};

const blankState = {
  client_code: "",
  full_name: "",
  company_name: "",
  reference_number: "",
  apn: "",
  county: "",
  state: "",
  size: "",
  address: "",
  price: "",
  due_diligence: "",
  ad_content: "",
  images: "",
  website: "",
  comment_offer_tab_customer: "",
  comment_offer_tab_client: "",
  comment_sales_agent_notes: "",
  facebook: "",
  fb_groups: "",
  landmodo: "",
  fsbo: "",
  instagram: "",
  land_listing: "",
  land_flip: "",
  land_hub: "",
  land_century: "",
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
    currentPage: 1,
  },
  propertyInfosPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1,
  },
});

export const getters = {
  company_name: (state) => state.company_name,
  apn: (state) => state.apn,
  reference_number: (state) => state.reference_number,
  county: (state) => state.county,
  state: (state) => state.state,
  size: (state) => state.size,
  address: (state) => state.address,
  price: (state) => state.price,
  due_diligence: (state) => state.due_diligence,
  ad_content: (state) => state.ad_content,
  images: (state) => state.images,
  website: (state) => state.website,
  comment_offer_tab_customer: (state) => state.comment_offer_tab_customer,
  comment_offer_tab_client: (state) => state.comment_offer_tab_client,
  comment_sales_agent_notes: (state) => state.comment_sales_agent_notes,
  facebook: (state) => state.facebook,
  fb_groups: (state) => state.fb_groups,
  landmodo: (state) => state.landmodo,
  fsbo: (state) => state.fsbo,
  instagram: (state) => state.instagram,
  land_listing: (state) => state.land_listing,
  land_flip: (state) => state.land_flip,
  land_hub: (state) => state.land_hub,
  land_century: (state) => state.land_century,
  callMeInfosPagination: (state) => state.callMeInfosPagination,
  propertyInfosPagination: (state) => state.propertyInfosPagination,
  offerStatuses: (state) => state.offerStatuses,
  callMeInfos: (state) => state.callMeInfos,
  propertyInfos: (state) => state.propertyInfos,
  callMeInfo: (state) => {
    return state.callMeInfo;
  },
  proeprtyInfo: (state) => {
    return state.propertyInfo;
  },
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
  async fetchCallMeInfos({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/post-paid/callme-info/", { params: params })
      .then((res) => {
        commit("setCallMeInfos", { callMeInfos: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setCallMeInfosPagination", {
          offset: offset,
          count: res.data.count,
          showing: res.data.results.length,
          currentPage: offset / 12 + 1,
        });
        return res;
      })
      .catch((e) => {
        throw e;
      });
  },
  async fetchPropertyInfos({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/callme-info/", { params: params })
      .then((res) => {
        commit("setPropertyInfos", { propertyInfos: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setPropertyInfosPagination", {
          offset: offset,
          count: res.data.count,
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
  async fetchCallMeInfo({ commit, dispatch }, payload) {
    console.warn("Payload fetch callme info: ", payload.id);
    let endpoint = `/api/v1/callme-info/${payload.id}/`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        console.warn("Callme info: ", res.data);
        commit("setCallMeInfo", { callMeInfo: res.data });
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
  async saveCallMeInfo({ commit }, payload) {
    try {
      var url = "/api/v1/callme-info/";
      var method = "post";

      console.info("Save callme info: ", payload);

      if (payload.id) {
        method = "put";
        url = url + payload.id + "/";
      }

      return await this.$axios[method](url, payload).then((res) => {
        commit("setBasicField", payload);
      });
    } catch (err) {
      console.error(err);
    }
  },
  async upload({ commit }, payload) {
    let url = "/api/v1/file-upload/";
    return await this.$axios
      .post(url, payload, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      })
      .then((res) => {
        commit("setBasicField", payload);
      });
  },
  async updateCallMeInfo({ commit }, payload) {
    let url = `/api/v1/callme-info/${payload.id}/`;
    let method = "put";
    return await this.$axios[method](url, payload).then((res) => {
      return res.data;
    });
  },
  reset({ commit }) {
    commit("reset");
  },
};

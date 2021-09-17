const blankState = {
  title: "",
  body: "",
  comment: "",
};

export const state = () => ({
  ...blankState,
  newsFeeds: [],
  newsFeed: {},
  newsFeedsPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1
  }
});

export const getters = {
  title: state => state.title,
  body: state => state.body,
  newsFeedsPagination: state => state.newsFeedsPagination,
  newsFeeds: state => state.newsFeeds,
  comment: state => state.comment,
  query: state => state.query,
  newsFeed: state => {
      return state.newsFeed
  }
};

export const mutations = {
  setNewsFeed(state, payload) {
    state.newsFeed = payload.newsFeed;
  },
  setNewsFeeds(state, payload) {
    state.newsFeeds = payload.newsFeeds;
  },
  setNewsFeedsPagination(state, payload) {
    state.NewsFeedsPagination = payload;
  },
  setBasicField(state, {field, value}) {
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
  async fetchNewsFeeds({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/newsfeed/", { params: params })
      .then(res => {
        commit("setNewsFeeds", { newsFeeds: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setNewsFeedsPagination", {
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
  async fetchNewsFeed({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/newsfeed/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then(res => {
        commit("setNewsFeed", { newsFeed: res.data });
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
        commit("setUser", {user: res.data} );
      })
      .catch(e => {
        throw e;
      });
  },
  async saveNewsFeed({ commit }, payload) {
    let url = "/api/v1/newsfeed/";
    try {
      return await this.$axios.post(url, payload).then(() => {
        commit("setBasicField", payload);
      })
    } catch(err) {
      console.error(err)
    }
  },
  async newsFeedComment({ commit }, payload, id) {
    let url = `/api/v1/job-order-comment/${id}/`;
    try {
      return await this.$axios.put(url, payload).then(() => {
        commit("setBasicField", payload);
      })
    } catch(err) {
      console.error(err)
    }
  },
  async updateNewsFeed({ commit }, payload) {
    let url = `/api/v1/newsfeed/${payload.ticket_number}/`;
    let method = "put";
    return await this.$axios[method](url, payload).then((res) => {
      return res.data;
    });
  },
  reset({commit}) {
    commit("reset");
  }
};

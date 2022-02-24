const threadState = {
  title: "",
  content: "",
  author: null,
  staff_carbon_copy: [],
  client_carbon_copy: [],
  is_active: true
};

const commentState = {
  comment: ""
};

const replyState = {
  content: ""
};

export const state = () => ({
  ...threadState,
  ...commentState,
  ...replyState,
  threads: [],
  thread: {},
  threadsPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1
  }
});

export const getters = {
  title: state => state.title,
  content: state => state.content,
  author: state => state.author,
  staff_carbon_copy: state => state.staff_carbon_copy,
  client_carbon_copy: state => state.client_carbon_copy,
  is_active: state => state.is_active,
  threads: state => state.threads,
  comment: state => state.comment,
  content: state => state.content,
  threadsPagination: state => state.threadsPagination,
  thread: state => {
    return state.thread;
  }
};

export const mutations = {
  setThread(state, payload) {
    state.thread = payload.thread;
  },
  setThreads(state, payload) {
    state.threads = payload.threads;
  },
  setBasicField(state, { field, value }) {
    state[field] = value;
  },
  resetThread(state) {
    Object.assign(state, threadState);
  },
  resetComment(state) {
    Object.assign(state, commentState);
  },
  resetContent(state) {
    Object.assign(state, replyState);
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
  async fetchThreads({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/thread/", { params: params })
      .then(res => {
        commit("setThreads", { threads: res.data.results });
        return res;
      })
      .catch(e => {
        throw e;
      });
  },
  async fetchThread({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/thread/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then(res => {
        commit("setThread", { thread: res.data });
      })
      .catch(e => {
        throw e;
      });
  },
  async saveThread({ commit }, payload) {
    let url = "/api/v1/thread/";
    try {
      return await this.$axios.post(url, payload).then(res => {
        this.$router.push({
          name: "forums-id___en",
          params: { id: res.data.id }
        });
        commit("setBasicField", payload);
      });
    } catch (err) {
      console.error(err);
    }
  },
  async saveComment({ commit }, payload) {
    let url = `/api/v1/thread/${payload.id}/comment/`;
    try {
      await this.$axios.post(url, payload).then(res => {
        return res.data;
      });
    } catch (e) {
      throw e;
    }
  },
  async saveReply({ commit }, payload) {
    let url = `/api/v1/reply/${payload.id}/`;
    try {
      await this.$axios.post(url, payload).then(res => {
        return res.data;
      });
    } catch (e) {
      throw e;
    }
  },
  resetThread({ commit }) {
    commit("resetThread");
  },
  resetComment({ commit }) {
    commit("resetComment");
  },
  resetReply({ commit }) {
    commit("resetContent");
  },
};

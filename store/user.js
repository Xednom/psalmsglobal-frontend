const blankState = {
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    is_staff: false,
    is_active: false,
    is_superuser: false,
    designation_category: "",
    company_category: "",
    client: {
      client_code: "",
      affiliate_partner_code: "",
      affiliate_partner_name: "",
      pin: "",
      lead_information: "",
      customer_id: "",
      client_files: []
    }
  };
  
  export const state = () => ({
    ...blankState,
    users: [],
    user: {},
    clientUser: {},
    staff: {},
    staffs: [],
    usersPagination: {
      limit: 12,
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1
    }
  });
  
  export const getters = {
    username: state => state.username,
    password: state => state.password,
    first_name: state => state.first_name,
    last_name: state => state.last_name,
    email: state => state.email,
    is_staff: state => state.is_staff,
    is_active: state => state.is_active,
    is_superuser: state => state.is_superuser,
    designation_category: state => state.designation_category,
    company_category: state => state.company_category,
    client: state => state.client,
    users: state => state.users,
    staffs: state => state.staffs,
    user: state => {
      return state.user;
    },
    clientUser: state => {
      return state.clientUser;
    },
    staff: state => {
      return state.staff;
    },
    usersPagination: state => state.usersPagination
  };
  
  export const mutations = {
    setUser(state, payload) {
      state.user = payload.user;
    },
    setClientUser(state, payload) {
      state.clientUser = payload.clientUser;
    },
    setStaff(state, payload) {
      state.staff = payload.staff;
    },
    setUsers(state, payload) {
      state.users = payload.users;
    },
    setUsersPagination(state, payload) {
      state.usersPagination = payload;
    },
    setBasicField(state, {field, value}) {
      state[field] = value;
    },
    updateFirstName (state, firstName) {
      state.user.first_name = firstName
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
    async fetchUsers({ commit, dispatch }, params) {
      return await this.$axios
        .get("/auth/users/", { params: params })
        .then(res => {
          commit("setUsers", { users: res.data.results });
          const offset = getOffset(res.data.previous);
          commit("setUsersPagination", {
            limit: 12,
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
      let endpoint = `/api/auth/users/me/`;
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
    async fetchClientUser({ commit, dispatch }, payload) {
      let endpoint = `/api/auth/client/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          commit("setClientUser", { clientUser: res.data });
        })
        .catch(e => {
          throw e;
        });
    },
    async fetchStaff({commit, dispatch}, payload) {
      this.loading = true;
      let endpoint = `/api/auth/staff/${payload}`;
      try {
        await this.$axios.get(endpoint).then(res => {
          commit("setStaff", {staff: res.data})
        });
      } catch (err) {
        throw err;
      }
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
    async saveMe({ commit }, payload) {
      let url = "/auth/users/me/";
      return await this.$axios.put(url, payload).then(res => {
        commit("setUser", payload);
      })
    },
    async updateClientUser({commit, dispatch}, payload) {
      let url = `/api/v1/client/${payload}/`;
      if (payload.id) {
        return await this.$axios.put(url, payload.id).then(res => {
          commit("setBasicField", payload);
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        })
      }
    },
    updateField({commit}, {first_name, fieldName, value}) {
      commit("updateField", {first_name, fieldName, value});
    },
    reset({commit}) {
      commit("reset");
    }
  };
  
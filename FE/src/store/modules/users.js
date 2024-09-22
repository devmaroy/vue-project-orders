import axios from "axios";

const state = {
  sampleData: [],
};

const getters = {
  getUsers: (state) => state.sampleData,
};

const actions = {
  fetchUsers({ commit }) {
    axios.get("http://localhost:3001/api/users").then((res) => {
      commit("SET_USERS", res.data);
    });
  },
};

const mutations = {
  SET_USERS: (state, data) => (state.sampleData = data),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

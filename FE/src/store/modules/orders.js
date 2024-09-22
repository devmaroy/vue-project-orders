import axios from "axios";

const state = {
  sampleData: [],
};

const getters = {
  getOrders: (state) => state.sampleData,
};

const actions = {
  fetchOrders({ commit }) {
    axios.get("http://localhost:3001/api/orders").then((res) => {
      commit("SET_ORDERS", res.data);
    });
  },
  async createOrder({ commit }, orderData) {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/orders",
        orderData
      );
      commit("ADD_ORDER", res.data);
      return res.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },
  async updateOrderStatus({ commit }, { id, state }) {
    try {
      const res = await axios.patch(`http://localhost:3001/api/orders/${id}`, {
        state,
      });
      commit("ADD_ORDER", res.data);
      return res.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },
};

const mutations = {
  SET_ORDERS: (state, data) => (state.sampleData = data),
  ADD_ORDER: (state, order) => state.sampleData.push(order),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

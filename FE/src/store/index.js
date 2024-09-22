import orders from "./modules/orders";
import users from "./modules/users";

import { createStore } from "vuex";

const store = createStore();
store.registerModule("orders", orders);
store.registerModule("users", users);

export default store;

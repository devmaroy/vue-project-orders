<template>
  <v-container>
    <Snackbar :snackbar="showSnack" @close="showSnack = false" />
    <Dialog
      :show="showDialog"
      :title="dialogTitle"
      :orderId="orderId"
      :isEditing="isEditMode"
      :closeButtonText="dialogCloseButtonText"
      :confirmButtonText="dialogConfirmButtonText"
      :confirm="isEditMode ? updateOrderStatus : createOrder"
      @close="showDialog = false"
    ></Dialog>

    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="5"
      class="elevation-1"
      :mobile-breakpoint="600"
      :dense="$vuetify.display.smAndDown"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Orders</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="add" :disabled="!users.length"
            >Přidat</v-btn
          >
        </v-toolbar>
      </template>

      <template #item.items="{ item }">
        <div v-for="product in item.items" :key="product.id">
          {{ product.name }} {{ product.price }} Kč
        </div>
      </template>

      <template #item.customerId="{ item }">
        {{ getUserName(item.customerId) }}
      </template>

      <template #item.state="{ item }">
        {{ states[item.state] }}
      </template>

      <template #item.action="{ item }">
        <v-btn size="x-small" @click="edit(item.id)">Upravit</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useDisplay } from "vuetify";
import Dialog from "./Dialog.vue";
import Snackbar from "./Snackbar.vue";

const store = useStore();
const { smAndDown } = useDisplay();
const showDialog = ref(false);
const showSnack = ref(false);
const isEditMode = ref(false);
const orderId = ref(null);

// Define table headers
const headers = [
  { text: "ID", value: "id", width: "10%" },
  { text: "Name", value: "items", width: "30%" },
  { text: "Customer", value: "customerId", width: "20%" },
  { text: "State", value: "state", width: "20%" },
  { text: "", value: "action", width: "20%" },
];

const states = {
  pending: "Vyřizuje se",
  shipped: "Posláno",
  delivered: "Doručeno",
  canceled: "Zrušeno",
};

// Fetch orders and users data
const items = computed(() => store.getters["orders/getOrders"]);
const users = computed(() => store.getters["users/getUsers"]);

onMounted(() => {
  store.dispatch("orders/fetchOrders");
  store.dispatch("users/fetchUsers");
});

const dialogTitle = computed(() =>
  isEditMode.value ? "Upravit objednávku" : "Přidat objednávku"
);

const dialogCloseButtonText = computed(() =>
  isEditMode.value ? "Zrušit" : "Zavřít"
);

const dialogConfirmButtonText = computed(() =>
  isEditMode.value ? "Upravit" : "Vytvořit"
);

const getUserName = (customerId) => {
  const user = users.value.find((user) => user.id === customerId);
  return user ? user.name : "Unknown User";
};

const edit = (id) => {
  orderId.value = id;
  showDialog.value = true;
  isEditMode.value = true;
};

const add = () => {
  if (users.value.length === 0) {
    console.error("No users available to create an order");
    return;
  }
  showDialog.value = true;
  isEditMode.value = false;
};

const createOrder = ({ state, items }) => {
  if (users.value.length === 0) {
    console.error("No users available to create an order");
    return;
  }

  const newOrder = {
    items,
    state,
    customerId: getRandomUserId(), // Mock user id
  };

  store
    .dispatch("orders/createOrder", newOrder)
    .then(() => {
      showDialog.value = false;
      showSnack.value = true;
      store.dispatch("orders/fetchOrders");
    })
    .catch((error) => {
      console.error("Error creating order:", error);
    });
};

const updateOrderStatus = ({ id, state }) => {
  store
    .dispatch("orders/updateOrderStatus", { id, state })
    .then(() => {
      showDialog.value = false;
      showSnack.value = true;
      store.dispatch("orders/fetchOrders");
    })
    .catch((error) => {
      console.error("Error updating order status:", error);
    });
};

const getRandomUserId = () => {
  const userIds = users.value.map((user) => user.id);
  return userIds[Math.floor(Math.random() * userIds.length)];
};
</script>

<style scoped>
.v-data-table {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  overflow-x: auto;
}

.v-data-table >>> td {
  white-space: nowrap;
}
</style>

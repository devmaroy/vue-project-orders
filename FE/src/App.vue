<template>
  <v-app>
    <v-main>
      <Orders></Orders>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();

onMounted(() => {
  store.dispatch("orders/fetchOrders");
});
</script>

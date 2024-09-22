<template>
  <v-dialog
    v-model="shouldBeVisible"
    persistent
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title>
        <span>{{ title }}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="isFormValid">
          <v-select
            v-model="selectedState"
            label="Status"
            :items="states"
            :rules="[(v) => !!v || 'Status is required']"
            required
          ></v-select>
          <div v-if="!isEditing">
            <div v-for="(product, index) in products" :key="index">
              <v-select
                v-model="products[index].product"
                label="Typ položky"
                :items="productTypes"
                :rules="[(v) => !!v || 'Product type is required']"
                required
              ></v-select>
              <v-text-field
                v-model="products[index].name"
                label="Název položky"
                :rules="[(v) => !!v || 'Product name is required']"
                required
              ></v-text-field>
              <v-text-field
                v-model="products[index].price"
                label="Cena"
                type="number"
                :rules="[
                  (v) => !!v || 'Price is required',
                  (v) => v > 0 || 'Price must be greater than 0',
                ]"
                required
              ></v-text-field>
            </div>
            <v-btn @click="addProduct">Přidat další</v-btn>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions class="mx-1">
        <v-spacer></v-spacer>
        <v-btn @click="emit('close')">{{ closeButtonText }}</v-btn>
        <v-btn
          color="success"
          variant="tonal"
          @click="handleConfirm"
          :disabled="!isFormValid"
        >
          {{ confirmButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  show: Boolean,
  orderId: String,
  isEditing: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Dialog Title",
  },
  closeButtonText: {
    type: String,
    default: "Close",
  },
  confirmButtonText: {
    type: String,
    default: "Confirm",
  },
  confirm: Function,
});

const states = [
  { title: "Vyřizuje se", value: "pending" },
  { title: "Posláno", value: "shipped" },
  { title: "Doručeno", value: "delivered" },
  { title: "Zrušeno", value: "canceled" },
];

const productTypes = [
  { title: "Myš", value: "mouse" },
  { title: "Klávesnice", value: "keyboard" },
  { title: "Monitor", value: "monitor" },
  { title: "Sluchátka", value: "headphones" },
];

const selectedState = ref("");
const products = ref([{ product: "", name: "", price: null }]);
const form = ref(null);
const isFormValid = ref(false);

const resetForm = () => {
  selectedState.value = "";
  products.value = [{ product: "", name: "", price: null }];
  if (form.value) {
    form.value.reset();
  }
};

const emit = defineEmits(["close"]);

const handleConfirm = async () => {
  const isValid = await form.value.validate();
  if (isValid) {
    props.confirm({
      id: props.orderId,
      state: selectedState.value,
      items: props.isEditing
        ? []
        : products.value.map(({ name, product, price }, index) => ({
            id: index + 1,
            name,
            product,
            price: Number(price),
          })),
    });

    resetForm();
  }
};

const shouldBeVisible = computed({
  get() {
    return props.show;
  },
  set() {
    emit("close");
  },
});

const addProduct = () => {
  products.value.push({ product: "", name: "", price: null });
};
</script>

<style lang="scss" scoped></style>

<template>
 <v-snackbar v-model="showSnack" :timeout="2000" :color="data?.color">
      {{ data?.text }}
    </v-snackbar>
</template>

<script setup>
import { computed } from 'vue';


const props = defineProps({
  snackbar: Boolean,
  data: Object
})

const emit = defineEmits(['close'])

const showSnack = computed({
  get() { return props.snackbar },
  set() { emit('close') },
})

</script>

<style lang="scss" scoped>

</style>
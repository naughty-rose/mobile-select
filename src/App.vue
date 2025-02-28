<script setup lang="ts">
import { ref } from 'vue'
import mobileSelect from './components/mobile-select.vue'

const sel = ref('')
const options = ref([
  {
    label: '选项一',
    value: '选项一',
  },
  {
    label: '选项二',
    value: '选项二',
  },
  {
    label: '选项三',
    value: '选项三',
  },
  {
    label: '选项四',
    value: '选项四',
  },
  {
    label: '选项五',
    value: '选项五',
  },
])
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div>
      <mobile-select v-model="sel" :options="options" />
      <mobile-select v-model="sel" :options="options" />
      <mobile-select v-model="sel" :options="options" />
      <mobile-select v-model="sel" :options="options" />
      <mobile-select v-model="sel" :options="options" />
    </div>
  </header>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>

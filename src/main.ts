import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import ClickOutside from './components/click-outside'

import mobileSelect from './components/mobile-select.vue'

const app = createApp(App)

app.directive('click-outside', ClickOutside)

app.mount('#app')

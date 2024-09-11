
import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'


import {plugin as VueInputAutowidth} from 'vue-input-autowidth'


const app = createApp(App)

app.use(VueInputAutowidth)

app.mount('#app')
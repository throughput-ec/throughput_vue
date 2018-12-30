<template>
  <div id="app" class="mainpage">
    <app-header></app-header>
    <app-insertform></app-insertform>
  </div>
</template>

<script>
  import InsertForm from './components/insertform.vue'
  import header from './components/header.vue'

  import './assets/containers.css'
  import './assets/text.css'

  export default {
    name: 'app',
    components: {
      'app-insertform': InsertForm,
      'app-header': header
    }
  }
</script>

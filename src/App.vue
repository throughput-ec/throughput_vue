<template>
  <div id="app" class="mainpage">
    <app-header></app-header>
    <app-start></app-start>
    <!--<app-insertform></app-insertform>-->
  </div>
</template>

<script>
  import InsertForm from './components/insertform.vue'
  import header from './components/header.vue'
  import startForm from './components/simple_search.vue'

  import './assets/containers.css'
  // import './assets/text.css'
  import './assets/d3styles.css'

  export default {
    name: 'app',
    components: {
      'app-start': startForm,
      'app-insertform': InsertForm,
      'app-header': header
    }
  }
</script>

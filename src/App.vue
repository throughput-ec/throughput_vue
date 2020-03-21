<template>
  <div id="app" class="mainpage">
    <app-header v-show="started"></app-header>
    <app-element v-show="started"></app-element>

    <app-graph @startup="getStarted" v-show="!started"></app-graph>
    <cookies />
    <!--<app-insertform></app-insertform>-->
  </div>
</template>

<styles>
.fade-enter-active, .fade-leave-active {
  transition: opacity 2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</styles>

<script>
  //import InsertForm from './components/insertform.vue'
  import header from './components/header.vue'
  import throughGraph from './components/firstgraph.vue'
  import elements from './components/head_buttons.vue'
  import cookieLaw from './components/cookie_note.vue'

  import './assets/containers.css'
  // import './assets/text.css'
  import './assets/d3styles.css'

  export default {
    name: 'app',
    data() {
      return {
        started: false
      }
    },
    components: {
      'app-element' : elements,
      'app-graph': throughGraph,
      //'app-insertform': InsertForm,
      'app-header': header,
      'cookies': cookieLaw
    },
    methods: {
      getStarted(e) {
        this.started = e;
      }
    }
  }
</script>

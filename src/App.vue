<template>
  <div id="app" class="mainpage">
    <app-header v-show="started"></app-header>
    <app-keywords v-show="started" />
    <app-graph @startup="getStarted" v-show="!started"></app-graph>
    <cookies />
  </div>
</template>

<styles>
.fade-enter-active, .fade-leave-active {
  transition: opacity 2s;
}
opacity: 0;
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
}
</styles>

<script>
  import keywords from './components/keyword_search.vue'
  import header from './components/header.vue'
  import throughGraph from './components/firstgraph.vue'
  import cookieLaw from './components/cookie_note.vue'

  import './assets/containers.css'
  import './assets/d3styles.css'

  export default {
    name: 'app',
    data() {
      return {
        started: false,
        extsearch: false
      }
    },
    components: {
      'app-graph': throughGraph,
      'app-header': header,
      'cookies': cookieLaw,
      'app-keywords': keywords
    },
    methods: {
      getStarted(e) {
        this.started = e;
      }
    }
  }
</script>

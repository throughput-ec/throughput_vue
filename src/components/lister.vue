<!-- this is the component that is supposed to list the databases: -->

<template>
<b-card-group deck style="margin-top:10px;margin-bottom:10px;">
  <div class="col-md-4" v-for="(item, index) in apikw" v-bind:key="index">
    <b-card class="h-100">
      <h4>{{item.name}}</h4>
      <b-button-group>
        <b-button @click="dropDB(item)" variant="danger">Drop</b-button>
        <b-button variant="primary">Repositories</b-button>
      </b-button-group>
      <b-card-text>
        <small>
          <v-clamp :expanded="clamped" max-lines=3 autoresize style="padding-top:10px;">
            {{item.description}}
          </v-clamp>
        </small>
        <b-badge @click="toggle()">Expand</b-badge>
        <hr />
        <strong>URL</strong>: <a v-bind:href="item.url" rel="noopener noreferrer" target="_blank">{{ item.name }}</a><br>
        <hr />
        <strong>Keyword</strong>: {{item.keyword}}<br>
      </b-card-text>
    </b-card>
  </div>
</b-card-group>
</template>


<script>
import '../assets/containers.css'
import VClamp from 'vue-clamp'

export default {
  name: 'listervue',
  props: {
    'apikw': {
      type: Array
    }
  },
  data() {
    return {
      keyresults: [],
      somekw: [{
        keyword: '',
        items: ''
      }],
      kwText: '',
      nodes: [],
      links: [],
      viewer: false,
      lister: true,
      clamped: false,
    }
  },
  components: {
    VClamp
  },
  computed: {

  },
  mounted() {},
  watch: {},
  methods: {
    toggle() {
      this.clamped = !this.clamped
    },
    dropDB(val) {
      var dbs = this.apikw.map(x => x.name)
      var position = dbs.indexOf(val.name)
      this.apikw.splice(position, 1)
      this.$emit('apikw', this.apikw)
    }
  }
}
</script>

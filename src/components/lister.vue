<!-- this is the component that is supposed to list the databases: -->

<template>
<div>

  <b-button v-b-modal.citation-1 @click="getCite(apikw,'db')" align="right">Get Database Citations</b-button>
  <b-button v-b-modal.citation-1 @click="getCite(apikw,'re')" align="right">Get Repository Citations</b-button>

  <b-modal id="citation-1" title="Database Citations">
    <p class="my-4"><pre>
      {{this.citations}}
    </pre></p>
  </b-modal>

  <b-modal id="citation-1" title="Repository Citations">
    <p class="my-4"><pre>
      {{this.citations}}
    </pre></p>
  </b-modal>

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
            <v-clamp :expanded="clamped" :max-lines="3" autoresize style="padding-top:10px;">
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
</div>
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
      citations: null,
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
    },
    getCite(val) {
      let self = this;
      self.ids = val.map(x => x.id).join(',')

      fetch('http://localhost:3000/api/citations?ids=' + self.ids )
      .then(function(response) {
        return response.json();
      })
      .then((data) => {
        self.citations = data.data.citation.join('');
      })
    }
  }
}
</script>

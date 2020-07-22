<!-- this is the component that is supposed to list the databases: -->

<template>
<div>

  <b-button v-b-modal.citation-1 @click="getCite(apikw)" align="right">Get Citations</b-button>

  <b-modal id="citation-1" title="Citations">
    <p class="my-4">
    <pre>
    {{this.citations}}
    </pre>
    </p>
  </b-modal>

  <hr />

  <div v-for="(item, index) in apikw" v-bind:key="index">
    <b-container fluid>
      <b-row align-v="center">
        <b-col class="col-md-1">
          <b-button-group>
            <b-button @click="dropDB(item)" variant="danger">Drop</b-button>
          </b-button-group>
        </b-col>
        <b-col class="col-md-10">
          <h4><a v-bind:href="item.url" rel="noopener noreferrer" target="_blank">{{item.name}}</a></h4>
          <small>{{item.description}}</small><br />
          <b-container>
            <b-row align-v="center">
              <b-col  class="text-center" cols = "3">
                <strong>Linked Code Repositories: {{ item.linked }}</strong>
              </b-col>
              <b-col>
                <strong>Keywords</strong>:<br />
                <span v-for="(item, index) in item.keyword" v-bind:key="index">
                  <b-badge variant="primary">{{ item }}</b-badge>
                </span>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
      <hr />
    </b-container>
  </div>
</div>
</template>


<script>
import '../assets/containers.css'

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
  created() {
    let self = this;
    self.nodes = self.apikw.map(function(x) {
      this.getkws(x.id)
        .then(data => data);
    })
  },
  mounted() {},
  methods: {
    getkws(id) {
      let getForRepo = function(id) {
        fetch('http://' + process.env.VUE_APP_URLPATH + '/api/keyword/repo/' + id)
          .then(response => response.json())
      }

      return getForRepo(id)
    },
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

      fetch('http://' + process.env.VUE_APP_URLPATH + '/api/citations?ids=' + self.ids)
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

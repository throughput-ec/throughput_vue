<!-- this is the component that is supposed to list the databases: -->

<template>
<div>

  <b-button v-b-modal.citation-1 @click="getCite(apikw)" align="right">Get Citations</b-button>

  <b-modal id="citation-1" title="Citations">
    <p class="my-4"><pre>
      {{this.citations}}
    </pre></p>
  </b-modal>

  <b-card-group deck style="margin-top:10px;margin-bottom:10px;">
    <div class="col-md-4" v-for="(item, index) in apikw" v-bind:key="index">
      <b-card class="h-100" >
        <h4>{{item.name}}</h4>
        <b-button @click="dropRepos(item)" variant="danger">Drop</b-button>
        <b-card-text>
          <hr />
          <strong>URL</strong>:<br /><a v-bind:href="item.url">{{ item.name }}</a><br>
          <hr />
          {{item.description}}
          <hr />
          <strong>Linked DBs</strong>:<br />
          <span v-for="index in item.dbs" v-bind:key="index">
            <span style="margin-right: 2px;margin-bottom: 2px;font-size:14px;">
              <b-badge variant="primary">{{ index }}</b-badge>
            </span>
          </span>
        </b-card-text>
      </b-card>
    </div>
  </b-card-group>
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
  components: {
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

      fetch('http://' + process.env.VUE_APP_URLPATH + '/api/citations?ids=' + self.ids )
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

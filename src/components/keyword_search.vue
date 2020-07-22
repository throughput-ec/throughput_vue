<template>
<div>
  <b-card title="Keyword Search">
    <kwInput @change="newText"></kwInput>

    <!-- Available terms -->
    <b-container>
      <b-card title="Available terms:">
        <div v-if="somekw.length > 1">
          <small>
            The top {{ Math.min(30,somekw.length) }} of {{somekw.length}} available keywords are shown.
            Click on a blue word to add it to your set.<br />The number beside the keyword indicates how many code repositories are associated with that keyword.
          </small>
        </div>
        <div v-if="somekw.length > 1">
          <span v-for="index in Math.min(30, somekw.length)" v-bind:key="index">
            <span style="margin-right: 2px;margin-bottom: 2px;font-size:14px;">
              <b-badge v-on:click="addkw(somekw[index -1].keyword)" variant="primary">{{ somekw[index-1].keyword }}
                <b-badge variant="light">{{ somekw[index-1].links }}</b-badge>
              </b-badge>
            </span>
          </span>
        </div>
        <div v-else>
          <small>Please begin entering keywords.</small>
        </div>
      </b-card>
      <div v-if="somekw.length === 0 & !kwText === ''">
        <small>No keywords available.</small>
      </div>
    </b-container>

    <!-- Selected terms -->
    <b-container>
      <b-row>
        <b-col>
          <b-card title="Selected terms:">
            <div v-if="keyresults.length > 0">
              <span v-for="(item, index) in keyresults" v-bind:key="index">
                <span style="margin-right: 2px;margin-bottom: 2px;font-size:14px;">
                  <b-badge v-on:click="addkw(item)" variant="danger">{{ item }}</b-badge>
                </span>
              </span>
            </div>
            <div v-else>
              <small>Click on a keyword above to add it to the list of selected keywords. Click a keyword again to remove it.</small>
            </div>
          </b-card>
        </b-col>
        <b-col>
          <b-card title="Linked terms:">
            <div v-if="keyresults.length > 1">
              <b-row>
                <b-col cols="9">
                  <div v-if="keyresults.length > 0">
                    <span v-for="(item, index) in keylinked" v-bind:key="index">
                      <span style="margin-right: 2px;margin-bottom: 2px;font-size:14px;">
                        <b-badge v-on:click="addkw(item)" variant="danger">{{ item }}</b-badge>
                      </span>
                    </span>
                  </div>
                </b-col>
              </b-row>
            </div>
            <div v-else>
              <small>Click to find databases that match the selected combinations.</small>
            </div>
          </b-card>
        </b-col>
        <b-col  align-self="center">
              <b-button @click="onSubmit" variant="primary" class="float-right">Submit Keywords</b-button>
        </b-col>
      </b-row>
    </b-container>
  </b-card>

  <!-- This is the part where the dbs show up: -->

  <div style="padding:10px;" v-if="apikw.length > 0">
    <div style="border-width:1px;float:center;">
      <strong>You have selected {{apikw.length}} databases.
        You can drop some databases before you proceed to search data repositories by clicking the red "Drop" button.</strong>
    </div>
  </div>
  <div>
    <b-tabs content-class="mt-3">
      <b-tab title="Data Catalogs" active>
        <!-- Pass out the variables to list the databases -->
        <lister :apikw=apikw></lister>
      </b-tab>

      <b-tab title="Code Repositories" @click="getCodeRepos">
        <div v-if="apikw.length > 40">
          You cannot select more than 40 Databases. Please remove databases from your selection.
        </div>
        <div v-else>
          <repo_lister :apikw=allrepos.ccdrs></repo_lister>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</div>
</template>

<script>
import '../assets/containers.css'
import lister from './lister.vue'
import repo_lister from './repo_lister.vue'
import kwInput from './keywords/keywordinput.vue'

export default {
  name: 'keywordSearch',
  data() {
    return {
      status: true,
      keyresults: [],
      keylinked: [],
      apikw: [],
      allkw: [],
      allrepos: {
        'ccdr': []
      },
      somekw: [{
        keyword: '',
        items: ''
      }],
      kwText: '',
      kwlinks: [],
      viewer: false,
      lister: true
    }
  },
  components: {
    'lister': lister,
    'repo_lister': repo_lister,
    'kwInput': kwInput
  },
  mounted() {
    if (localStorage.apikw) {
      this.apikw = JSON.parse(localStorage.apikw);
    }
  },
  created() {
    fetch('http://' + process.env.VUE_APP_URLPATH + '/api/keyword/all')
      .then(function(response) {
        return response.json();
      })
      .then((data) => {
        this.allkw = data.data;
        this.somekw = data.data;
        return data.data;
      })
  },
  watch: {
    kwText: {
      handler(val) {
      this.somekw = this.allkw.filter(function(kw) {
        return kw.keyword.includes(val);
      });
    }}
  },
  methods: {
    newText: function(val) {
      this.kwText = val;
    },
    checkRepo(idx) {
      // Check for the number of code repositories linked to DBs
      let self = this;
      fetch('http://' + process.env.VUE_APP_URLPATH + '/api/summary/ccdr?id=' + self.apikw[idx].id)
        .then(function(response) {
          return response.json();
        })
        .then((data) => {
          self.kwlinks[idx] = data.data[0].count;
        })
    },
    dropDB(val) {
      // Remove Database from the DB set for analysis
      var dbs = this.apikw.map(x => x.name)
      var position = dbs.indexOf(val.name)
      this.apikw.splice(position, 1)
    },
    dropRepos(val) {
      var repos = this.allrepos.ccdrs.map(x => x.name)
      var position = repos.indexOf(val.name)
      this.allrepos.ccdrs.splice(position, 1)
    },
    getCodeRepos() {
      // Get the code repositories associated with databases.
      let self = this;
      if (this.apikw.length < 40) {
        let val = this.apikw.map(x => x.id).join(',')
        fetch('http://' + process.env.VUE_APP_URLPATH + '/api/linked?id=' + val)
          .then(function(response) {
            return response.json();
          })
          .then((data) => {
            self.allrepos = data.data;
          })
      }
    },
    addkw(val) {
      var idx = this.keyresults.indexOf(val)
      if (idx === -1) {
        return this.keyresults
          .push(val)
      } else {
        this.keyresults.splice(idx, 1)
        return this.keyresults
      }
    },
    onSubmit(evt) {
      evt.preventDefault()
      let self = this
      var urlbase = 'http://' + process.env.VUE_APP_URLPATH + '/api/keyword/repos?'

      fetch(urlbase +
          'keywords=' + self.keyresults.join(','))
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          /* Modifying the values and processing the inputs */
          localStorage.apikw = JSON.stringify(data.data.keywords);
          self.apikw = data.data.keywords;
          return data.data.keywords;
        })
    }
  }
}
</script>

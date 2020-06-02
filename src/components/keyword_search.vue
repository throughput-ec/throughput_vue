<template>
  <div>
    <b-card title="Keyword Search">

      <!--       Input box section    -->
      <b-container>
        <b-input-group prepend="Keyword" class="mt-3">
          <b-form-input v-model="kwText" id="tooltip-target-1">Enter keywords here.</b-form-input>
          <b-input-group-append>
            <b-button v-b-modal.modal-1>Info</b-button>
            <b-modal id="modal-1">
              <strong>Keyword search</strong>: Begin typing keywords.
              As you limit the potential set of keywords a set of options will appear in blue below.
              Click on a term to add it to your search set.  Click on it again to remove it from the search set.
            </b-modal>
          </b-input-group-append>
        </b-input-group>
      </b-container>

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
                <b-badge v-on:click="addkw(somekw[index -1].keyword)" variant="primary">{{ somekw[index-1].keyword }} <b-badge variant="light">{{ somekw[index-1].links }}</b-badge></b-badge>
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
        <b-card title="Selected terms:">
        <div v-if="keyresults.length > 0">
          <b-row>
            <b-col cols="9">
              <span v-for="(item, index) in keyresults" v-bind:key="index">
                <span style="margin-right: 2px;margin-bottom: 2px;font-size:14px;">
                  <b-badge v-on:click="addkw(item)" variant="danger">{{ item }}</b-badge>
                </span>
              </span>
            </b-col>
            <b-col cols="3">
              <b-button @click="onSubmit" variant="primary" class="float-right">Submit Keywords</b-button>
            </b-col>
          </b-row>
        </div>
        <div v-else>
          <small>Click on a keyword above to add it to the list of selected keywords. Click a keyword again to remove it.</small>
        </div>
        </b-card>
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
            You cannot select more than 40 Databases.  Please remove databases from your selection.
          </div>
          <div v-else>
            <b-card-group deck style="margin-top:10px;margin-bottom:10px;">
              <div class="col-md-4" v-for="(item, index) in allrepos.ccdrs" v-bind:key="index">
                <b-card class="h-100" >
                  <h4>{{item.name}}</h4>
                  <b-button @click="dropRepos(item)" variant="danger">Drop</b-button>
                  <b-card-text>
                    {{item.description}}
                    <hr />
                    <strong>URL</strong>:<br /><a v-bind:href="item.url">{{ item.name }}</a><br>
                    <hr />
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
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
  import '../assets/containers.css'
  import lister from './lister.vue'

  export default {
    name: 'keywordSearch',
    data() {
      return {
        status: true,
        keyword: '',
        keyresults: [],
        apikw: [],
        allkw: [],
        allrepos: [],
        somekw: [{keyword:'', items:''}],
        kwText: '',
        kwlinks: [],
        viewer: false,
        lister: true
        }
      },
      components: {
        'lister': lister
      },
      mounted () {
          this.allkw = this.fetchkw()
        },
      watch: {
        kwText: function(val) {
          this.somekw = this.allkw.filter(function(kw) {
            return kw.keyword.includes(val)
          })
        }
      },
      computed: {

      },
      methods: {
        checkRepo(idx){
          // Check for the number of code repositories linked to DBs
          let self = this;
          fetch('http://localhost:3000/api/summary/ccdr?id=' + self.apikw[idx].id )
          .then(function(response) {
            return response.json();
          })
          .then((data) => {
            self.kwlinks[idx] = data.data[0].count;
          })
        },
        dropDB(val){
          // Remove Database from the DB set for analysis
          var dbs = this.apikw.map(x => x.name)
          var position = dbs.indexOf(val.name)
          this.apikw.splice(position, 1)
        },
        dropRepos(val){
          var repos = this.allrepos.ccdrs.map(x => x.name)
          var position = repos.indexOf(val.name)
          this.allrepos.ccdrs.splice(position, 1)
        },
        getCodeRepos(){
          // Get the code repositories associated with databases.
          let self = this;
          if(this.apikw.length < 40) {
            let val = this.apikw.map(x => x.id).join(',')
            fetch('http://localhost:3000/api/linked?id=' + val)
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
        fetchkw() {
          let self = this;
          fetch('http://localhost:3000/api/keyword/all')
          .then(function(response) {
            return response.json();
          })
          .then((data) => {
            self.allkw = data.data;
            return data.data
          })
        },
        onSubmit(evt) {
          evt.preventDefault()
          let self = this
          var urlbase = 'http://localhost:3000/api/keyword/repos?'

          fetch(urlbase +
              'keywords=' + self.keyresults.join(',') )
            .then((response) => {
              return response.json()
            })
            .then((data) => {
              /* Modifying the values and processing the inputs */
                self.apikw = data.data.keywords
                return data.data.keywords
            })
        }
      }
    }
</script>

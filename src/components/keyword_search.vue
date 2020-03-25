<template>
  <div>
    <b-card title="Keyword Search">

      <!--       Input box section    -->
      <b-input-group prepend="Keyword" class="mt-3">
        <b-form-input v-model="kwText"></b-form-input>
        <b-input-group-append>
          <b-button v-b-modal.modal-1>Info</b-button>
          <b-modal id="modal-1">
            <strong>Keyword search</strong>: Begin typing keywords.
            As you limit the potential set of keywords a set of options will appear in blue below.
            Click on a term to add it to your search set.  Click on it again to remove it from the search set.
          </b-modal>
        </b-input-group-append>
      </b-input-group>

      <!-- Selected terms -->
      <div v-if="keyresults.length > 0">
        <b-container>
          <small>selected terms</small>
          <b-row>
            <b-col cols="8">
              <span v-for="(item, index) in keyresults" v-bind:key="index">
                <span style="margin-right: 2px;margin-bottom: 2px;font-size:14px;">
                  <b-badge v-on:click="addkw(item)" variant="danger">{{ item }}</b-badge>
                </span>
              </span>
            </b-col>
            <b-col>
              <b-button @click="onSubmit" variant="primary">Submit Keywords</b-button>
            </b-col>
          </b-row>
        </b-container>
      </div>

      <!-- Available terms -->
      <div>
        <span v-for="index in Math.min(30, somekw.length)" v-bind:key="index">
          <span style="margin-right: 2px;margin-bottom: 2px;font-size:14px;">
            <b-badge v-on:click="addkw(somekw[index -1].keyword)" variant="primary">{{ somekw[index-1].keyword }}</b-badge>
          </span>
        </span>
      </div>
      <div v-if="somekw.length === 0 & !kwText === ''">
        No keywords available.
      </div>
      <div v-if="somekw.length > 1">
        The top {{ Math.min(30,somekw.length) }} of {{somekw.length}} available keywords are shown.
      </div>
    </b-card>

    <!-- D3 graph -->

    <div style="padding:10px;" v-if="apikw.length > 0">
      <div>
        You have selected {{apikw.length}} databases.  You can drop some databases before you proceed to search data repositories by clicking the blue "Drop" button.
        <b-button-group>
          <b-button @click="toNetwork" variant="primary">Visualize Keywords</b-button>
          <b-button @click="listRepos" variant="secondary">Search Repos</b-button>
        </b-button-group>
      </div>
      <d3-network v-if="viewer" :net-nodes="nodes" :net-links="links" :options="options" style="overflow:scroll;height:600;"/>
    </div>
    <div v-if="lister">
      <div v-for="(item, index) in apikw" v-bind:key="index">
        <b-card :title="item.name">
          <b-card-text>
            <strong>Description</strong>: {{item.description}}<br>
            <strong>Type</strong>: {{item.type}}<br>
            <strong>Keyword</strong>: {{item.keyword}}<br>
            <b-button @click="dropDB(item)" variant="primary">Drop</b-button>
            <b-button @click="checkrepo(item)" variant="primary">Check Repositories</b-button>
          </b-card-text>
        </b-card>
      </div>
    </div>
  </div>
</template>

<style src="vue-d3-network/dist/vue-d3-network.css"></style>

<script>
  import '../assets/containers.css'
  import D3Network from 'vue-d3-network'

  export default {
    name: 'keywordSearch',
    data() {
      return {
        status: true,
        keyword: '',
        keyresults: [],
        apikw: [],
        allkw: [],
        somekw: [{keyword:'', items:''}],
        kwText: '',
        nodes: [],
        links:[],
        viewer: true,
        lister: false
        }
      },
      components: {
        D3Network
      },
      computed:{
        options(){
          return{
            force: 500,
            size:{ w:1200, h:1200},
            nodeSize: 20,
            nodeLabels: true,
            canvas: this.canvas,
            linkWidth:4
          }
        }
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
      methods: {
        dropDB(val){
          var dbs = this.apikw.map(x => x.name)
          var position = dbs.indexOf(val.name)
          this.apikw.splice(position, 1)
        },
        checkRepo(val){
          let self = this;

          fetch('http://localhost:3000/api/linked?id=' + val )
          .then(function(response) {
            return response.json();
          })
          .then((data) => {
            self.allkw = data.data;
          })
        },
        listRepos(){
          let self = this
          self.viewer = false
          self.lister = true
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
          })
        },
        toNetwork() {
          let self = this
          var results = self.apikw
          var keywords = results.map(function(x) {
            return ( { "id": x.keyword,
                       "name": x.keyword,
                       "_color": '#D83A7A' } )
                     })

          var newkw = []

          for (var i=0;i < keywords.length;i++) {
            var names = newkw.map(x => x.name)
            if (names.indexOf(keywords[i].name) == -1) {
              newkw.push(keywords[i])
            }
          }

          var resources = results.map(function(x) {
            if(x.type === 'schema:DataCatalog') {
              var color = "#E94500"
            } else {
              color = "gray"
            }
            return ({ "id": x.id,
                       "name": x.name,
                       "_color": color } )
                     })

         for (i=0;i < resources.length;i++) {
           names = newkw.map(x => x.name)
           if (names.indexOf(resources[i].name) == -1) {
             newkw.push(resources[i])
           }
         }

         var nodes = newkw

         // Making the links now:
         var links = results.map((x) => {
           return({sid: x.id, tid: x.keyword})
         })

         self.nodes = nodes
         self.links = links

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
            })
        }
      }
    }
</script>

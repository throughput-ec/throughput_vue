<template>
  <b-card-group deck style="margin-top:10px;margin-bottom:10px;">
    <div class="col-md-4" v-for="(item, index) in apikw" v-bind:key="index">
      <b-card class="h-100" >
        <h4>{{item.name}}</h4>
        <b-button-group>
          <b-button @click="dropDB(item)" variant="danger">Drop</b-button>
          <b-button @click="checkrepo(item)" variant="primary">Check Repositories</b-button>
        </b-button-group>
        <b-card-text>
          <v-clamp max-lines=3 autoresize style="padding-top:10px;">
            {{item.description}}
          </v-clamp>
          <hr />
          <strong>Type</strong>: {{item.type}}<br>
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
    data() {
      return {
        keyresults: [],
        apikw: [],
        allkw: [],
        somekw: [{keyword:'', items:''}],
        kwText: '',
        nodes: [],
        links:[],
        viewer: false,
        lister: true
        }
      },
      components: {
        D3Network,
        VClamp
      },
      computed:{
        options(){
          return{
            force: 30,
            forces: {ManyBody: true,
                     Center: true},
            size:{ w:1200, h:1200},
            nodeSize: 20,
            nodeLabels: true,
            canvas: true,
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

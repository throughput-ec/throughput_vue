<template>
  <div>
    <b-card title="Keyword Search">
      <b-form-input v-model="kwText" placeholder="Keyword"></b-form-input>
      <div v-if="keyresults.length > 0">
        Selected:
        <span v-for="(item, index) in keyresults" v-bind:key="index">
          <span style="margin-right: 2px;margin-bottom: 2px;font-size:14px;">
            <b-badge v-on:click="addkw(item)" variant="danger">{{ item }}</b-badge>
          </span>
        </span>
      </div>
      <div v-if="somekw.length < 30">
        <span v-for="item in somekw" v-bind:key="item.keyword">
          <span style="margin-right: 2px;margin-bottom: 2px;font-size:14px;">
            <b-badge v-on:click="addkw(item.keyword)" variant="primary">{{ item.keyword }}</b-badge>
          </span>
        </span>
      </div>
      <div v-if="somekw.length === 0 & !kwText === ''">
        No keywords available.
      </div>
      <div v-if="somekw.length>0">
        There are {{somekw.length}} available keywords.
      </div>

      <div style="padding:10px;">
        <b-button-group>
          <b-button variant="primary">Visualize Keywords</b-button> <b-button variant="secondary">Search Repos</b-button>
        </b-button-group>
      </div>
    </b-card>
  </div>
</template>
<script>
  import '../assets/containers.css'

  export default {
    name: 'keywordSearch',
    data() {
      return {
        status: true,
        keyword: '',
        keyresults: [],
        allkw: [],
        somekw: [],
        kwText: ''
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
        }
      }
    }
</script>

<template>
  <div>
    <b-card title="Keyword Search">
      <b-input-group prepend="Keyword" class="mt-3">
        <b-form-input v-model="kwText"></b-form-input>
        <b-input-group-append>
          <b-button variant="primary">Search</b-button>
          <b-button v-b-modal.modal-1>Info</b-button>
          <b-modal id="modal-1">
            <strong>Keyword search</strong>: Begin typing keywords.
            As you limit the potential set of keywords a set of options will appear in blue below.
            Click on a term to add it to your search set.  Click on it again to remove it from the search set.
          </b-modal>
        </b-input-group-append>
      </b-input-group>
      <div v-if="keyresults.length > 0">
        Selected:
        <span v-for="(item, index) in keyresults" v-bind:key="index">
          <span style="margin-right: 2px;margin-bottom: 2px;font-size:14px;">
            <b-badge v-on:click="addkw(item)" variant="danger">{{ item }}</b-badge>
          </span>
        </span>
      </div>
      <div v-if="somekw.length < 30">
        <span v-for="(item, index) in somekw" v-bind:key="index">
          <span style="margin-right: 2px;margin-bottom: 2px;font-size:14px;">
            <b-badge v-on:click="addkw(item.keyword)" variant="primary">{{ item.keyword }}</b-badge>
          </span>
        </span>
      </div>
      <div v-if="somekw.length === 0 & !kwText === ''">
        No keywords available.
      </div>
      <div v-if="somekw.length > 1">
        The top {{ Math.min(30,somekw.length) }} of {{somekw.length}} available keywords are shown.
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
        somekw: [{keyword:'', items:''}],
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

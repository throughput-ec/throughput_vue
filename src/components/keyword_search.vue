<template>
<div class='app-body'>
  <app-header></app-header>
  <div v-if='loading' class='screen-center' style='height: 80vh;'>
    <b-spinner label='Loading...' style='width: 4rem; height: 4rem;' variant='primary' />
  </div>

  <div>
    <!-- This tells us which kinds of information we need to use for the
         search parameters, and what is being returned. -->
    <searchType
      @changeSearch="updateSearch"
      @changeReturn="updateReturn">
    </searchType>

    <b-container>
      <b-row>
        <kwInput :term="searchKind" @change="newText"
             style='margin-bottom:5px;'></kwInput>
      </b-row>
      <b-row>
        <b-button @click="onSubmit" class="w-100">Submit Search</b-button>
      </b-row>
    </b-container>

    <!-- Show the Keyword search elements. -->
    <div v-if="searchKind.includes('Keywords')">
      <b-container class="border">
        <b-row>
          <b-col>
          <wordBadges title="Keywords"
                    :badgein="somekw"
                    :show="true"
                    @termOut="toggleKw"></wordBadges>
          </b-col>
        </b-row>
        <div v-if="allkw.filter(x => !x.show).length > 0">
          <b-row align-v="end">
            <b-col>
              <wordBadges title="Selected Keywords"
                          :badgein="allkw"
                          :show="false"
                          @termOut="toggleKw"></wordBadges>
            </b-col>
          </b-row>
        </div>
      </b-container>
    </div>

    <!-- INFORMATION SECTION FOR TABS: -->
    <div v-if="apikw.length > 0" style='background: var(--t-color-light-grey); margin-top: 10px;'>
      <div style="padding: 15px 40px;">
        <p style='font-size: 18px;'>You have selected {{ apikw.filter(x => x.show === 'yes').length }} databases.
          <span v-if="apikw.filter(x => x.show === 'yes').length > 40"> The number of databases selected needs to be 40 or less in order to proceed to search data repositories.</span>
          <span> You can drop individual databases by clicking the <span class='drop-button-span'>Drop</span> button next to each database below.</span>
        </p>
        <p v-if="apikw.filter(x => x.show === 'yes').length > 40" style='font-size: 18px;'>You can also click on <span class='auto-filter-span' @click='autoFilterDBs'>Auto Filter</span> and we will automatically
          select the top 40 databases based on your keyword search.
        </p>
        <div style='display: flex; justify-content: flex-end; padding-left: 30px;'>
          <button @click='reset' class='light-blue-button'>Reset Search</button>
          <button v-if="apikw.filter(x => x.show === 'yes').length > 40" @click='autoFilterDBs' class='blue-button' style='margin-left: 10px;'>Auto Filter</button>
        </div>
      </div>
    </div>

    <!-- TABS -->
    <div class='tabs' v-if="apikw.length > 0">
      <b-tabs active-tab-class='active-tab'>
        <b-tab title="Data Catalogs" active>
          <!-- Pass out the variables to list the databases -->
          <lister :apikw="apikw"></lister>
        </b-tab>

        <b-tab title="Code Repositories" @click="getCodeRepos">
          <div v-if="apikw.filter(x => x.show === 'yes').length > 40" style='padding: 20px 40px; width: 100%; text-align: center;'>
            You cannot select more than 40 Databases. Please remove databases
            from your selection.
          </div>
          <div v-else>
            <repo_lister :repos="allrepos"></repo_lister>
          </div>
        </b-tab>

        <!-- Deprecating for a bit. . .
        <b-tab title='Network Graph' v-if="apikw.filter(x => x.show === 'yes').length > 0 && apikw.filter(x => x.show === 'yes').length <= 40 && searchKeywords === true" @click='generateNetworkGraph'>
          <visualize_kw v-if='showGraph' :databases='apikw.filter(x => x.show === "yes")' :key='hash'></visualize_kw>
        </b-tab>
        -->
      </b-tabs>
    </div>
  </div>
</div>
</template>

<script>
import lister from "./lister.vue";
import repo_lister from "./repo_lister.vue";
import kwInput from "./keywords/keywordinput.vue";
import linkedkws from "./keywords/linkedkws.vue";
import visualize_kw from './visualize_kw';
import header from "../components/header.vue";
import textInput from "./elements/text-input";
import searchType from "./search_elements/searchType.vue"
import badgeBox from "./wordBadges.vue"

export default {
  name: "keywordSearch",
  data() {
    return {
      allkw: [],
      allrepos: [],
      apikw: [],
      expandKeywordSearch: true,
      keyresults: [],
      kwText: "",
      loading: false,
      loadingRepos: false,
      networkGraphData: [],
      returnSet: [
        {caption: 'Databases', state: true },
        {caption: 'Code Repos', state: false }
      ],
        searchSet: [
          {caption: 'Keywords', state: true },
          {caption: 'Text', state: false }
        ],
      showGraph: false,
      somekw: [{
        keyword: "",
        count: "",
        show: ""
      }],
      somesub: [{
        keyword: "",
        count: "",
        show: ""
      }],
      textQuery: "",
      keywordToggleClasses: 'toggle-left active',
      textToggleClasses: 'toggle-right inactive',
      error: '',
      hash: ''
    };
  },
  components: {
    searchType: searchType,
    lister: lister,
    repo_lister: repo_lister,
    kwInput: kwInput,
    textInput: textInput,
    linkedkws: linkedkws,
    visualize_kw: visualize_kw,
    wordBadges: badgeBox,
    "app-header": header
  },
  created() {
    this.loading = true;
    this.reset();
    fetch(`${process.env.VUE_APP_URLPATH}/api/ccdrs/keywords?limit=99999`)
      .then(function(response) {
        return response.json();
      })
      .then(data => {
        this.allkw = data.data.data;
        this.somekw = data.data.data.map((x) => {
          x['term'] = x['keywords'];
          x['show'] = true; return x;})
        this.loading = false;
        return true;
      }).catch(() => {
        this.loading = false;
      });

      fetch(`${process.env.VUE_APP_URLPATH}/api/ccdrs/subjects?limit=99999`)
        .then(function(response) {
          return response.json();
        })
        .then(data => {
          this.allsub = data.data.data;
          this.somesub = data.data.data.map((x) => {
             x['show'] = true;
             x['term'] = x['subjects'];
             return x;})
          this.loading = false;
          return true;
        }).catch(() => {
          this.loading = false;
        });
  },
  watch: {
    kwText: {
      handler(val) {
        this.somekw = this.allkw.filter(function(kw) {
          return kw.keywords.includes(val.toLowerCase());
        });
      }
    },
  },
  computed: {
    searchKind:function() {
      let searcher = this.searchSet;
      return searcher.filter(x => x.state == true)
      .map(x => x.caption)
      .join(', ');
    }
  },
  methods: {
    updateSearch: function(e) {
      // e is for emittor:
      this.searchSet = e;
    },
    updateReturn: function(e) {
      // e is for emittor:
      this.returnSet = e;
    },
    newText: function(val) {
      this.kwText = val;
    },
    updateQuery: function(input) {
      this.textQuery = input;
    },
    textSearch() {
      this.loadingRepos = true;
      this.reset();
      let self = this;
      this.error = '';
      const url = `${process.env.VUE_APP_URLPATH}/api/ccdr?name=${this.textQuery}`;

      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(data => {
          // ADD LINK COUNT
          self.apikw = data.data;
          self.apikw = self.apikw.map(function(x) {
            x["show"] = "yes";
            if (!x["linked"] && x["count"]) {
              x["linked"] = x["count"]
            }
            return x;
          });
        }).then(data => {
          // ADD TEXT EXCERPT FIELD
          self.apikw = self.apikw.map(function(x) {
            const words = x['description'].split(' ');

            if (words.length > 30) { // LIMIT TO 30 WORDS
              x['excerpt'] = words.slice(0, 30).join(' ');
              x['showExcerpt'] = true;
            }

            return x;
          });

          this.loadingRepos = false;
          if (this.expandKeywordSearch === true && self.apikw.length > 0) {
            this.toggleKeywordSearch();
          }

          if (self.apikw.length === 0) {
            this.error = 'No Databases Found.  Please update your search and try again.'
          }
          return data;
        }).catch(() => {
          this.loadingRepos = false;
        });

    },
    getCodeRepos() {
      // Get the code repositories associated with databases.
      const toShow = this.apikw.filter(x => x.show === 'yes').length;

      if (this.apikw.length > 0 && toShow <= 40) {
        this.loading = true;
        let self = this;
        const databaseIds = this.apikw
          .filter(x => x.show === "yes")
          .map(x => x.id)
          .join(",");

        fetch(`${process.env.VUE_APP_URLPATH}/api/ccdrs/repos?ccdrs=${databaseIds}`)
          .then(function(response) {
            return response.json();
          })
          .then(data => {
            return data.data.data;
          })
          .then(data => {
            self.allrepos = data.map(function(x) {
              x["show"] = "yes";
              return x;
            });
          })
          .then(data => {
            this.loading = false;
            this.$forceUpdate();
            return data;
          }).catch(() => {
            this.loading = false;
          });
      }
    },
    toggleKw(val) {
      let out = this.allkw.map(function(x) {
        if (x['term'] === val) {
          x['show'] = !x['show']
        }
        return x;});
      this.allkw = out;
    },
    toggleSub(val) {
      let out = this.somesub.map(function(x) {
        if (x['term'] === val) {
          x['show'] = !x['show']
        }
        return x;});
      this.somesub = out;
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.loadingRepos = true;
      let self = this;
      this.error = '';
      let keyresults = self.somekw.filter(x => x.show === false).map(x => x.keywords).join(",");
      if(this.searchSet.filter(x => x.state).map(x => x.caption).includes('Keywords') & keyresults.length > 0) {
        var url = `${process.env.VUE_APP_URLPATH}/api/keywords/ccdrs?keywords=${keyresults}&limit=1000`;
      } else if(this.searchSet.filter(x => x.state).map(x => x.caption).includes('Text')) {
        url = `${process.env.VUE_APP_URLPATH}/api/ccdr?name=${this.kwText}`;
      } else {
        return(null);
      }

      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(data => {
          /* Modifying the values and processing the inputs */
          /* This comes from the api/keyword/repos endpoint,
            returning a "repositories" array of repositories. */

          self.apikw = data.data.data;
          self.apikw = self.apikw.map(function(x) {
            x["show"] = "yes";
            return x;
          });
        }).then(data => {
          // ADD TEXT EXCERPT FIELD
          self.apikw = self.apikw.map(function(x) {
            const words = x['description'].split(' ');

            if (words.length > 30) { // LIMIT TO 30 WORDS
              x['excerpt'] = words.slice(0, 30).join(' ');
              x['showExcerpt'] = true;
            }

            return x;
          });

          this.loadingRepos = false;
          if (this.expandKeywordSearch === true && self.apikw.length > 0) {
            this.toggleKeywordSearch();
          }

          if (self.apikw.length === 0) {
            this.error = 'No Databases Found.  Please update your search and try again.'
          }
          return data;
        }).catch(() => {
          this.loadingRepos = false;
        });
    },
    autoFilterDBs() {
      let staging = this.apikw;
      this.apikw = [];

      const filteredCount = staging.filter(x => x.show === 'yes');

      if (filteredCount.length >= 40) {
        let showCount = 0;
        for (let index = 0; index < staging.length; index++) {
          if (staging[index].show === 'yes' && showCount < 40) {
            showCount++;
          } else {
            staging[index]["show"] = "no";
          }

          this.apikw = [...this.apikw, staging[index]];
        }
      }

      this.$forceUpdate();
    },
    toggleKeywordSearch() {
      this.expandKeywordSearch = !this.expandKeywordSearch;
    },
    generateNetworkGraph() {
      this.hash = Math.random().toString(36).slice(2);
      this.showGraph = true;
    },
    reset() {
      this.apikw = [];
      this.allrepos = [];
      this.keyresults = [];
      this.showGraph = false;

      if (this.expandKeywordSearch === false) {
        this.toggleKeywordSearch();
      }
    },
    toggleSearchType() {
      if (this.searchKeywords === true) {
        this.keywordToggleClasses = 'toggle-left inactive';
        this.textToggleClasses = 'toggle-right active';
      } else {
        this.keywordToggleClasses = 'toggle-left active';
        this.textToggleClasses = 'toggle-right inactive';
      }
      this.searchKeywords = !this.searchKeywords;
      this.reset();
    }

  }
};
</script>

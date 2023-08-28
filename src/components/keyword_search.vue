<!-- This template provides the main search capacity for the
     Throughput web app. -->
<template>
  <div class="app-body">
    <app-header></app-header>

    <div v-if="loading">
      <loading class="screen-center"></loading>
    </div>

    <div>
      <b-container>
        <b-row style="padding: 15px;">
          Search the Throughput database below to find publications, databases, people, grants, and code resources across the web.
        </b-row>
      </b-container>

      <!-- This tells us which kinds of information we need to use for the
         search parameters, and what is being returned. -->
      <searchType @changeSearch="updateSearch" @changeReturn="updateReturn">
      </searchType>
      <b-container>
        <b-row v-if="searchKind.includes('Keywords')" style="padding: 15px;">
          <p>
          Begin typing keywords. As you
          limit the potential set of keywords a set of options will appear
          in blue below. Click on a term to add it to your search set. Click
          on it again to remove it from the search set.
          </p>
        </b-row>        
        <b-row>
          <kwInput
            :term="searchKind"
            @change="newText"
            style="margin-bottom: 5px"
          ></kwInput>
        </b-row>
        <b-row>
          <!-- Show the Keyword search elements. -->
          <div v-if="searchKind.includes('Keywords')">
            <b-container>
              <b-row style="padding-top: 15px;">
                <b-col>
                  <wordBadges
                    title="Keywords"
                    :badgein="typedKeywords"
                    :show="true"
                    @termOut="toggleKw"
                  ></wordBadges>
                </b-col>
              </b-row>
              <div v-if="allKeywords.filter((x) => !x.show).length > 0">
                <b-row style="padding-top: 15px;" align-v="end">
                  <b-col>
                    <wordBadges
                      title="Selected Keywords"
                      :badgein="clickedKeywords"
                      :show="false"
                      @termOut="toggleKw"
                    ></wordBadges>
                  </b-col>
                </b-row>
              </div>
            </b-container>
          </div>
        </b-row>
        <b-row style="padding: 20px" align-h="center">
          <b-button @click="onSubmit" class="w-25" variant="primary"
            >Submit Search</b-button
          >
          <flagRepo class="w-100" style="padding-top: 5px"></flagRepo>
        </b-row>
      </b-container>

      <!-- INFORMATION SECTION FOR TABS: -->
      <div
        v-if="datacatalogs.length > 0"
        style="margin-top: 10px"
      >
        <b-container>
          <b-row>
            <b-col>
              <h3>Search Results</h3>
            </b-col>
          </b-row>
          <b-row>
            <b-col><p>
            Data catalogs matching your search are listed below. To view associated code repositories, select data catalog(s) of interest with the <span class="add-button-span">Add</span> button, then navigate to the Code Repositories tab.
            </p>

            <p>You have selected {{ datacatalogs.filter((x) => x.show === "yes").length }} data catalog(s).</p>
            <span
              v-if="datacatalogs.filter((x) => x.show === 'yes').length > 40"
            >
              The number of data catalogs selected needs to be 40 or less in order
              to proceed to search code repositories.
              You can drop individual data catalogs by clicking the
              <span class="drop-button-span">Drop</span> button next to each
              data catalog below.
            </span>

            <p
              v-if="datacatalogs.filter((x) => x.show === 'yes').length > 40"
              style="font-size: 18px"
            >
              You can also click on
              <span class="auto-filter-span" @click="autoFilterDBs"
                >Auto Filter</span
              >
              and we will automatically select the top 40 data catalogs based on your
              keyword search.
            </p>
            <div
              style="display: flex; justify-content: flex-end; padding-left: 30px"
            >
              <button @click="reset" class="light-blue-button">
                Reset Search
              </button>
              <button
                v-if="datacatalogs.filter((x) => x.show === 'yes').length > 40"
                @click="autoFilterDBs"
                class="blue-button"
                style="margin-left: 10px"
              >
                Auto Filter
              </button>
            </div>
            </b-col>
          </b-row>
        </b-container>
      </div>

      <!-- TABS -->
      <div class="tabs" v-if="datacatalogs.length > 0">
        <b-tabs active-tab-class="active-tab">
          <b-tab title="Data Catalogs" active>
            <!-- Pass out the variables to list the databases -->
            <div v-if="loadingRepos" style="height: 80vh">
              <loading></loading>
            </div>
            <lister :datacatalogs="datacatalogs"></lister>
          </b-tab>

          <b-tab title="Code Repositories" @click="getCodeRepos">
            <div
              v-if="loadingCodeRepos"
              style="height: 80vh"
            >
              <loading></loading>
            </div>
            <div
              v-if="datacatalogs.filter((x) => x.show === 'yes').length > 40"
              style="padding: 20px 40px; width: 100%; text-align: center"
            >
              You cannot select more than 40 data catalogs. Please remove data catalogs
              from your selection.
            </div>
            <div v-else>
              <repo_lister :repos="allrepos"></repo_lister>
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import loading from "./elements/loadingTemplate";
import lister from "./lister.vue";
import repo_lister from "./repo_lister.vue";
import kwInput from "./keywords/keywordinput.vue";
import header from "../components/header.vue";
import searchType from "./search_elements/searchType.vue";
import badgeBox from "./wordBadges.vue";
import insertRepo from "./elements/flagRepo.vue";

export default {
  name: "keywordSearch",
  data() {
    return {
      // The full set of keywords.
      allKeywords: [],
      // The subset set of code repositories (show === true)
      allrepos: [],
      // The full set of code repositories
      datacatalogs: [],
      expandKeywordSearch: true,
      // The raw string used to find keywords
      kwText: "",
      // Loading the full data
      loading: false,
      loadingRepos: false,
      loadingCodeRepos: false,
      returnSet: [
        { caption: "Databases", state: true },
        { caption: "Code Repositories", state: false },
      ],
      searchSet: [
        { caption: "Keywords", state: true },
        { caption: "Text", state: false },
      ],
      somesub: [
        {
          keyword: "",
          count: "",
          show: "",
        },
      ],
      // These are used to pass along the smaller set of terms
      // showing the set of keywords available when keywords are
      // modified through kwinput (the thing the user types)
      typedKeywords: [
        {
          keyword: "",
          count: "",
        },
      ],
      // These are the keywords the user has clicked.
      clickedKeywords: [
        {
          keyword: "",
          count: "",
        },
      ],
      textQuery: "",
      keywordToggleClasses: "toggle-left active",
      textToggleClasses: "toggle-right inactive",
      error: "",
      hash: "",
    };
  },
  components: {
    flagRepo: insertRepo,
    loading: loading,
    searchType: searchType,
    lister: lister,
    repo_lister: repo_lister,
    kwInput: kwInput,
    //textInput: textInput,
    // linkedkws: linkedkws,
    // visualize_kw: visualize_kw,
    wordBadges: badgeBox,
    "app-header": header,
  },
  created() {
    this.loading = true;
    this.reset();
    fetch(`${process.env.VUE_APP_URLPATH}/api/ccdrs/keywords?limit=99999`)
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        this.allKeywords = data.data.data.map((x) => {
          return { term: x.keywords, show: true, count: x.count };
        });
        this.typedKeywords = this.allKeywords
          .filter((x) => x.show == true)
          .map((x) => {
            return { term: x.term, count: x.count };
          });
        this.clickedKeywords = this.allKeywords
          .filter((x) => x.show == false)
          .map((x) => {
            return { term: x.term, count: x.count };
          });
        this.loading = false;
        return true;
      })
      .catch(() => {
        this.loading = false;
      });

    fetch(`${process.env.VUE_APP_URLPATH}/api/ccdrs/subjects?limit=99999`)
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        this.allsub = data.data.data;
        this.somesub = data.data.data.map((x) => {
          x["show"] = true;
          x["term"] = x["subjects"];
          return x;
        });
        this.loading = false;
        return true;
      })
      .catch(() => {
        this.loading = false;
      });
  },
  watch: {
    kwText: {
      handler(val) {
        this.typedKeywords = this.allKeywords.filter(function (kw) {
          return kw.term.includes(val.toLowerCase());
        });
      },
    },
  },
  computed: {
    searchKind: function () {
      let searcher = this.searchSet;
      return searcher
        .filter((x) => x.state == true)
        .map((x) => x.caption)
        .join(", ");
    },
  },
  methods: {
    updateSearch: function (e) {
      // e is for emittor:
      this.searchSet = e;
    },
    updateReturn: function (e) {
      // e is for emittor:
      this.returnSet = e;
    },
    newText: function (val) {
      this.kwText = val;
    },
    updateQuery: function (input) {
      this.textQuery = input;
    },
    textSearch() {
      this.loadingRepos = true;
      this.reset();
      let self = this;
      this.error = "";
      const url = `${process.env.VUE_APP_URLPATH}/api/ccdr?name=${this.textQuery}`;

      fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          // ADD LINK COUNT
          self.datacatalogs = data.data;
          self.datacatalogs = self.datacatalogs.map(function (x) {
            x["show"] = "no";
            if (!x["linked"] && x["count"]) {
              x["linked"] = x["count"];
            }
            return x;
          });
        })
        .then((data) => {
          // ADD TEXT EXCERPT FIELD
          self.datacatalogs = self.datacatalogs.map(function (x) {
            const words = x["description"].split(" ");

            if (words.length > 30) {
              // LIMIT TO 30 WORDS
              x["excerpt"] = words.slice(0, 30).join(" ");
              x["showExcerpt"] = true;
            }

            return x;
          });

          this.loadingRepos = false;
          if (
            this.expandKeywordSearch === true &&
            self.datacatalogs.length > 0
          ) {
            this.toggleKeywordSearch();
          }

          if (self.datacatalogs.length === 0) {
            this.error =
              "No Databases Found.  Please update your search and try again.";
          }
          return data;
        })
        .catch(() => {
          this.loadingRepos = false;
        });
    },
    getCodeRepos() {
      // Get the code repositories associated with databases.

      const toShow = this.datacatalogs.filter((x) => x.show === "yes").length;

      if (this.datacatalogs.length > 0 && toShow <= 40) {
        this.loadingCodeRepos = true;
        let self = this;
        const databaseIds = this.datacatalogs
          .filter((x) => x.show === "yes")
          .map((x) => x.id)
          .join(",");

        fetch(
          `${process.env.VUE_APP_URLPATH}/api/ccdrs/repos?ccdrs=${databaseIds}`
        )
          .then(function (response) {
            return response.json();
          })
          .then((data) => {
            return data.data.data;
          })
          .then((data) => {
            self.allrepos = data
              .map(function (x) {
                x["show"] = "no";
                if (!Object.keys(x).includes("meta")) {
                  x["meta"] = {
                    topics: [],
                    readme: { license: null, readme: { char: null } },
                  };
                }
                return x;
              })
              .filter((x) => {
                if (Object.keys(x).includes("status")) {
                  if (x.status !== 404) {
                    return true;
                  }
                } else {
                  return true;
                }
              });
          })
          .then((data) => {
            this.loadingCodeRepos = false;
            this.$forceUpdate();
            return data;
          })
          .catch(() => {
            this.loadingCodeRepos = false;
          });
      }
    },
    toggleKw(val) {
      let out = this.allKeywords.map(function (x) {
        if (x["term"] === val) {
          x["show"] = !x["show"];
        }
        return x;
      });
      this.typedKeywords = out.filter((x) => x.show == true);
      this.clickedKeywords = out.filter((x) => x.show == false);
      this.allKeywords = out;
    },
    toggleSub(val) {
      let out = this.somesub.map(function (x) {
        if (x["term"] === val) {
          x["show"] = !x["show"];
        }
        return x;
      });
      this.somesub = out;
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.loadingRepos = true;
      let self = this;
      this.error = "";
      let keyresults = self.clickedKeywords.map((x) => x.term).join(",");
      if (
        this.searchSet
          .filter((x) => x.state)
          .map((x) => x.caption)
          .includes("Keywords") &
        (keyresults.length > 0)
      ) {
        var url = `${process.env.VUE_APP_URLPATH}/api/keywords/ccdrs?keywords=${keyresults}&limit=1000`;
      } else if (
        this.searchSet
          .filter((x) => x.state)
          .map((x) => x.caption)
          .includes("Text")
      ) {
        url = `${process.env.VUE_APP_URLPATH}/api/ccdr?name=${this.kwText}`;
      } else {
        return null;
      }

      fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          /* Modifying the values and processing the inputs */
          /* This comes from the api/keyword/repos endpoint,
            returning a "repositories" array of repositories. */

          self.datacatalogs = data.data.data;
          self.datacatalogs = self.datacatalogs.map(function (x) {
            x["show"] = "no";
            return x;
          });
        })
        .then((data) => {
          // ADD TEXT EXCERPT FIELD
          self.datacatalogs = self.datacatalogs.map(function (x) {
            const words = x["description"].split(" ");

            if (words.length > 30) {
              // LIMIT TO 30 WORDS
              x["excerpt"] = words.slice(0, 30).join(" ");
              x["showExcerpt"] = true;
            }

            return x;
          });

          this.loadingRepos = false;
          if (
            this.expandKeywordSearch === true &&
            self.datacatalogs.length > 0
          ) {
            this.toggleKeywordSearch();
          }

          if (self.datacatalogs.length === 0) {
            this.error =
              "No Databases Found.  Please update your search and try again.";
          }
          return data;
        })
        .catch(() => {
          this.loadingRepos = false;
        });
    },
    autoFilterDBs() {
      let staging = this.datacatalogs;
      this.datacatalogs = [];

      const filteredCount = staging.filter((x) => x.show === "yes");

      if (filteredCount.length >= 40) {
        let showCount = 0;
        for (let index = 0; index < staging.length; index++) {
          if (staging[index].show === "yes" && showCount < 40) {
            showCount++;
          } else {
            staging[index]["show"] = "no";
          }

          this.datacatalogs = [...this.datacatalogs, staging[index]];
        }
      }

      this.$forceUpdate();
    },
    toggleKeywordSearch() {
      this.expandKeywordSearch = !this.expandKeywordSearch;
    },
    reset() {
      this.datacatalogs = [];
      this.allrepos = [];

      if (this.expandKeywordSearch === false) {
        this.toggleKeywordSearch();
      }
    },
    toggleSearchType() {
      if (this.searchKeywords === true) {
        this.keywordToggleClasses = "toggle-left inactive";
        this.textToggleClasses = "toggle-right active";
      } else {
        this.keywordToggleClasses = "toggle-left active";
        this.textToggleClasses = "toggle-right inactive";
      }
      this.searchKeywords = !this.searchKeywords;
      this.reset();
    },
  },
};
</script>

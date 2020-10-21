<template>
    <div class='app-body'>
        <app-header></app-header>
        <div v-if='loading' class='screen-center' style='height: 80vh;'>
            <b-spinner label='Loading...' style='width: 4rem; height: 4rem;' variant='primary'/>
        </div>

        <div>
<!--            <b-card title="Keyword Search">-->
            <div class='title-with-options'>
                <div class='toggle-container'>
                    <h3>Search By:</h3>

                    <div class='t-toggle'>
                        <div :class='keywordToggleClasses' @click='toggleSearchType'>
                            <span>Keyword</span>
                        </div>
                        <div :class='textToggleClasses' @click='toggleSearchType'>
                            <span>Text</span>
                        </div>
                    </div>
                </div>

                <div>
                    <div v-if='!expandKeywordSearch' class='h1' style='color: var(--t-color-blue)'>
                        <b-icon-plus-square @click='toggleKeywordSearch'></b-icon-plus-square>
                    </div>
                    <div v-if='expandKeywordSearch' class='h1' style='color: var(--t-color-blue)'>
                        <b-icon-dash-square @click='toggleKeywordSearch'></b-icon-dash-square>
                    </div>
                </div>
            </div>


                <!-- Available terms -->
                <div v-if='expandKeywordSearch' :class='searchBodyClasses'>
                    <kwInput @change="newText" style='margin-bottom:5px;'></kwInput>

                    <b-container>
                        <b-card title="Available terms:">
                            <div v-if="somekw.length > 1">
                                <small>
                                    The top {{ Math.min(30, somekw.length) }} of
                                    {{ somekw.length }} available keywords are shown. Click on a blue
                                    word to add it to your set.<br />The number beside the keyword
                                    indicates how many code repositories are associated with that
                                    keyword.
                                </small>
                            </div>

                            <div v-if="somekw.length > 1" class='keyword-container'>
                                <div v-for="index in Math.min(30, somekw.length)" v-bind:key="index" class='keyword-badge'>
                                    <span v-on:click="toggleKw(somekw[index - 1].keyword)" >{{ somekw[index - 1].keyword }}</span>
                                    <span class='inner-badge'>{{ somekw[index - 1].links }}</span>
                                </div>
                            </div>

                            <div v-else>
                                <small>Please begin entering keywords.</small>
                            </div>
                        </b-card>

                        <div v-if="(somekw.length === 0) & (kwText !== '')">
                            <small>No keywords available.</small>
                        </div>
                    </b-container>

                    <b-container>
                        <linkedkws v-bind:kwin="keyresults"></linkedkws>
                    </b-container>
                    <!-- Selected terms -->
                    <b-container>
                        <div class='terms-container'>
                            <b-card title="Selected terms:" class='terms-card'>
                                <div v-if="keyresults.length > 0" class='keyword-container'>
                                    <div v-for="(item, index) in keyresults" v-bind:key="index" @click='toggleKw(item)' class='keyword-badge'>
                                        <span>{{ item }}</span>
                                        <span class='inner-badge' style='color: red; padding-left: 4px;'>X</span>
                                    </div>
                                </div>
                                <div v-else>
                                    <small>Click on a keyword above to add it to the list of selected
                                     keywords. Click a keyword again to remove it.</small>
                                </div>
                            </b-card>

                            <button v-if='keyresults.length > 0' @click="onSubmit" class='blue-button terms-submit'>
                                <span v-if='!loadingRepos'>Submit Keywords</span>
                                <b-spinner v-if='loadingRepos'></b-spinner>
                            </button>

                            <button v-else class='blue-button terms-submit terms-submit-disabled'>
                                <span>Submit Keywords</span>
                            </button>
                        </div>
                    </b-container>

                    <div v-if="error !== ''">
                        <h4 class='error-message'>{{ error }}</h4>
                    </div>
                </div>
<!--            </b-card>-->

            <!-- This is the part where the dbs show up: -->
            <div v-if="apikw.length > 0" style='background: var(--t-color-light-grey); margin-top: 10px;'>
                <div style="padding: 15px;">
                    <p style='font-size: 18px;'>You have selected {{ apikw.filter(x => x.show === 'yes').length }} databases.
                    <span v-if="apikw.filter(x => x.show === 'yes').length > 40"> The number of databases selected needs to be 40 or less in order to proceed to search data repositories.</span>
                        <span> You can drop individual databases by clicking the <span class='drop-button-span'>Drop</span> button next to each database below.</span>
                    </p>
                    <p v-if="apikw.filter(x => x.show === 'yes').length > 40" style='font-size: 18px;'>You can also click on <span class='auto-filter-span' @click='autoFilterDBs'>Auto Filter</span> and we will automatically
                        select the top 40 databases based on your keyword search.
                    </p>
                    <div style='display: flex; justify-content: flex-end; padding-left: 30px;'>
                        <b-button variant='warning' @click='reset'>Reset Search</b-button>
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
                        <div v-if="apikw.filter(x => x.show === 'yes').length > 40">
                            You cannot select more than 40 Databases. Please remove databases
                            from your selection.
                        </div>
                        <div v-else>
                            <repo_lister :apikw="allrepos"></repo_lister>
                        </div>
                    </b-tab>

<!--                    <b-tab title='Network Graph' v-if='apikw.length > 0 && allrepos.length > 0'> TODO: ADD allrepos back in when repo API call works -->
                    <b-tab title='Network Graph' v-if="apikw.filter(x => x.show === 'yes').length > 0 && apikw.filter(x => x.show === 'yes').length <= 40" @click='generateNetworkGraph'>
                        <visualize_kw v-if='showGraph' v-bind:databases='apikw' v-bind:repos:='allrepos'></visualize_kw>
                    </b-tab>
                </b-tabs>
            </div>
        </div>
    </div>
</template>

<style>
    .title-with-options{
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 10px 40px;
    }

    .toggle-container {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
    }

    .title-with-options h3 {
        margin: 0;
    }

    .t-toggle {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        margin-left: 12px;
    }


    .toggle-left, .toggle-right {
        display: flex;
        flex-flow: row;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid var(--t-color-blue);
        border-top: 1px solid var(--t-color-blue);
        padding: 5px 10px;
        width: 100px !important;
        font-size: 18px;
    }

    .toggle-left {
        border-left: 1px solid var(--t-color-blue);
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }

    .toggle-right {
        border-right: 1px solid var(--t-color-blue);
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
    }

    .active {
        color: var(--t-color-light);
        background: var(--t-color-blue);
        animation-name: fade-in;
        animation-duration: 500ms;
    }

    .inactive {
        color: var(--t-color-medium);
        background: var(--t-color-light-grey)
    }

    .compress {
        animation-name: compress;
        animation-duration: 800ms;
    }

    .error-message {
        width: 100%;
        text-align: center;
        color: var(--t-color-red);
        padding: 10px 40px;
    }
</style>

<script>
    import lister from "./lister.vue";
    import repo_lister from "./repo_lister.vue";
    import kwInput from "./keywords/keywordinput.vue";
    import linkedkws from "./keywords/linkedkws.vue";
    import visualize_kw from './visualize_kw';
    import header from "../components/header.vue";

    export default {
        name: "keywordSearch",
        data() {
            return {
                keyresults: [],
                apikw: [],
                allkw: [],
                allrepos: [],
                somekw: [ { keyword: "", items: "" } ],
                kwText: "",
                loading: false,
                loadingRepos: false,
                networkGraphData: [],
                expandKeywordSearch: true,
                showGraph: false,
                searchKeywords: true,
                keywordToggleClasses: 'toggle-left active',
                textToggleClasses: 'toggle-right inactive',
                searchBodyClasses: '',
                error: ''
            };
        },
        components: {
            lister: lister,
            repo_lister: repo_lister,
            kwInput: kwInput,
            linkedkws: linkedkws,
            visualize_kw: visualize_kw,
            "app-header": header
        },
        created() {
            this.loading = true;
<<<<<<< HEAD
            fetch(`http://${process.env.VUE_APP_URLPATH}/api/keyword/all`)
=======
            fetch("http://" + process.env.VUE_APP_URLPATH + "/api/keyword/all/ccdr")
>>>>>>> api_cleaning
                .then(function(response) {
                    return response.json();
                })
                .then(data => {
                    this.allkw = data.data;
                    this.somekw = data.data;
                    this.loading = false;
                    return data.data;
                }).catch( () => {
                this.loading = false;
            });
        },
        watch: {
            kwText: {
                handler(val) {
                    this.somekw = this.allkw.filter(function(kw) {
                        return kw.keyword.includes(val.toLowerCase());
                    });
                }
            }
        },
        methods: {
            newText: function(val) {
                this.kwText = val;
            },
            getCodeRepos() {
                // Get the code repositories associated with databases.
                if (this.apikw.length < 40 && this.apikw.length > 0) {
                    this.loading = true;
                    let self = this;
                    const databaseIds = this.apikw
                        .filter(x => x.show === "yes")
                        .map(x => x.id)
                        .join(",");

                    fetch("http://" + process.env.VUE_APP_URLPATH + "/api/ccdr/linked?id=" + val)
                        .then(function(response) {
                            return response.json();
                        })
                        .then(data => {
                            console.log("GET REPOS RESPONSE: " + JSON.stringify(data));
                            return data.data.ccdrs;
                        })
                        .then(data => {
                            self.allrepos = data.map(function(x) {
                                x["show"] = "yes";
                                return x;
                            });
                        }).then(data => {
                        this.loading = false;
                            return data;
                    }).catch( () => {
                        this.loading = false;
                    });
                }
            },
            toggleKw(val) {
                const idx = this.keyresults.indexOf(val);
                if (idx === -1) {
                    return this.keyresults.push(val);
                } else {
                    this.keyresults.splice(idx, 1);
                    return this.keyresults;
                }
            },
            onSubmit(evt) {
                evt.preventDefault();
                this.loadingRepos = true;
                let self = this;
                this.error = '';
                const url = `http://${process.env.VUE_APP_URLPATH}/api/keyword/repos?keywords=${self.keyresults.join(",")}`;

                fetch(url)
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        /* Modifying the values and processing the inputs */
                        self.apikw = data.data.keywords;
                        self.apikw = self.apikw.map(function(x) {
                            x["show"] = "yes";
                            return x;
                        });
                    }).then(data => {
                        // ADD TEXT EXCERPT FIELD

                        self.apikw = self.apikw.map(function(x) {
                            const words = x['description'].split(' ');

                            if(words.length > 30) { // LIMIT TO 30 WORDS
                                x['excerpt'] = words.slice(0, 31).join(' ');
                                x['showExcerpt'] = true;
                            }

                            return x;
                        });

                        this.loadingRepos = false;
                        if(this.expandKeywordSearch === true && self.apikw.length > 0) {
                            this.toggleKeywordSearch();
                        }

                        if(self.apikw.length === 0) {
                            console.log("ERROR: NO RESULTS");
                            this.error = 'No Databases Found.  Please update your search and try again.'
                        }
                        return data;
                }).catch( () => {
                    this.loadingRepos = false;
                });
            },
            autoFilterDBs() {
                const filtered = this.apikw.filter(x => x.show === 'yes');
                this.apikw = (filtered.length >= 40) ? filtered.slice(0, 40) : filtered;
            },
            toggleKeywordSearch() {
                this.expandKeywordSearch = !this.expandKeywordSearch;

                if(this.expandKeywordSearch === false) {
                    this.searchBodyClasses = 'compress';
                } else {
                    this.searchBodyClasses = '';
                }
            },
            generateNetworkGraph() {
                this.showGraph = true;
            },
            reset() {
                this.apikw = [];
                this.allrepos = [];
                this.keyresults = [];
                this.showGraph = false;

                if(this.expandKeywordSearch === false) {
                    this.toggleKeywordSearch();
                }
            },
            toggleSearchType() {
                if(this.searchKeywords === true) {
                    this.keywordToggleClasses = 'toggle-left inactive';
                    this.textToggleClasses = 'toggle-right active';
                } else {
                    this.keywordToggleClasses = 'toggle-left active';
                    this.textToggleClasses = 'toggle-right inactive';
                }
                this.searchKeywords = !this.searchKeywords;
            }

        }
    };
</script>

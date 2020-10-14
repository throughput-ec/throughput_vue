<template>
    <div class='app-body'>
        <app-header></app-header>
        <div v-if='loading' class='screen-center' style='height: 80vh;'>
            <b-spinner label='Loading...' style='width: 4rem; height: 4rem;' variant='primary'/>
        </div>
        <div>
            <b-card title="Keyword Search" style='background: rgb(245,245,245);'>
                <div class='toggle-container'>
                    <div v-if='!expandKeywordSearch' class='h1'>
                        <b-icon-plus-square variant='primary' @click='toggleKeywordSearch'></b-icon-plus-square>
                    </div>
                    <div v-if='expandKeywordSearch' class='h1'>
                        <b-icon-dash-square variant='primary' @click='toggleKeywordSearch'></b-icon-dash-square>
                    </div>
                </div>

                <!-- Available terms -->
                <div v-if='expandKeywordSearch'>
                    <kwInput @change="newText"></kwInput>
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
                            <div v-if="somekw.length > 1">
                                <span v-for="index in Math.min(30, somekw.length)" v-bind:key="index">
                                    <span style="margin-right: 2px;margin-bottom: 2px;font-size:14px;">
                                        <b-badge v-on:click="toggleKw(somekw[index - 1].keyword)" variant="primary">
                                            {{ somekw[index - 1].keyword }}
                                            <b-badge variant="light">{{ somekw[index - 1].links }}</b-badge>
                                        </b-badge>
                                    </span>
                                </span>
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
                                <div v-if="keyresults.length > 0">
                                    <span v-for="(item, index) in keyresults" v-bind:key="index">
                                        <span style="margin-right: 2px;margin-bottom: 2px;font-size:14px;">
                                            <b-badge v-on:click="toggleKw(item)" variant="danger">{{ item }}</b-badge>
                                        </span>
                                    </span>
                                </div>
                                <div v-else>
                                    <small>Click on a keyword above to add it to the list of selected
                                     keywords. Click a keyword again to remove it.</small>
                                </div>
                            </b-card>

                            <b-button @click="onSubmit" variant="primary" class='terms-submit'>
                                <span v-if='!loadingRepos'>Submit Keywords</span>
                                <b-spinner v-if='loadingRepos'></b-spinner>
                            </b-button>
                        </div>
                    </b-container>
                </div>
            </b-card>

<!--            ORCID TEST-->
            <div>
                <b-card title='ORCID Login Test'>
                    <a :href='orcid' >ORCID Login</a>
                </b-card>
            </div>

            <!-- This is the part where the dbs show up: -->
            <div v-if="apikw.length > 0" style='margin-top: 15px; border: 1px solid #007bff; border-radius: 4px;'>
                <div style="padding: 15px;">
                    <p style='font-size: 18px;'>You have selected {{ apikw.filter(x => x.show === 'yes').length }} databases.
                    <span v-if="apikw.filter(x => x.show === 'yes').length > 40"> The number of databases selected needs to be 40 or less in order to proceed to search data repositories.</span>
                        <span> You can drop individual databases by clicking the <span class='drop-button-span'>Drop</span> button next to each database below.</span>
                    </p>
                    <p v-if="apikw.filter(x => x.show === 'yes').length > 40" style='font-size: 18px;'>You can also click on <span class='auto-filter-span' @click='autoFilterDBs'>Auto Filter</span> and we will automatically
                        select the top 40 databases based on your keyword search.
                    </p>
                    <div style='display: flex; justify-content: flex-end; padding-left: 30px;'>
                        <b-button v-if="apikw.filter(x => x.show === 'yes').length > 40" @click='autoFilterDBs' variant='primary'>Auto Filter</b-button>
                    </div>
                </div>
            </div>

            <!-- TABS -->
            <div class='tabs' v-if="apikw.length > 0">
                <b-button variant='warning' @click='reset'>Reset Search</b-button>
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
                    <b-tab title='Network Graph' v-if='apikw.length > 0 && apikw.length <= 40' @click='generateNetworkGraph'>
                        <visualize_kw v-if='showGraph' v-bind:databases='apikw' v-bind:repos:='allrepos'></visualize_kw>
                    </b-tab>
                </b-tabs>
            </div>
        </div>
    </div>
</template>

<script>
    import "../assets/containers.css";
    import lister from "./lister.vue";
    import repo_lister from "./repo_lister.vue";
    import kwInput from "./keywords/keywordinput.vue";
    import linkedkws from "./keywords/linkedkws.vue";
    import visualize_kw from './visualize_kw';
    import "../assets/global-styles.css";
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
                orcid: '',
                orcidId: '',
                networkGraphData: [],
                expandKeywordSearch: true,
                showGraph: false,
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
            this.orcid = `https://sandbox.orcid.org/oauth/authorize?client_id=${process.env.VUE_APP_ORCID}&response_type=code&scope=/authenticate&redirect_uri=http://localhost:8080/search`;

            // ORCID CODE & COOKIES
            const code = this.$route.query.code;
            if(code != null) {
                // SAVE CODE AS COOKIE
                let date = new Date();
                date.setTime(date.getTime() + (90 * 86400000)); // EXPIRE COOKIE AFTER 90 DAYS;
                const expires = date.toUTCString();
                document.cookie = "orcid-id=" + code.toString() + "; expires=" + expires;
            } else {
                // CHECK COOKIES FOR ORCID
                const store = decodeURIComponent(document.cookie);
                const cookies = store.split(";");

                for(const cookie of cookies) {
                    if(cookie.substring(0,8) === 'orcid-id') {
                        this.orcidId = cookie.substring(9);
                    }
                }
            }

            fetch("http://" + process.env.VUE_APP_URLPATH + "/api/keyword/all")
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
                    let val = this.apikw
                        .filter(x => x.show === "yes")
                        .map(x => x.id)
                        .join(",");
                    fetch("http://" + process.env.VUE_APP_URLPATH + "/api/linked?id=" + val)
                        .then(function(response) {
                            return response.json();
                        })
                        .then(data => {
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
                const urlbase = "http://" + process.env.VUE_APP_URLPATH + "/api/keyword/repos?";

                fetch(urlbase + "keywords=" + self.keyresults.join(","))
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
                        this.loadingRepos = false;
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
            },
            generateNetworkGraph() {
                this.showGraph = true;
            },
            reset() {
                this.apikw = [];
                this.allrepos = [];
                this.keyresults = [];
                this.showGraph = false;
            }
        }
    };
</script>

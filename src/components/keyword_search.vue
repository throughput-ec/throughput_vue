<template>
    <div class='app-body'>
        <app-header></app-header>
        <div v-if='loading' class='screen-center' style='height: 80vh;'>
            <b-spinner label='Loading...' style='width: 4rem; height: 4rem;' variant='primary'/>
        </div>
        <div>
            <b-card title="Keyword Search" style='background: rgb(245,245,245);'>
                <kwInput @change="newText"></kwInput>

                <!-- Available terms -->
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
                                    <b-badge v-on:click="addKw(somekw[index - 1].keyword)" variant="primary">
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
                    <b-row>
                        <b-col cols="10">
                            <b-card title="Selected terms:">
                                <div v-if="keyresults.length > 0">
                                    <span v-for="(item, index) in keyresults" v-bind:key="index">
                                        <span style="margin-right: 2px;margin-bottom: 2px;font-size:14px;">
                                            <b-badge v-on:click="addKw(item)" variant="danger">{{ item }}</b-badge>
                                        </span>
                                    </span>
                                </div>
                                <div v-else>
                                    <small>Click on a keyword above to add it to the list of selected
                                     keywords. Click a keyword again to remove it.</small>
                                </div>
                            </b-card>
                        </b-col>
                        <b-col cols="2" align-self="center">
                            <b-button @click="onSubmit" variant="primary" class="float-right" style='width: 112px; height: 63px;'>
                                <span v-if='!loadingRepos'>Submit Keywords</span>
                                <b-spinner v-if='loadingRepos'></b-spinner>
                            </b-button>
                        </b-col>
                    </b-row>
                </b-container>
            </b-card>

            <!-- This is the part where the dbs show up: -->
            <div style="padding:10px;" v-if="apikw.length > 0">
                <div style="border-width:1px;">
                    <strong>You have selected {{ apikw.filter(x => x.show === 'yes').length }} databases. You can drop some
                            databases before you proceed to search data repositories by clicking
                            the red "Drop" button.</strong>
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
                </b-tabs>
            </div>

            <div>
                <visualize_kw></visualize_kw>
            </div>

            <div>
                <b-card title='ORCID Login'>
                    <a :href='orcid' >ORCID Login</a>
                </b-card>
            </div>
        </div>
    </div>
</template>

<script>
    import "../assets/containers.css";
    import * as Settings from "../settings";
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
                keylinked: [],
                apikw: [],
                allkw: [],
                allrepos: [],
                somekw: [
                    {
                        keyword: "",
                        items: ""
                    }
                ],
                kwText: "",
                loading: false,
                loadingRepos: false,
                orcid: `https://sandbox.orcid.org/oauth/authorize?client_id=${Settings.ORCID_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=http://localhost:8080/search`
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

            const code = this.$route.query.code;
            if(code != null) {
                console.log("ORCID CODE: " + code);
                //TODO: SAVE AS COOKIE
            } else {
                console.log("NO CODE PARAMETER");
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
            addKw(val) {
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
        }
    };
</script>

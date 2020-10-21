<!-- this is the component that is supposed to list the databases: -->

<template>
    <div>
        <div class='tab-header'>
            <b-button v-b-modal.dbcitation @click="getCite(apikw)" align="right">Get Citations</b-button>

            <b-form-checkbox id="checkboxdb"
                    v-model="status"
                    name="checkboxdb"
                    value="yes"
                    unchecked-value="no"
                    v-b-tooltip.hover
                    title="Unselected resources will be placed at the end of the list.">
                Show Unselected Resources
            </b-form-checkbox>
        </div>

        <b-modal id="dbcitation" title="Citations">
            <pre>{{ this.citations }}</pre>
        </b-modal>

        <hr />

        <div v-for="(item, index) in apikw" v-bind:key="index">
            <b-container v-if="(item.show === 'yes') || ((status === 'yes') && (item.show === 'no'))">
                <b-row align-v="center">
                    <b-col class="col-md-2">
                        <div v-if="item.show === 'yes'">
                            <b-button-group>
                                <b-button @click="dropDB(item)" variant="danger">Drop</b-button>
                            </b-button-group>
                        </div>
                        <div v-else>
                            <b-button-group>
                                <b-button @click="addDB(item)" variant="success">Add</b-button>
                            </b-button-group>
                        </div>
                    </b-col>
                    <b-col class="col-md-10">
                        <h4>
                            <a :href="item.url" rel="noopener noreferrer" target="_blank" style='color: var(--t-color-light-blue)'>{{ item.name }}</a>
                        </h4>

                        <div v-if='item.showExcerpt === true'>
                            <small>{{ item.excerpt }}</small>
                            <button @click='toggleExcerpt(index)' class='excerpt-toggle-button'>...</button>
                        </div>
                        <div v-else>
                            <small>{{ item.description }}</small>
                        </div>

                        <br />
                        <b-container>
                            <b-row align-v="center">
                                <b-col class="text-center" cols="3">
                                    <strong style='color: var(--t-color-blue-green);'>Linked Code Repositories: {{ item.linked }}</strong>
                                </b-col>
                                <b-col>
                                    <strong>Keywords</strong>:<br />

                                    <div class='keyword-container'>
                                    <div v-for="(item, index) in item.keyword" :key="index" class='keyword-badge light-blue-badge'>
                                        <span>{{ item }}</span>
                                    </div>
                                    </div>
                                </b-col>
                            </b-row>
                        </b-container>
                    </b-col>
                </b-row>
                <hr />
            </b-container>

        </div>
    </div>
</template>

<style>
    .light-blue-badge {
        font-size: 12px;
        line-height: 16px;
        border-radius: 4px;
        letter-spacing: 1px;
        margin: 2px 2px;
        padding: 2px 4px;
        background: transparent;
        color: var(--t-color-light-blue);
        cursor: default !important;
    }

    .excerpt-toggle-button {
        background: transparent;
        border: none;
        color: var(--t-color-light-blue);
    }
</style>


<script>

    export default {
        name: "listervue",
        props: {
            apikw: {
                type: Array
            }
        },
        data() {
            return {
                status: "",
                keyresults: [],
                somekw: [
                    {
                        keyword: "",
                        items: ""
                    }
                ],
                kwText: "",
                nodes: [],
                links: [],
                viewer: false,
                lister: true,
                clamped: false,
                citations: null
            };
        },
        mounted() {},
        methods: {
            getkws(id) {
                let getForRepo = function(id) {
                    fetch(`http://${ process.env.VUE_APP_URLPATH }/api/keyword/repo/${id}`)
                        .then(response => response.json());
                };

                return getForRepo(id);
            },
            dropDB(val) {
                const dbs = this.apikw.map(x => x.name);
                const position = dbs.indexOf(val.name);
                this.apikw[position]["show"] = "no";
                this.apikw.sort(function(a, b) {
                    return -a["show"].localeCompare(b["show"]);
                });
                this.$emit("apikw", this.apikw);
            },
            addDB(val) {
                const dbs = this.apikw.map(x => x.name);
                const position = dbs.indexOf(val.name);
                this.apikw[position]["show"] = "yes";
                this.apikw.sort(function(a, b) {
                    return -a["show"].localeCompare(b["show"]);
                });
                this.$emit("apikw", this.apikw);
            },
            getCite(val) {
                let self = this;

                self.ids = val
                    .filter(x => x.show === "yes")
                    .map(x => x.id)
                    .join(",");

                fetch(`http://${process.env.VUE_APP_URLPATH}/api/citations?ids=${self.ids}`)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(data => {
                        self.citations = data.data.citation.join("");
                    });
            },
            toggleExcerpt(index) {
                this.apikw[index]['showExcerpt'] = !this.apikw[index]['showExcerpt'];
                this.$forceUpdate();
            }
        }
    };
</script>

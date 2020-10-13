<!-- this is the component that is supposed to list the databases: -->

<template>
    <div>
        <b-container fluid>
            <b-row>
                <b-col cols="3">
                    <b-button v-b-modal.dbcitation @click="getCite(apikw)" align="right">
                        Get Citations
                    </b-button>
                </b-col>
                <b-col cols="5">
                    <b-form-checkbox
                            id="checkboxdb"
                            v-model="status"
                            name="checkboxdb"
                            value="yes"
                            unchecked-value="no"
                            v-b-tooltip.hover
                            title="Unselected resources will be placed at the end of the list."
                    >
                        Show Unselected Resources
                    </b-form-checkbox>
                </b-col>
            </b-row>
        </b-container>

        <b-modal id="dbcitation" title="Citations">
            <pre>
                {{ this.citations }}
            </pre>
        </b-modal>

        <hr />

        <div v-for="(item, index) in apikw" v-bind:key="index">
            <div v-if="(item.show === 'yes') || ((status === 'yes') && (item.show === 'no'))">
                <b-container fluid>
                    <b-row align-v="center">
                        <b-col class="col-md-2">
                            <div v-if="item.show == 'yes'">
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
                                <a v-bind:href="item.url"
                                   rel="noopener noreferrer"
                                   target="_blank"
                                >{{ item.name }}</a>
                            </h4>
                            <small>{{ item.description }}</small>
                            <br />
                            <b-container>
                                <b-row align-v="center">
                                    <b-col class="text-center" cols="3">
                                        <strong>Linked Code Repositories: {{ item.linked }}</strong>
                                    </b-col>
                                    <b-col>
                                        <strong>Keywords</strong>:<br />
                                        <span v-for="(item, index) in item.keyword" v-bind:key="index">
                                            <b-badge variant="primary">{{ item }}</b-badge>
                                        </span>
                                    </b-col>
                                </b-row>
                            </b-container>
                        </b-col>
                    </b-row>
                    <hr />
                </b-container>
            </div>
        </div>
    </div>
</template>

<script>
    import "../assets/containers.css";

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
                    fetch(
                        "http://" + process.env.VUE_APP_URLPATH + "/api/keyword/repo/" + id
                    ).then(response => response.json());
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
                    .filter(x => x.show == "yes")
                    .map(x => x.id)
                    .join(",");

                fetch(`http://${process.env.VUE_APP_URLPATH}/api/citations?ids=${self.ids}`)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(data => {
                        self.citations = data.data.citation.join("");
                    });
            }
        }
    };
</script>

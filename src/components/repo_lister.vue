<!-- this is the component that is supposed to list the databases: -->

<template>
    <div>
        <div class='tab-header'>
            <b-button v-if='apikw.length > 0' v-b-modal.dbcitation @click="getCite(apikw)" align="right">Get Citations</b-button>

            <b-form-checkbox id="checkboxrepo"
                             v-model="status"
                             name="checkboxrepo"
                             value="yes"
                             unchecked-value="no"
                             v-b-tooltip.hover
                             title="Unselected resources will be placed at the end of the list.">
                Show Unselected Resources
            </b-form-checkbox>
        </div>

        <b-modal id="repocitation" title="Citations">
            <pre>{{ this.citations }}</pre>
        </b-modal>

        <div v-for="(item, index) in apikw" v-bind:key="index">
            <div v-if="(item.show === 'yes') || ((status === 'yes') && (item.show === 'no'))">
                <b-container fluid>
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
                                <a v-bind:href="item.url" rel="noopener noreferrer" target="_blank">{{ item.name }}</a>&nbsp;
                                <span v-for="index in item.dbs" v-bind:key="index">
                                    <span style="margin-right: 2px;margin-bottom: 2px;font-size:14px;">
                                        <b-badge variant="primary">{{ index }}</b-badge>
                                    </span>
                                </span>
                            </h4>
                            <small>{{ item.description }}</small>
                            <br />
                        </b-col>
                    </b-row>
                    <hr />
                </b-container>
            </div>
        </div>
    </div>
</template>

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
                status: "no",
                viewer: false,
                lister: true,
                clamped: false,
                citations: null
            };
        },
        components: {},
        computed: {},
        mounted() {},
        watch: {},
        methods: {
            toggle() {
                this.clamped = !this.clamped;
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

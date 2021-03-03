<!-- this is the component that lists the repositories: -->
<template>
    <div>
        <div v-if='repos.length > 0' class='tab-header'>
            <button v-if='repos.length > 0' v-b-modal.dbcitation @click="getCite(repos)" class='light-blue-outline-button'>Get Citations</button>

            <b-form-checkbox id="checkboxrepo"
                             v-model="status"
                             name="checkboxrepo"
                             value="yes"
                             unchecked-value="no"
                             v-b-tooltip.hover
                             title="Unselected resources will be placed at the end of the list.">
                <label style='color: var(--t-color-light-blue);'>Show Unselected Resources</label>
            </b-form-checkbox>
        </div>

        <b-modal id="repocitation" title="Citations">
            <pre>{{ this.citations }}</pre>
        </b-modal>

        <hr />

        <div v-for="(item, index) in toDisplay" :key="index">
            <b-container v-if="(item.show === 'yes' || status === 'yes')">
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
                            <a :href="item.url" rel="noopener noreferrer" target="_blank" style='color: var(--t-color-light-blue)'>{{ item.name }}</a>&nbsp;
                        </h4>
                        <div class='keyword-container'>
                            <div v-for="(ccdrs, index) in item.ccdrs" :key="index" class='keyword-badge transparent-blue-green-badge'>
                                <span>{{ ccdrs }}</span>
                                <span v-if='index < item.ccdrs.length - 1' style='color: var(--t-color-light);'>,</span>
                            </div>
                        </div>
                        <small>{{ item.description }}</small>
                        <br />
                    </b-col>
                </b-row>
                <hr />
            </b-container>
        </div>

        <t-pagination v-if='showPagination === true' :data='repos' :showAll='(status === "yes")' @updateToDisplay="updateToDisplay"></t-pagination>
    </div>
</template>


<script>
    import pagination from "./elements/pagination";

    export default {
        name: "listervue",
        props: {
            repos: { type: Array }
        },
        components: {
           "t-pagination": pagination
        },
        data() {
            return {
                status: "no",
                citations: null,
                toDisplay: [],
                showPagination: false,
            };
        },
        watch: {
            repos: {
                handler(value) {
                    if(value.length > 10) {
                        this.showPagination = true;
                    } else {
                        this.toDisplay = value;
                    }
                }
            }
        },
        methods: {
            dropDB(val) {
                const dbs = this.repos.map(x => x.name);
                const position = dbs.indexOf(val.name);
                this.repos[position]["show"] = "no";
                this.repos.sort(function(a, b) {
                    return -a["show"].localeCompare(b["show"]);
                });
                this.$emit("repos", this.repos);
            },
            addDB(val) {
                const dbs = this.repos.map(x => x.name);
                const position = dbs.indexOf(val.name);
                this.repos[position]["show"] = "yes";
                this.repos.sort(function(a, b) {
                    return -a["show"].localeCompare(b["show"]);
                });
                this.$emit("repos", this.repos);
            },
            getCite(val) {
                let self = this;

                self.ids = val
                    .filter(x => x.show === "yes")
                    .map(x => x.id)
                    .join(",");

                fetch(`${process.env.VUE_APP_URLPATH}/api/citations?ids=${self.ids}`)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(data => {
                        self.citations = data.data.citation.join("");
                    });
            },
            updateToDisplay(data) {
                this.toDisplay = data;
            }
        }
    };
</script>

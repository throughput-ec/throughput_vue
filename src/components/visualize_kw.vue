<template>
    <div>
        <b-card title='Keyword & Database Network Diagram'>
            <div v-if='nodes.length > 0' style='height: 1000px;'>
                <d3-network :net-nodes="nodes" :net-links="links" :options="options" />
            </div>
        </b-card>
    </div>
</template>

<style src="vue-d3-network/dist/vue-d3-network.css"></style>

<style>
    .node {
        stroke: #AAAAAA !important;
        stroke-width: 1px !important;
    }

    .db-node-text {
        font-weight: 700;
        fill: #08306B !important;
    }

    .keyword-node-text-large {
        font-weight: 700;
        fill: #DC3545 !important;
    }

</style>

<script>
    import D3Network from "vue-d3-network";
    import * as d3 from "d3";

    export default {
        name: "keywordSearch",
        components: {
            D3Network
        },
        props: {
            databases: Array,
            repos: Array,
        },
        data() {
            return {
                nodes: [],
                links: [],
                options: { nodeLabels: true, canvas: false, linkWidth: 1 }
            };
        },
        created() {
            this.nodes = [];
            this.links = [];
            let keywords = {};

            for(let index = 0; index < this.databases.length; index++) {
                // DB NODE SIZE
                const size = ((1 + Math.sqrt(this.databases[index]['linked'])).toFixed()) * 2; //TODO: ADJUST OR REMOVE THIS MULTIPLE

                //SET KEYWORDS
                for(const keyword of this.databases[index]['keyword']) {
                    if(!keywords[keyword]) {
                        keywords[keyword] = [];
                    }
                }

                // ADD DB IDS FOR EACH KEYWORD
                for(const keyword of this.databases[index]['keyword']) {
                   keywords[keyword].push(this.databases[index]['id'])
                }


                // DB NODES
                this.nodes.push({
                    id: this.databases[index]['id'],
                    name: this.databases[index]['name'],
                    _color: this.getDBColor(size),
                    _labelClass: "db-node-text",
                    _size: size,
                });
            }

            // KEYWORD NODES
            const keys = Object.keys(keywords);

            for(const key of keys) {
                if(keywords[key].length > 1) {
                    this.nodes.push({
                        id: key,
                        name: key,
                        _color: this.getKeywordColor(keywords[key].length),
                        _labelClass: (keywords[key].length > 5) ? "keyword-node-text-large" : "keyword-node-text-small",
                        _size: keywords[key].length * 3, //TODO: ADJUST OR REMOVE THIS MULTIPLE
                    });
                } else if (keywords[key].length === 1) {
                    this.nodes.push({
                        id: key,
                        name: key,
                        _color: '#000000',
                        _size: 1,
                    });
                }

                // LINKS
                for(const dbID of keywords[key]) {
                    this.links.push({
                        sid: key, // SOURCE NODE ID
                        tid: dbID, // TARGET NODE ID   (OTHER PROPERTIES AVAILABLE: id, name, _svgAttrs)
                        _color: '#AAAAAA'
                    });
                }
            }
        },
        methods: {
            getDBColor(i) {
                const color = d3.scaleSequential().domain([1, 25])
                    .interpolator(d3.interpolateBlues);

                return color(i);
            },
            getKeywordColor(i) {
                const color = d3.scaleSequential().domain([1, 15])
                    .interpolator(d3.interpolateReds);

                return color(i);
            }
        }
    };
</script>

/*
database object = {
    id: string;
    name: string;
    description: string;
    url: string;
    keyword: string[];
    linked: number;
    show: string;
}
*/

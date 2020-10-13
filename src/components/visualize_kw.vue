<template>
    <div>
        <b-card>
            <div v-if='nodes.length > 0' style='height: 900px;'>
                <d3-network :net-nodes="nodes" :net-links="links" :options="options" />
            </div>
        </b-card>
    </div>
</template>

<style src="vue-d3-network/dist/vue-d3-network.css"></style>

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
            };
        },
        created() {
            this.nodes = [];
            this.links = [];

            for(let index = 0; index < this.databases.length; index++) {
                this.nodes.push({
                    id: this.databases[index]['id'],
                    name: this.databases[index]['name'],
                    _color: this.getColor(this.databases[index]['linked']),
                    _size: this.databases[index]['linked'],
                });
            }

            //TODO: UPDATE - FOR NOW JUST ADD SOME RELATIONSHIPS UNTIL REPOS ARE AVAILABLE
            for(let index = 0; index < this.databases.length; index++) {
                if(index > 1) {
                    this.links.push({
                        sid: this.nodes[index - 1].id, // SOURCE NODE ID
                        tid: this.nodes[index].id, // TARGET NODE ID   (OTHER PROPERTIES AVAILABLE: id, name, _color, _svgAttrs)
                        _color: '#D83A7A'
                    })
                }
            }
        },
        computed: {
            options() {
                return {
                    nodeSize: 1,
                    nodeLabels: true,
                    canvas: false,
                    linkWidth: 1
                };
            },
        },
        methods: {
            getColor(i) {
                const color = d3.scaleSequential().domain([1,400])
                    .interpolator(d3.interpolateRdYlBu);

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

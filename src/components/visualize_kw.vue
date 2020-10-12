<template>
    <div>
        <b-card title="Visualization Goes Here...">
            <div>
<!--                <d3-network :net-nodes="nodes" :net-links="links" :options="options" />-->
            </div>
        </b-card>
    </div>
</template>

<style src="vue-d3-network/dist/vue-d3-network.css"></style>


<script>
    import D3Network from "vue-d3-network";

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
                links: []
            };
        },
        computed: {
            options() {
                return {
                    nodeSize: 20,
                    nodeLabels: true,
                    canvas: false,
                    linkWidth: 3
                };
            }
        },
    };
</script>


/*
{
"nodes": [
{"id": "rd", "name": "Research Database", "_color": "#E94500", "_size": 20},
{"id": "rda", "name": "Research Database", "_color": "#E94500", "_size": 20},
{"id": "rdb", "name": "Research Database", "_color": "#E94500", "_size": 20},
{"id": "gh", "name": "GitHub", "_color": "black", "_size": 30},
{"id": "or", "name": "ORCiD", "_color": "#A6CE39", "_size": 30},
{"id": "an", "name": "Annotation", "_color": "#D83A7A", "_size": 10},
{"id": "cr", "name": "Code Repository", "_color": "gray", "_size": 20},
{"id": "crt", "name": "Code Repository", "_color": "gray", "_size": 20},
{"id": "crth", "name": "Code Repository", "_color": "gray", "_size": 20},
{"id": "crf", "name": "Code Repository", "_color": "gray", "_size": 20},
{"id": "pr", "name": "Person", "_color": "#A1E900", "_size": 10},
{"id": "prt", "name": "Person", "_color": "#A1E900", "_size": 10},
{"id": "ant", "name": "Annotation", "_color": "#D83A7A", "_size": 10},
{"id": "r3", "name": "Re3Data", "_color": "#E94500", "_size": 30},
{"id": "anth", "name": "Annotation", "_color": "#D83A7A", "_size": 10},
{"id": "anf", "name": "Annotation", "_color": "#D83A7A", "_size": 10}

],
"links": [
{"sid": "rd", "tid": "an"},
{"sid": "rd", "tid": "anth"},
{"sid": "rd", "tid": "anf"},
{"sid": "cr", "tid": "an"},
{"sid": "pr", "tid": "an"},
{"sid": "or", "tid": "pr"},
{"sid": "or", "tid": "prt"},
{"sid": "gh", "tid": "cr"},
{"sid": "gh", "tid": "crt"},
{"sid": "gh", "tid": "crth"},
{"sid": "gh", "tid": "crf"},
{"sid": "crt", "tid": "ant"},
{"sid": "rd", "tid": "ant"},
{"sid": "prt", "tid": "ant"},
{"sid": "r3", "tid": "rd"},
{"sid": "r3", "tid": "rda"},
{"sid": "r3", "tid": "rdb"}
]
}
*/

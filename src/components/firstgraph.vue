<template>
  <div class="pagediv">
    <div class="dthreediv">
      <d3-network :net-nodes="nodes" :net-links="links" :options="options" />
    </div>
    <div class="titlediv">
      <h1 style="vertical-align:middle;letter-spacing:5px;">THROUGHPUT</h1>
      <b-button class='mx-2' @click="getStarted()">Get Started</b-button>
      <div>Find out more</div>
    </div>
  </div>
</template>
<style src="vue-d3-network/dist/vue-d3-network.css"></style>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Alegreya+Sans+SC&display=swap');

  .pagediv {
    text-align:center;
    position:absolute;
    width:100%;
    height:100%;
    top:0;
    left:0;
  }
  .dthreediv {
    width:100%;
    position:absolute;
    top:0;
    left:0;
  }
  .titlediv {
    width:100%;
    position:absolute;
    top:30%;
    z-index:10;
    background:rgba(200, 54, 54, 0.7);
    margin-bottom: 100;
    font-family: 'Alegreya Sans SC', sans-serif;
  }
  .node {
    stroke-width: 2;
    opacity: .8;
  }
  .link {
    opacity: .5;
  }
</style>

<script>
  import '../assets/containers.css'
  import basicGraph from '../assets/opengraph.json'
  import D3Network from 'vue-d3-network'

  export default {
    name: 'throughGraph',
    components: {
      D3Network
    },
    data() {
      return {
        loading: false,
        basicGraph: basicGraph,
        nodes: basicGraph.nodes,
        links: basicGraph.links,
        nodeSize:10,
        canvas:false
      }
    },
    computed:{
      options(){
        return{
          force: 3000,
          size:{ w:600, h:600},
          nodeSize: this.nodeSize,
          nodeLabels: true,
          canvas: this.canvas,
          linkWidth:2
        }
      }
    },
    methods: {
      getStarted() {
          this.$emit('startup', true)
      }
    }
  }
</script>

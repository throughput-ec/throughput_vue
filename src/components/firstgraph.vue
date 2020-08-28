<template>
  <div class="pagediv">
    <div class="dthreediv">
      <d3-network :net-nodes="nodes" :net-links="links" :options="options" />
    </div>
    <div class="titlediv">
      <h1 style="vertical-align:middle;letter-spacing:5px;">THROUGHPUT</h1>
      <img src=@/assets/logo_earthcube_cube-only_SMALL.png height=50px />
      <b-button class="mx-2" @click="getStarted()" variant="success"
        >Get Started</b-button
      >
      <b-button v-b-modal.findout variant="info">Find out more!</b-button>
      <img src="@/assets/nsf.png" height=50px />
      <b-modal id="findout" title="Throughput Database">
        Throughput links data resources, such as research databases, to code
        repositories, such as those on
        <a href="http://github.com">github.com</a> that reference those data
        resources.
        <img src="throughput_modal.svg" width="100%" style="padding:20px;" />
        By searching for databases and repositories using keywords Throughput
        returns all associated data resources, and provides links to code
        repositories that either reference those data resources, or use those
        data resources in analysis.
      </b-modal><br />
      <small>Funding support from the National Science Foundation Award 1928366</small>
    </div>
  </div>
</template>
<style src="vue-d3-network/dist/vue-d3-network.css"></style>
<style>
@import url("https://fonts.googleapis.com/css2?family=Alegreya+Sans+SC&display=swap");

.pagediv {
  text-align: center;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.dthreediv {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.titlediv {
  width: 100%;
  position: absolute;
  top: 30%;
  z-index: 10;
  opacity: 0.8;
  background: rgba(200, 54, 54, 0.7);
  margin-bottom: 100;
  padding: 20px;
  font-family: "Alegreya Sans SC", sans-serif;
}
.node {
  stroke-width: 2;
  opacity: 0.8;
}
.link {
  opacity: 0.5;
}
</style>

<script>
import "../assets/containers.css";
import basicGraph from "../assets/opengraph.json";
import D3Network from "vue-d3-network";

export default {
  name: "throughGraph",
  components: {
    D3Network
  },
  data() {
    return {
      loading: false,
      basicGraph: basicGraph,
      nodes: basicGraph.nodes,
      links: basicGraph.links,
      nodeSize: 10,
      canvas: false
    };
  },
  computed: {
    options() {
      return {
        force: 3000,
        size: { w: 600, h: 600 },
        nodeSize: this.nodeSize,
        nodeLabels: true,
        canvas: this.canvas,
        linkWidth: 2
      };
    }
  },
  methods: {
    getStarted() {
      this.$emit("startup", true);
    }
  }
};
</script>

<template>
  <div class="page-div">
    <div class="d-three-div">
      <d3-network :net-nodes="nodes" :net-links="links" :options="options" />
    </div>

    <div class="title-div">
      <h1 style="vertical-align: middle; letter-spacing: 4px">THROUGHPUT</h1>

      <img
        src="@/assets/img/logo_earthcube_cube-only_SMALL.png"
        height="50px"
        alt="earth cube"
      />
      <b-button class="mx-2" @click="getStarted()" variant="success"
        >Get Started</b-button
      >
      <b-button v-b-modal.findout variant="info">Find out more!</b-button>
      <img
        src="@/assets/img/nsf.png"
        height="50px"
        alt="national science foundation logo"
      />

      <b-modal id="findout" title="Throughput Database" ok-only>
        Throughput links data resources, such as research databases, to code
        repositories, such as those on
        <a href="http://github.com">github.com</a> that reference those data
        resources.
        <img
          src="@/assets/throughput_modal.svg"
          width="100%"
          style="padding: 20px"
          alt="network diagram"
        />
        By searching for databases and repositories using keywords Throughput
        returns all associated data resources, and provides links to code
        repositories that either reference those data resources, or use those
        data resources in analysis.
        <div>
          <b-button variant="primary" block href="http://throughputdb.com/about"
            >More Information</b-button
          >
        </div> </b-modal
      ><br />

      <small
        >Funding support from the National Science Foundation Award
        1928366</small
      >
    </div>
  </div>
</template>

<style src="vue-d3-network/dist/vue-d3-network.css"></style>
<style>
.page-div {
  text-align: center;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.d-three-div {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.title-div {
  width: 100%;
  position: absolute;
  top: 30%;
  z-index: 10;
  opacity: 0.8;
  background: rgba(200, 54, 54, 0.7);
  padding: 20px;
  font-family: "Montserrat", sans-serif;
}
</style>

<script>
import basicGraph from "../assets/opengraph.json";
import D3Network from "vue-d3-network";

export default {
  name: "throughGraph",
  components: {
    D3Network,
  },
  data() {
    return {
      loading: false,
      basicGraph: basicGraph,
      nodes: basicGraph.nodes,
      links: basicGraph.links,
      nodeSize: 10,
      canvas: false,
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
        linkWidth: 2,
      };
    },
  },
  methods: {
    getStarted() {
      this.$router.push("search");
    },
  },
};
</script>

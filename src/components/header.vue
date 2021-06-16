<template>
  <header class="header">
    <div class="header-menu">
      <a :href="home" class="menu-button">Home</a>
      <a :href="about" class="menu-button">About Throughput</a>
      <a
        href="https://github.com/throughput-ec"
        class="menu-button"
        target="_blank"
        >GitHub Code</a
      >
      <div v-if="this.orcidId.access_token === ''">
        <div
          id="orcidWidget"
          :data-clientid="this.orcid"
          :data-redirecturi="this.home"
          data-size="large"
          data-env="production"
        ></div>
      </div>
      <div v-else>
        <b-button variant="success" pill>Logged Into ORCID</b-button>
      </div>
    </div>
    <div class="header-hero">
      <div class="hero-container">
        <div class="hero-inner">
          <h1>Throughput Data and Software Annotation</h1>
          <img
            src="@/assets/graph_place.png"
            class="header-logo"
            alt="sample-network-diagram"
          />
          <h4>Annotation Editor</h4>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import orcidWidget from "@/assets/js/orcid-widget.js";

export default {
  name: "Header",
  data() {
    return {
      showLogin: true,
      orcid: "",
      orcidId: { access_token: "", orcidGivenName: "", orcidFamilyName: "" },
      home: "",
      about: "https://throughputdb.com/about",
    };
  },
  created() {
    this.orcid = process.env.VUE_APP_ORCID;
    this.home = process.env.VUE_APP_BASEURL;
  },
  mounted() {
    if (this.$route.hash !== "") {
      this.processHash(this.$route.hash);
    }
    // CHECK COOKIES FOR ORCID
    this.orcidId = this.$cookies.get("orcidId");
  },
  methods: {
    processHash(val) {
      let self = this;
      var input = val
        .replace("#", "")
        .split("&")
        .map((x) => {
          var y = x.split("=");
          var obj = {};
          obj[y[0]] = y[1];
          return obj;
        })
        .reduce(function (acc, x) {
          for (var key in x) acc[key] = x[key];
          return acc;
        });
      self.orcidlog = input;
      this.$cookies.set("orcidId", input);
    },
  },
};
</script>

<template>
  <header class="header">
    <div class="header-menu">
      <a :href="about" class="menu-button">About Throughput</a>
      <a
        href="https://github.com/throughput-ec"
        class="menu-button"
        target="_blank"
        >GitHub Code</a
      >
      <div v-if="this.orcidId.access_token === ''">
        <a
          id="orcidAuthButton"
          href="https://orcid.org/oauth/authorize?response_type=token&redirect_uri=https://throughputdb.com/search&client_id=APP-OKAEGWFY7MEOK4HE&scope=openid"
        >
          <b-button id="loginorcid-1" variant="warning" pill
            >Log Into ORCID</b-button
          >
        </a>
        <b-tooltip target="loginorcid-1" triggers="hover">
          Use ORCiD to manage your authentication on Throughput.
        </b-tooltip>
      </div>
      <div v-else>
        <b-button variant="success" pill @click="logOut()" id="loginorcid-2">
          Logged Into ORCiD
        </b-button>
        <b-tooltip target="loginorcid-2" triggers="hover">
          Click to logout and remove ORCiD-related cookies.
        </b-tooltip>
      </div>
    </div>
    <div class="header-hero">
      <div class="hero-container">
        <div class="hero-inner">
          <h1>Throughput Database</h1>
          <img
            src="@/assets/graph_place.png"
            class="header-logo"
            alt="sample-network-diagram"
          />
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
    if (this.$cookies.isKey("orcidId")) {
      this.orcidId = this.$cookies.get("orcidId");
    }
  },
  methods: {
    logOut() {
      this.orcidId = {
        access_token: "",
        orcidGivenName: "",
        orcidFamilyName: "",
      };
      this.$cookies.remove("orcidId");
    },
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

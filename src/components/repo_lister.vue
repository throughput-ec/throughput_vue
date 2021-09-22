<!-- this is the component that lists the repositories: -->
<template>
  <div width="100%">
    <b-modal id="meta-modal" v-if="modalVisible" @close="modalVisible = false"
      ><div>
        <pre>{{ this.metaModal }}</pre>
      </div></b-modal
    >
    <searchfilter @filterprops="filterprops"></searchfilter>

    <hr />

    <div v-for="(item, index) in toDisplay" :key="index">
      <repoItems :repoItem="item" />
    </div>

    <t-pagination
      v-if="showPagination === true"
      :data="repos"
      :showAll="status === 'yes'"
      @updateToDisplay="updateToDisplay"
    ></t-pagination>
  </div>
</template>

<script>
import pagination from "./elements/pagination";
import searchfilter from "./elements/repofilter";
import repoItems from "./elements/repoBox.vue";

export default {
  name: "listervue",
  props: {
    repos: { type: Array },
  },
  components: {
    "t-pagination": pagination,
    searchfilter: searchfilter,
    repoItems: repoItems,
  },
  data() {
    return {
      modalVisible: false,
      metaModal: "",
      status: "yes",
      citations: null,
      toDisplay: [],
      showPagination: false,
      license: [
        { value: null, text: "Any License" },
        { value: "a", text: "" },
        { value: "b", text: "Has a License" },
        { value: "c", text: "This is an option with object value" },
        { value: "d", text: "This one is disabled", disabled: true },
      ],
    };
  },
  watch: {
    repos: {
      handler(value) {
        if (value.length > 10) {
          this.showPagination = true;
        } else {
          this.toDisplay = value;
        }
      },
    },
  },
  methods: {
    filterprops(val) {
      let self = this;
      if (val.readme === "yes") {
        self.repos = self.repos.filter(
          (x) => x.meta.readme.readme.char !== null
        );
      }
      if (val.license === "yes") {
        self.repos = self.repos.filter((x) => x.meta.readme.license !== null);
      }
      self.repos = self.repos.filter((x) => {
        if (x.meta.commits !== null) {
          if (x.meta.commits.range.length == 2) {
            date = Date.parse(x.meta.commits.range)
          }
        }
      });
      this.$emit("repos", self.repos);
    },
    dropDB(val) {
      let self = this;
      const dbs = this.repos.map((x) => x.name);
      const position = dbs.indexOf(val.name);
      self.repos[position]["show"] = "no";
      self.repos.sort(function (a, b) {
        return -a["show"].localeCompare(b["show"]);
      });
      this.$emit("repos", this.repos);
    },
    addDB(val) {
      let self = this;
      const dbs = this.repos.map((x) => x.name);
      const position = dbs.indexOf(val.name);
      self.repos[position]["show"] = "yes";
      self.repos.sort(function (a, b) {
        return -a["show"].localeCompare(b["show"]);
      });
      this.$emit("repos", this.repos);
    },
    getCite(val) {
      let self = this;

      self.ids = val
        .filter((x) => x.show === "yes")
        .map((x) => x.id)
        .join(",");

      fetch(`${process.env.VUE_APP_URLPATH}/api/citations?ids=${self.ids}`)
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          self.citations = data.data.citation.join("");
        });
    },
    updateToDisplay(data) {
      this.toDisplay = data;
    },
  },
};
</script>

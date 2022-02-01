<!-- this is the component that lists the repositories: -->
<template>
  <div>
    <b-container style="margin-left: 0px; margin-right: 0px; buffer-left: 0px">
      <b-row />
      <b-row>
        <b-col cols="3">
          <searchfilter @filterprops="filterprops"></searchfilter>
        </b-col>
        <b-col>
          <hr />
          <div v-for="(item, index) in toDisplay" :key="index">
            <repoItems :repoItem="item" />
          </div>
        </b-col>
      </b-row>
    </b-container>
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
import itemsjs from "itemsjs";

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
  created() {
    this.itemsJsInstance = itemsjs(this.repos, {});
  },
  mounted: function () {
    this.repoSet = this.repos;
    this.repoSet = this.repoSet.map((x) => {
      return x;
    });
  },
  data() {
    return {
      repoSet: {},
      itemsJsInstance: {},
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
            date = Date.parse(x.meta.commits.range);
          }
        }
      });
      this.$emit("repos", self.repos);
    },
    updateToDisplay(data) {
      this.toDisplay = data;
    },
  },
};
</script>

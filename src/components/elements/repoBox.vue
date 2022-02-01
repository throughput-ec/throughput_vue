<!-- Template for displaying a repository.
     To be used in ./repo_lister.vue -->
<template>
  <div>
    <b-container v-if="repoItem.show === 'yes' || status === 'yes'">
      <b-row align-v="center">
        <b-col fluid="sm" cols="2">
          <div v-if="repoItem.show === 'yes'">
            <b-button-group>
              <b-button @click="dropDB(repoItem)" variant="danger"
                >Drop</b-button
              >
            </b-button-group>
          </div>
          <div v-else>
            <b-button-group>
              <b-button @click="addDB(repoItem)" variant="success"
                >Add</b-button
              >
            </b-button-group>
          </div>
        </b-col>
        <b-col cols="8">
          <b-row>
            <h4>
              <a
                :href="repoItem.url"
                rel="noopener noreferrer"
                target="_blank"
                style="color: var(--t-color-light-blue)"
                >{{ repoItem.name }}</a
              >&nbsp;
            </h4>
          </b-row>
          <b-row>
            <div>
              <b-badge v-if="repoItem.hasOwnProperty('meta')" variant="primary">
                {{ checkLicense(repoItem.meta.readme.license) }}
              </b-badge>
              &nbsp;
              <b-badge v-if="repoItem.hasOwnProperty('meta')" variant="none">
                {{ checkReadme(repoItem.meta.readme.readme.char) }}
              </b-badge>
            </div>
            <div class="keyword-container">
              <div
                v-for="(ccdrs, index) in repoItem.ccdrs"
                :key="index"
                class="keyword-badge transparent-blue-green-badge"
              >
                <span>{{ ccdrs }}</span>
                <span
                  v-if="index < repoItem.ccdrs.length - 1"
                  style="color: var(--t-color-light)"
                  >,</span
                >
              </div>
            </div>
            {{ repoItem.description }}
          </b-row>
          <b-row>
            <div
              v-if="repoItem.meta.topics.length > 0"
              style="display: inline-block"
            >
              <div
                v-for="(topic, index) in repoItem.meta.topics"
                :key="index"
                class="keyword-badge transparent-green-badge"
                style="display: inline"
              >
                <span>{{ topic }}</span>
                <span
                  v-if="index < repoItem.ccdrs.length - 1"
                  style="color: var(--t-color-light)"
                  >,</span
                >
              </div>
            </div>
            <div v-else>
              <div
                class="keyword-badge transparent-red-badge"
                style="display: inline"
              >
                <span><small>No Topic Listed</small></span>
                <span style="color: var(--t-color-light)">,</span>
              </div>
            </div>
          </b-row>
        </b-col>
        <b-col>
          <b-button v-b-modal.meta-modal @click="printMeta(repoItem)"
            >Show meta</b-button
          >
        </b-col>
      </b-row>
      <hr />
    </b-container>
  </div>
</template>
<script>
export default {
  name: "repoBox",
  props: {
    repoItem: { type: Object },
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
  methods: {
    printMeta(val) {
      this.modalVisible = true;
      this.metaModal = JSON.stringify(val, null, 2);
    },
    checkLicense(val) {
      if (val === null) {
        var output = "Implicit Copyright";
      } else {
        output = val;
      }
      return output;
    },
    checkReadme(val) {
      if (val === null || val === undefined) {
        var output = "No Readme";
      } else {
        output = "README: " + val.toLocaleString() + " chars";
      }
      return output;
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
  },
};
</script>

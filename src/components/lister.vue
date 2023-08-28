<!-- this is the component that is supposed to list the databases: -->

<template>
  <div>
    <div style="padding:15px;">
      <b-form-checkbox
        id="checkboxdb"
        v-model="status"
        name="checkboxdb"
        value="yes"
        unchecked-value="no"
        >
        <label
          v-b-tooltip.hover
          title="Unselected resources will be placed at the end of the list."
          >Show Unselected Resources</label>
      </b-form-checkbox>
      
      <button
        v-b-modal.dbcitation
        @click="getCite(datacatalogs)"
        type="button"
        class="btn btn-outline-light"
      >
        Get Citations
      </button>
    </div>

    <b-modal id="dbcitation" title="Citations" ok-only>
      <pre>{{ this.citations }}</pre>
    </b-modal>

    <hr />

    <!-- This is to display each database/repository -->
    <div v-for="(item, index) in toDisplay" :key="item.name">
      <b-container v-if="item.show === 'yes' || status === 'yes'">
        <b-row align-v="center">
          <b-col class="col-md-2">
            <div v-if="item.show === 'yes'">
              <b-button-group>
                <b-button @click="switchDB(item)" variant="danger">
                  Drop
                </b-button>
                <b-button @click="selOne(item)" variant="primary">
                  Select Only
                </b-button>
              </b-button-group>
            </div>
            <div v-else>
              <b-button-group>
                <b-button @click="switchDB(item)" style="background-color:#aaeead;color:black;">
                  Add
                </b-button>
                <b-button @click="selOne(item)" variant="primary">
                  Select Only
                </b-button>
              </b-button-group>
            </div>
          </b-col>
          <!-- The link to the external database or repo -->
          <b-col class="col-md-10">
            <h4>
              <a
                :href="item.url"
                rel="noopener noreferrer"
                target="_blank"
                style="color: var(--t-color-light-blue)"
                >{{ item.name }}</a
              >
            </h4>
            <div v-if="item.showExcerpt === true">
              <small>{{ item.excerpt }}</small>
              <button
                @click="toggleExcerpt(index)"
                class="excerpt-toggle-button"
              >
                ...
              </button>
            </div>
            <div v-else>
              <small>{{ item.description }}</small>
            </div>

            <br />
            <b-container>
              <b-row>
                <b-col v-if="item.count > 0" cols="3">
                  <strong style="color: var(--t-color-blue-green)"
                    >Linked Code Repositories: {{ item.count }}</strong
                  >
                </b-col>
                <b-col v-if="item['keywords']">
                  <strong>Matching Keywords</strong>:<br />

                  <div class="keyword-container">
                    <div
                      v-for="(item, index) in item.keywords"
                      :key="index"
                      class="keyword-badge light-blue-badge"
                    >
                      <span>{{ item }}</span>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </b-container>
          </b-col>
        </b-row>
        <hr />
      </b-container>
    </div>

    <t-pagination
      v-if="showPagination === true"
      :data="datacatalogs"
      :showAll="status === 'yes'"
      @updateToDisplay="updateToDisplay"
    ></t-pagination>
  </div>
</template>

<style>
.excerpt-toggle-button {
  background: transparent;
  border: none;
  color: var(--t-color-light-blue);
}

.light-blue-badge {
  font-size: 12px;
  line-height: 16px;
  border-radius: 4px;
  letter-spacing: 1px;
  margin: 2px 2px;
  padding: 2px 4px;
  background: transparent;
  color: var(--t-color-light-blue);
  cursor: default !important;
}
</style>

<script>
import pagination from "./elements/pagination";

export default {
  name: "listervue",
  props: {
    datacatalogs: { type: Array },
  },
  components: {
    "t-pagination": pagination,
  },
  data() {
    return {
      status: "yes",
      keyresults: [],
      somekw: [
        {
          keyword: "",
          items: "",
        },
      ],
      kwText: "",
      nodes: [],
      links: [],
      viewer: false,
      lister: true,
      clamped: false,
      citations: null,
      toDisplay: [],
      showPagination: false,
    };
  },
  watch: {
    datacatalogs: {
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
    switchDB(val) {
      let self = this;
      const dbs = this.datacatalogs.map((x) => x.name);
      const position = dbs.indexOf(val.name);
      if (self.datacatalogs[position]["show"] === "yes") {
        self.datacatalogs[position]["show"] = "no";
      } else {
        self.datacatalogs[position]["show"] = "yes";
      }
      self.datacatalogs.sort(function (a, b) {
        return -a["show"].localeCompare(b["show"]);
      });
      this.$emit("datacatalogs", self.datacatalogs);
    },
    selOne(val) {
      let self = this;
      const dbs = this.datacatalogs.map((x) => x.name);
      const position = dbs.indexOf(val.name);
      self.datacatalogs.map(function (x) {
        x["show"] = "no";
        return x;
      });
      self.datacatalogs[position]["show"] = "yes";

      self.datacatalogs.sort(function (a, b) {
        return -a["show"].localeCompare(b["show"]);
      });
      this.$emit("datacatalogs", self.datacatalogs);
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
    toggleExcerpt(index) {
      let self = this;
      self.datacatalogs[index]["showExcerpt"] = !self.datacatalogs[index]["showExcerpt"];
      this.$forceUpdate();
    },
    updateToDisplay(data) {
      this.toDisplay = data;
    },
  },
};
</script>

<!--
Template for the search elements
-->
<template>
  <div class="searchType">
    <b-container>
      <b-row>
        <b-col>
          <h3>Search By</h3>
          <div>
            <b-button-group>
              <b-button
                v-for="(btn, idx) in searchType"
                :key="idx"
                :pressed.sync="btn.state"
                variant="outline-primary"
                v-on:click="searchClick(btn)"
              >
                {{ btn.caption }}
              </b-button>
            </b-button-group>
          </div>
        </b-col>
        <!-- <b-col class="text-right">
          <h3>Search For</h3>
          <div>
            <b-button-group>
              <b-button
                v-for="(btn, idx) in returnType"
                :key="idx"
                :pressed.sync="btn.state"
                variant="outline-primary"
                v-on:click="$emit('changeReturn', returnType)"
              >
                {{ btn.caption }}
              </b-button>
            </b-button-group>
          </div>
        </b-col> -->
      </b-row>
    </b-container>
  </div>
</template>
<script>
export default {
  name: "searchTypes",
  data() {
    return {
      searchType: [
        { caption: "Keywords", state: true },
        { caption: "Text", state: false },
      ],
      returnType: [
        { caption: "Databases", state: true },
        { caption: "Code Repositories", state: false },
      ],
      searchOut: [],
      returnOut: [],
      btn: [],
    };
  },
  methods: {
    searchClick: function (btn) {
      this.btn = btn;
      for (var i = 0; i < this.searchType.length; i++) {
        if (this.searchType[i]["caption"] !== btn.caption) {
          this.searchType[i].state = !this.searchType[i].state;
        }
      }
      this.$emit("changeSearch", this.searchType);
    },
  },
};
</script>

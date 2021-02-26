<!--
Template for the search elements
-->
<template>
<div>
  <b-container>
    <b-row>
      <b-col>
      <h3>Search By:</h3>
      <div>
        <b-button-group>
          <b-button v-for="(btn, idx) in searchType" :key="idx"
                    :pressed.sync="btn.state"
                    variant="outline-primary"
                    @clicked="onClickSearch()">
            {{ btn.caption }}
          </b-button>
        </b-button-group>
      </div>
    </b-col>
    <b-col class="text-right">
      <h3>Returning:</h3>
      <div>
        <b-button-group>
          <b-button v-for="(btn, idx) in returnType" :key="idx"
                    :pressed.sync="btn.state"
                    variant="outline-primary"
                    @clicked="onClickReturn(idx)">
          {{ btn.caption }}
        </b-button>
        </b-button-group>
      </div>
    </b-col>
    </b-row>
  </b-container>
</div>
</template>
<script>
export default {
  name: "keywordSearch",
  data() {
    return {
      searchType: [
        {caption: 'Keywords', state: true },
        {caption: 'Subject', state: true },
        {caption: 'Text', state: false }
      ],
      returnType: [
        {caption: 'Databases', state: true },
        {caption: 'Code Repos', state: false }
      ]
    }
  },
  methods: {
    onClickSearch (event) {
      this.$emit('searchSet', searchType)
    },
    onClickReturn (idx) {
      this.$emit('returnSet', returnType)
    }
  }
}
</script>

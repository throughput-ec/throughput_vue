<template>
  <div>
    <b-container fluid style="padding-top:15px">
      <b-form-row align-v="stretch" align-h="center">
        <b-col align-self="center">
          <b-form-checkbox
            id="checkboxreadme"
            v-model="properties.readme"
            name="checkboxreadme"
            value="yes"
            unchecked-value="no"
            v-b-tooltip.hover
            title="Filter all repositories without a README file."
            v-on:change="$emit('filterprops', properties)"
          >
            <label style="color: var(--t-color-light-blue)"
              >Repo has README</label
            >
          </b-form-checkbox>
        </b-col>
        <b-col align-self="center">
          <b-form-checkbox
            id="checkboxlicense"
            v-model="properties.license"
            name="checkboxlicense"
            value="yes"
            unchecked-value="no"
            v-b-tooltip.hover
            title="Filter all repositories without a LICENSE."
            v-on:change="$emit('filterprops', properties)"
          >
            <label style="color: var(--t-color-light-blue)"
              >Repo has LICENSE</label
            >
          </b-form-checkbox>
        </b-col>
        <b-col align-self="center">
          <b-form-spinbutton id="sb-recent" min="1" max="60">
          </b-form-spinbutton>
          <label for="sb-recent" style="color: var(--t-color-light-blue)"
            >Most recent commit (months)</label
          >
        </b-col>
      </b-form-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "repofilters",
  data() {
    return {
      properties: {
        readme: "no",
        license: "",
        recentactivity: 365,
        owner: "",
        topics: "",
        contributors: 1,
      },
    };
  },
};
</script>

<template>
  <div>
    <b-container fluid style="padding-top:15px">
      <b-form-row>
        <b-col>
          <b-form-checkbox
            id="checkboxreadme"
            v-model="properties.readme"
            name="checkboxreadme"
            value="yes"
            unchecked-value="no"
            v-on:change="$emit('filterprops', properties)"
          >
            <label
              v-b-tooltip.hover
              title="Filter all repositories without a README file."
            >Repo has README</label>
          </b-form-checkbox>
          <b-form-checkbox
            id="checkboxlicense"
            v-model="properties.license"
            name="checkboxlicense"
            value="yes"
            unchecked-value="no"
            v-on:change="$emit('filterprops', properties)"
            >
            <label
              v-b-tooltip.hover
              title="Filter all repositories without a LICENSE."
            >Repo has LICENSE</label>
          </b-form-checkbox>
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

<template>
  <div>
    <b-container class="bv-example-row">
      <b-button-toolbar aria-label="Website navigation bar">
        <b-button-group>
          <b-button class="mx-2">Metrics</b-button>
        </b-button-group>
        <b-button-group>
          <b-button>Metrics</b-button>
          <b-button>Search</b-button>
          <b-button>Metrics</b-button>
        </b-button-group>
      </b-button-toolbar>
    </b-container>
  </div>
</template>

<script>

export default {
  name: "opener",
  data() {
    return {
      loading: false,
      options: ["Status", "Searches", "Something"]
    };
  }
};
</script>

<template>
  <div>
    <div v-if="type == 'A'">
      Returning {{ counters.ccdrs }} data catalogs.<br />
    </div>
    <div v-else>Returning {{ counters.code }} code repositories.</div>
  </div>
</template>

<script>
import "../../assets/containers.css";
export default {
  name: "repoCounter",
  props: {
    counters: Object,
    type: String
  }
};
</script>

<template>
  <div :class="location" style="height: 80vh">
    <b-spinner
      label="Loading..."
      style="width: 4rem; height: 4rem"
      variant="primary"
    />
  </div>
</template>

<script>
export default {
  name: "loadingWheel",
  props: ["location"],
};
</script>

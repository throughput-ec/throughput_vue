<template>
  <!--       Input box section    -->
  <b-container>
    <b-input-group :prepend="this.term" class="mt-3">
      <b-form-input
        type="text"
        v-model="kwinput"
        v-on:keyup="$emit('change', kwinput)"
      ></b-form-input>
    </b-input-group>
  </b-container>
</template>

<script>
export default {
  props: ["term"],
  data: () => ({ kwinput: "" }),
};
</script>

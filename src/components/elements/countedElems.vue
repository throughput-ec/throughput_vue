<template>
  <div>
    <div v-if="type == 'A'">
      <b-button variant="primary">
        Linked Code <b-badge variant="light">{{ counter }}</b-badge>
      </b-button>
    </div>
    <div v-else>
      <b-button variant="alert">
        Linked DBs <b-badge variant="light">{{ counter }}</b-badge>
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "counters",
  props: {
    counter: Number,
    type: String,
  },
  data() {
    return {
      msg: "Orcid description",
    };
  },
};
</script>

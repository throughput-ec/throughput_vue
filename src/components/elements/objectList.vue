<template>
  <div>
    <div v-for="items in repos" v-bind:key="items.name">
      <b-card :title="items.name" style="max-width: 100%" class="mb-2">
        <b-card-text>
          <div>
            {{ items.description }}
          </div>
          <small
            >url: <a :href="items.url">{{ items.url }}</a></small
          ><br />
          <countElem :counter="items.repos" :type="type"></countElem>
        </b-card-text>
      </b-card>
    </div>
  </div>
</template>

<script>
import counters from "../../components/elements/countedElems.vue";
export default {
  name: "objectList",
  props: {
    repos: Array,
    type: String,
  },
  components: {
    countElem: counters,
  },
};
</script>

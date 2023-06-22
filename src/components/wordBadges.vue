<!-- This is called from the keyword search. -->
<!-- The goal is to have it all run smoothly, passing in a short list of keywords 
     whether positive or negative, and returning a keyword name if the kw is to 
     be dropped. 
     This would allow us to keep the full KW list in the parent component, and only
     have a short list of keywords in this component. -->

<template>
  <div>
    <b-container style="padding-top: 5px">
      <!-- Text to explain the available search. -->
      <div v-if="(badgein.length > 0) & (show === true)">
        <small>
          <h3>{{ this.title }}</h3>
          The top {{ Math.min(30, badgein.length) }} of
          {{ badgein.length }} available keywords are shown. Click on one of the
          words to add it to your search set.<br /><strong
            >The number beside each keyword indicates how frequently the term
            appears in the Throughput Database.</strong
          >
        </small>
      </div>
      <div v-if="(badgein.length > 0) & (show === false)">
        <h3>{{ this.title }}</h3>
        <small>
          Click a term below to remove it from the selected terms.
        </small>
      </div>

      <!-- Badges for selected terms -->
      <div v-if="badgein.length > 0" class="keyword-container">
        <div v-for="index in Math.min(30, badgein.length)" :key="index">
          <div
          class="keyword-badge"
          v-bind:class="{ 'selected-keyword-badge': !show }"
          v-on:click="$emit('termOut', badgein[index - 1].term)"
          >
            <!-- Clicking one of these span elements turns the show parameter
                 on or off.  That happens in "keyword_search"-->
            <span class="inner-badge">{{ badgein[index - 1].count }}</span>
            <span>{{ badgein[index - 1].term }}</span>
          </div>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "wordBadgeSelect",
  props: ["badgein", "title", "show"],
};
</script>

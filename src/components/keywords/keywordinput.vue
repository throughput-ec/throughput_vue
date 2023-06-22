<template>
  <!--       Input box section    -->
  <b-container>
    <b-input-group :prepend="this.term" class="mt-3">
      <b-form-input
        type="text"
        v-model="kwinput"
        v-on:keyup="$emit('change', kwinput)"
      ></b-form-input>

      <!-- <b-input-group-append>
        <b-button @click="$bvModal.show('keyword-search-info-modal')"
          >Info</b-button
        >
        <b-modal id="keyword-search-info-modal" hide-footer hide-header>
          <div style="padding: 20px">
            <p>
              <strong>Keyword search</strong>: Begin typing keywords. As you
              limit the potential set of keywords a set of options will appear
              in blue below. Click on a term to add it to your search set. Click
              on it again to remove it from the search set.
            </p>
            <div class="flex">
              <button
                class="blue-button"
                @click="$bvModal.hide('keyword-search-info-modal')"
              >
                OK
              </button>
            </div>
          </div>
        </b-modal>
      </b-input-group-append> -->
    </b-input-group>
  </b-container>
</template>

<script>
export default {
  props: ["term"],
  data: () => ({ kwinput: "" }),
};
</script>

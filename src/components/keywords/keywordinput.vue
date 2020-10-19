<template>
  <div>
    <!--       Input box section    -->
    <b-container>
      <b-input-group prepend="Keyword" class="mt-3">
        <b-form-input type="text" v-model="kwinput" v-on:keyup="$emit('change', kwinput)"></b-form-input>

        <b-input-group-append>
          <b-button v-b-modal.modal-1>Info</b-button>
          <b-modal id="modal-1">
            <strong>Keyword search</strong>: Begin typing keywords. As you limit
                                           the potential set of keywords a set of options will appear in blue
                                           below. Click on a term to add it to your search set. Click on it
                                           again to remove it from the search set.
          </b-modal>
        </b-input-group-append>

      </b-input-group>
    </b-container>
  </div>
</template>

<script>
  export default {
    data: () => ({ kwinput: "" }),
  };
</script>

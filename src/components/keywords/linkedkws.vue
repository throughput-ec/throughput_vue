<template>
  <b-card title="Linked terms:">
    <small>These keywords are associated with a database that shares a linked code repository.</small>
    <div v-if="kwin.length > 0">
      <div
        v-if="kwin.length > 0"
        style="max-height: 200px; overflow-y: scroll; width: 100%;"
      >
        <span
          v-for="(item, index) in keylinked"
          v-bind:key="index"
          v-on:click="addkw(item.keywords)"
        >
          <span style="margin-right: 2px;margin-bottom: 2px;font-size:14px;">
            <b-badge variant="danger"
              >{{ item.keywords }}
              <b-badge variant="light">{{ item.count }}</b-badge>
            </b-badge>
        </span>
    </span>
  </div>
    </div>
    <div v-else>
      <small
        >Click to find databases that match the selected combinations.</small
      >
    </div>
  </b-card>
</template>

<script>
export default {
  name: "linkedkws",
  props: ["kwin"],
  data: () => ({
    keylinked: []
  }),
  watch: {
    kwin: {
      handler(val) {
        let self = this;
        let inp = val.join(",");
        fetch(
          "http://" +
            process.env.VUE_APP_URLPATH +
            "/api/keyword/dbs/linked?keywords=" +
            inp
        )
          .then(function(response) {
            return response.json();
          })
          .then(data => {
            self.keylinked = data.data.filter(x => !val.includes(x.keywords));
          });
      }
    }
  },
  methods: {
    addkw(val) {
      return this.kwin.push(val);
    }
  }
};
</script>

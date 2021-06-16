<!-- This modal needs to pull information for a repository 
     including all databases it is associated with. 
     It should pull in information about the repository, and list the databases. 
-->
<template>
  <div>
    <div v-if="this.orcid !== ''">
      <b-button v-b-modal.modal-1 class="w-100" variant="success"
        >Link New Repository</b-button
      >
      <b-modal id="modal-1" title="Modifying Repositories" @ok="onClick">
        Thank you {{ this.orcid.given_name }} for helping us modify or add
        records!
        <b-form-group>
          GitHub Repository
          <b-input-group class="w-100">
            <b-form-input
              list="input-list"
              v-model="textQuery"
              id="input-with-list"
              aria-describedby="input-live-help input-live-feedback"
              :state="this.button.variant == 'success'"
              :disabled="this.button.variant == 'success'"
            ></b-form-input>
            <b-input-group-append
              ><b-button :variant="this.button.variant" @click="repoCheck">{{
                button.text
              }}</b-button></b-input-group-append
            >
            <b-form-invalid-feedback id="input-live-feedback">
              Click "Check" to ensure repository name validity.
            </b-form-invalid-feedback>
            <b-form-text id="input-live-help"
              >A Github Repository (form User/Repo)</b-form-text
            >
            <b-form-datalist
              id="input-list"
              :options="reponames"
            ></b-form-datalist>
          </b-input-group>
          Database
          <b-form-input
            list="dbName-list"
            id="dbName"
            v-model="dbQuery"
            aria-describedby="input-dblive-help input-dblive-feedback"
            :state="dbnames.includes(this.dbQuery)"
          ></b-form-input>
          <b-form-invalid-feedback id="input-dblive-feedback">
            Enter the full database name.
          </b-form-invalid-feedback>
          <b-form-text id="input-dblive-help"
            >A Database Registered within Throughput.</b-form-text
          >
          <b-form-datalist
            id="dbName-list"
            :options="dbnames"
          ></b-form-datalist>
          Repository Purpose
          <b-form-input
            list="repClass-test"
            id="repClass"
            v-model="reason"
          ></b-form-input>
          <b-form-datalist
            id="repClass-test"
            :options="purpose"
          ></b-form-datalist>
          Free-text notes
          <b-form-textarea v-model="freeForm"></b-form-textarea>
        </b-form-group>
      </b-modal>
    </div>
  </div>
</template>
<script>
import jwt_decode from "jwt-decode";

export default {
  name: "updateRepo",
  components: {},
  data: () => ({
    textQuery: "",
    dbQuery: "",
    button: { variant: "primary", text: "Check" },
    dbButton: { variant: "primary", text: "Check" },
    reason: "",
    reponames: [],
    freeForm: "",
    dbnames: [],
    reporesult: [],
    orcid: "",
    purpose: [
      "Don't Know",
      "Educational",
      "Analysis",
      "Software Development",
      "Storage",
      "Misc - Scraping",
      "Misc - Articles",
      "Misc - Informational",
    ],
    modalOut: [],
  }),
  mounted() {
    this.orcid = jwt_decode(this.$cookies.get("orcidId").id_token);
  },
  setup() {},
  methods: {
    onClick() {
      let self = this;
      // Validate object:
      var objectSend = {
        orcid: self.orcid.sub,
        db: self.dbQuery,
        repo: self.textQuery,
        repoPurp: self.orcid,
        annotationBody: self.freeForm,
      };
      this.modalOut = objectSend;
    },
    repoCheck: function () {
      let self = this;

      if (self.button.variant === "success") {
        this.button = { variant: "primary", text: "Check" };
        this.textQuery = "";
      } else {
        var testres = fetch(`https://api.github.com/repos/${self.textQuery}`, {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        })
          .then(function (response) {
            return response.json();
          })
          .then((data) => {
            this.reporesult = data;
            if (this.reporesult.message === undefined) {
              this.button["variant"] = "success";
              this.button.text = "matched (clear)";
            } else {
              this.button["variant"] = "warning";
              this.button.text = "no match";
            }
          });
      }
    },
  },
  watch: {
    textQuery: {
      handler(val) {
        var self = this;
        if (val.length > 3) {
          fetch(
            `${process.env.VUE_APP_URLPATH}/api/repos/name?name=${this.textQuery}`
          )
            .then((data) => {
              return data.json();
            })
            .then((data) => (self.reponames = data.data.data.names));
        }
      },
    },
    dbQuery: {
      handler(val) {
        var self = this;
        if (val.length > 3) {
          fetch(
            `${process.env.VUE_APP_URLPATH}/api/ccdr/name?name=${this.dbQuery}`
          )
            .then((data) => {
              return data.json();
            })
            .then((data) => (self.dbnames = data.data.data.names));
        }
      },
    },
  },
};
</script>

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
      <b-modal id="added-1" title="Annotation Added" ok-only>
        You've added a record to the graph!
      </b-modal>
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
              aria-describedby="input-live-feedback"
              :state="this.button.variant == 'success'"
              :disabled="this.button.variant == 'success'"
              placeholder="A Github Repository (form User/Repo)"
            ></b-form-input>
            <b-input-group-append
              ><b-button :variant="this.button.variant" @click="repoCheck">{{
                button.text
              }}</b-button></b-input-group-append
            >
            <b-form-invalid-feedback id="input-live-feedback">
              Click "Check" to ensure repository name validity.
            </b-form-invalid-feedback>
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
            placeholder="A Database Registered within Throughput."
          ></b-form-input>
          <b-form-invalid-feedback id="input-dblive-feedback">
            Enter the full database name.
          </b-form-invalid-feedback>
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
var jwt = require("jsonwebtoken");

export default {
  name: "updateRepo",
  components: {},
  data: () => ({
    textQuery: "",
    dbQuery: "",
    button: { variant: "primary", text: "Check" },
    validForm: { repo: false, db: false },
    reason: "",
    reponames: [],
    freeForm: "",
    secret: "",
    dbnames: [],
    reporesult: [],
    orcid: "",
    tester: false,
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
    this.orcid = jwt.decode(this.$cookies.get("orcidId").id_token);
  },
  setup() {},
  created() {
    this.secret = process.env.VUE_APP_APISECRET;
  },
  methods: {
    formValidation() {
      if (this.dbnames.includes(this.dbQuery)) {
        this.validForm.db = true;
      }
      return Object.values(this.validForm).every((x) => x);
    },
    onClick(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.checkSubmit();
      this.loader = true;
      fetch(
        `${process.env.VUE_APP_URLPATH}/api/throughputvue?token=${this.modalOut}`
      ).then((x) => {
        this.$bvModal.show("added-1");
        this.loader = false;
      });
      this.$nextTick(() => {
        this.$bvModal.hide("modal-1");
      });
    },
    checkSubmit() {
      let self = this;
      var works = this.formValidation();
      if (!works) {
        return;
      }
      // Validate object:
      var objectSend = {
        orcid: self.orcid.sub,
        orcidname: self.orcid.name,
        db: self.dbQuery,
        repo: self.reporesult,
        repoPurp: self.reason,
        annotationBody: self.freeForm,
      };
      this.modalOut = jwt.sign(objectSend, this.secret);
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
              this.validForm.repo = true;
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
        if (val.length > 2) {
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
        if (val.length > 2) {
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

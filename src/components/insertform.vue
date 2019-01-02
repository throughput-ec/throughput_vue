this.description<template>
  <div class="annotations">
    <div class="addannot">
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <h2>Target URL</h2>
        <div class="input-group mb-3">
          <b-form-input id="orcidInput"
                        type="text"
                        v-model="form.orcid"
                        required
                        placeholder="Enter ORCID."
                        class="form-control"
                        aria-label="Enter valid ORCID."
                        aria-describedby="basic-addon2" />
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" v-on:click="fetchmeta(form.url)">Check ORCID</button>
          </div>
        </div>

        <div class="input-group mb-3">
          <b-form-input id="urlInput"
                        type="url"
                        v-model="form.url"
                        required
                        placeholder="Enter URL or identifier."
                        class="form-control"
                        aria-label="Enter URL or identifier."
                        aria-describedby="basic-addon2" />
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" v-on:click="fetchmeta(form.url)">Check URL</button>
          </div>
        </div>

        <div v-if="this.metadata.title !== '' & this.metadata.title !== undefined">
          <b-alert variant="info" show>
            <p><strong>Title</strong>: {{ this.metadata.title }}</p>
            <p><strong>Description</strong>: {{ this.metadata.description }}</p>
          </b-alert>
        </div>
        <div v-if="this.metadata.title === undefined">
          <b-alert variant="warning" show>
            URL resource has no defined metadata - may redirect to another resource.
          </b-alert>
        </div>

        <h2>Target Description</h2>
        <div class="input-group mb-3">
          <b-form-input id="descriptionInput"
                        type="text"
                        v-model="form.description"
                        required
                        placeholder="Describe the purpose of the resource."
                        aria-label="Describe the purpose of the resource."
                        aria-describedby="basic-addon2" />
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" v-on:click="setValues()">Compose</button>
          </div>
        </div>

        <div class="descripcard" v-if="this.description !== ''">
          <strong>url</strong>: {{ this.url }}<br>
          <strong>Description</strong>: {{ this.description }}
        </div>

        <h2>Keywords</h2>
        <b-form-group id="exampleInputGroup3"
                      label-for="exampleInput3">
          <b-form-input id="exampleInput3"
                        type="text"
                        required
                        placeholder="Add keywords"
                        v-model="form.keyword">
          </b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </div>
    <div class="annotgraph">
      This bit.
    </div>
  </div>
</template>

<script src="page-metadata-parser.bundle.js" type="text/javascript" />

<script>

  export default {
    data () {
      return {
        form: {
          orcid: '',
          url: '',
          description: '',
          keyword: ''
        },
        show: true,
        metadata: { 'title': '', 'description': '' },
        url: '',
        description: '',
        orcid: '',
        graph: null
      }
    },
    methods: {
      setValues: function() {
        this.url = this.form.url;
        this.description = this.form.description;
      },
      fetchmeta: function (url) {

        var ogs = require('open-graph-scraper');
        var options = {'url': 'https://cors-anywhere.herokuapp.com/' + url };

        var result = ogs(options)
            .then(function (result) {
              return { 'title': result.data.ogTitle,
                       'description': result.data.ogDescription };
                     })
            .catch(function (error) {
              console.log('error:', error);
              return null;
            }).
            then(x =>  {
              this.metadata = x
              });
      },
      onSubmit: function (evt) {
        evt.preventDefault();
        console.log('fires')
        var url = 'http://localhost:3000/datanote/?body=' + this.form.description +
                  '&url=' + JSON.stringify(this.form.url) +
                  '&person=' + this.form.orcid;
        console.log(url);

        fetch(url, {
          method: "POST", mode: "cors"} )
          .then(response => {
            response;
          });
      },
      onReset (evt) {
        evt.preventDefault();
        /* Reset our form values */
        this.form.url = '';
        this.form.description = '';
        this.form.keyword = null;
        /* Trick to reset/clear native browser form validation state */
        this.show = false;
        this.$nextTick(() => { this.show = true });
      },
    }
  }
</script>

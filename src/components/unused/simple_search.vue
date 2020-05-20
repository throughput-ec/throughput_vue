<template>
  <div>
    <b-card title="Get Started Searching" img-top tag="article" style="max-width: 100%;" class="mb-2">
      <b-card-text>
        Enter either a repository keyword or the name of a data repository to find
        examples of the data in use!
      </b-card-text>
      <div>
        <b-form-group label="Search Resource">
          <b-form-radio v-model="selected" name="some-radios" value="A">Data Catalog</b-form-radio>
          <b-form-radio v-model="selected" name="some-radios" value="B">Code Repository</b-form-radio>
        </b-form-group>
      </div>

      <b-form inline @submit="onSubmit" @reset="onReset" v-if="show">
        <label class="sr-only" for="inline-form-input-name">Repository Name</label>
        <b-input v-model="form.name" id="inline-form-input-name" class="mb-2 mr-sm-2 mb-sm-0" placeholder="Repository Name"></b-input>

        <label class="sr-only" for="inline-form-input-username">Subject/keyword</label>
        <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
          <b-input id="inline-form-input-keyword" v-model="form.keyword" placeholder="Keyword"></b-input>
        </b-input-group>

        <label class="sr-only" for="inline-form-input-limits">Return Limit</label>
        <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
          <b-form-select id="inline-form-input-limit" v-model="form.limit" :options=limit></b-form-select>
        </b-input-group>

        <div v-if="!loading">
          <b-button type="submit" variant="primary">
            Submit
          </b-button>
        </div>
        <div v-if="loading">
          <b-button type="submit" variant="primary">
            <b-spinner small label="Spinning"></b-spinner>
          </b-button>
        </div>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-card>

    <repoCounter :counters="reposum" :type="selected" />

    <objectList :type="selected" :repos="this.repos"></objectList>

  </div>
</template>

<script>
import '../assets/containers.css'
import repoCounter from '../components/elements/repoCounter.vue'
import objectList from '../components/elements/objectList.vue'

export default {
  name: 'opener',
  data() {
    return {
      loading: false,
      form: {
        name: '',
        keyword: '',
        subject: '',
        limit: 15
      },
      limit: [5, 10, 15, 30],
      repos: null,
      selected: "A",
      reposum: {
        ccdrs: 'no return',
        code: 'no return'
      },
      show: true
    }
  },
  methods: {
    onSubmit(evt) {
      this.loading = true;
      this.reposum = {
        ccdrs: 'waiting',
        code: 'waiting'
      }

      evt.preventDefault()
      let self = this
      if (self.selected == "A") {
        var urlbase = 'http://localhost:3000/api/ccdr?'
      } else {
        urlbase = 'http://localhost:3000/api/repo?'
      }

      fetch(urlbase +
          'name=' + self.form.name +
          '&keyword=' + self.form.keyword +
          '&subject=' + self.form.subject +
          '&limit=' + self.form.limit)
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          /* Modifying the values and processing the inputs */
          if (self.selected == 'A') {
            self.repos = data.data.ccdrs
          } else {
            self.repos = data.data.repositories
          }

        })
        .then(() => {
          self.loading = false;
        })
    },
    onReset(evt) {
      evt.preventDefault()
      // Reset our form values
      this.form.name = ''
      this.form.keyword = ''
      this.repos = null
      this.reposum = {
        ccdrs: 0,
        code: 0
      }
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  },
  components: {
    'repoCounter': repoCounter,
    'objectList': objectList
  }
}
</script>

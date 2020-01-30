<template>
  <div>
    <b-card
        title="Get Started Searching"
        img-top
        tag="article"
        style="max-width: 100%;"
        class="mb-2"
      >
      <b-card-text>
        Enter either a repository keyword or the name of a data repository to find
        examples of the data in use!
      </b-card-text>

      <b-form inline @submit="onSubmit" @reset="onReset" v-if="show">
        <label
          class="sr-only"
          for="inline-form-input-name">Repository Name</label>
        <b-input
          v-model="form.name"
          id="inline-form-input-name"
          class="mb-2 mr-sm-2 mb-sm-0"
          placeholder="Repository Name"
        ></b-input>

        <label
          class="sr-only"
          for="inline-form-input-username">Subject/keyword</label>
        <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
          <b-input
            id="inline-form-input-keyword"
            v-model="form.keyword"
            placeholder="Keyword"></b-input>
        </b-input-group>

        <label
          class="sr-only"
          for="inline-form-input-limits">Return Limit</label>
        <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
          <b-form-select
            id="inline-form-input-limit"
            v-model="form.limit"
            :options=limit></b-form-select>
        </b-input-group>


        <b-button type="submit" variant="primary">Submit</b-button>
        .
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-card>

    <div v-for="items in this.repos">
      <b-card
        :title="items.name"
        tag="repository"
        style="max-width: 100%;"
        class="mb-2">
        <b-card-text>
          <b-container>
            <b-row  align-v="center">
              <b-col class="text-center">
                Linked Code<br>
                <b>{{items.repos.length}}</b>
              </b-col>
              <b-col cols=11>
                <div>
                  {{items.description}}
                </div>
                <small>url: <a :href="items.url">{{items.url}}</a></small>
<br>
                <b-button v-b-toggle.collapse-1 variant="primary">Show Code</b-button>
                <b-collapse id="collapse-1" class="mt-2">
                  <div v-for="ghrepo in items.repos">
                    <b-card
                      :title="ghrepo.name">
                      <div>{{ghrepo.description}}</div>
                      <small>url: <a :href="ghrepo.url">{{ghrepo.url}}</a></small>
                    </b-card>
                  </div>
                </b-collapse>
              </b-col>
            </b-row>
          </b-container>
        </b-card-text>
      </b-card>
    </div>
  </div>
</template>

<script>
  import '../assets/containers.css'

  export default {
    name: 'opener',
    data() {
      return {
        form: {
          name: '',
          keyword: '',
          subject: '',
          limit: 15
        },
        limit: [5,10,15,30],
        repos: null,
        show: true
      }
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault()
        let self = this

        fetch('http://localhost:3000/ccdr?' +
              'name=' + self.form.name +
              '&keyword=' + self.form.keyword +
              '&subject=' + self.form.subject +
              '&limit=' + self.form.limit)
          .then((response) => { return response.json() })
          .then((data) => {
            /* Modifying the values and processing the inputs */
            self.repos = data.data.ccdrs
          })

      },
      onReset(evt) {
        evt.preventDefault()
        // Reset our form values
        this.form.name = ''
        this.form.keyword = ''
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
  }
</script>

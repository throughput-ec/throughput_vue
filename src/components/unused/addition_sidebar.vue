<template>
  <div class="addannot">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <h2>Link your ORCID</h2>
      <button
        class="btn btn-outline-secondary"
        style="background-color:#A6CE39; width:80%;"
        type="button"
        v-on:click="checkorcid(form.orcid)"
        title="Link to your ORCID account"
      >
        <img
          src="@/assets/vector_iD_icon.svg"
          width="20px;"
          style="float:left;"
        />
        <strong>ORCID</strong>
      </button>
      <app-orcid></app-orcid>
      <div>
        <div style="padding-top:15px;">
          <h2 class="headerwbutton">Target URL</h2>
          <button
            class="btn btn-outline-secondary buttonhead"
            type="button"
            v-on:click="drop_url()"
            title="Add space for an additional URL"
          >
            -
          </button>
          <button
            class="btn btn-outline-secondary buttonhead"
            type="button"
            v-on:click="add_url()"
            title="Remove the last URL"
          >
            +
          </button>
        </div>
        <div v-for="(urls, index) in form.url" v-bind:key="index">
          <div class="input-group mb-3">
            <b-form-input
              id="'urls'+index"
              type="text"
              v-model="form.url[index]"
              required
              placeholder="Enter URL or identifier."
              class="form-control"
              aria-label="Enter URL or identifier."
              aria-describedby="basic-addon2"
            />
            <div class="input-group-append">
              <button
                class="btn btn-outline-secondary"
                type="button"
                v-on:click="fetchmeta(form.url[index])"
                title="Find additional metadata and existing links"
              >
                Check
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="
            (this.metadata.title !== '') & (this.metadata.title !== undefined)
          "
        >
          <b-alert
            variant="info"
            dismissible
            :show="showDismissibleAlert"
            @dismissed="showDismissibleAlert = false"
          >
            <p><strong>Title</strong>: {{ this.metadata.title }}</p>
            <p><strong>Description</strong>: {{ this.metadata.description }}</p>
            <b-btn v-b-modal.metainfo>Show full metadata</b-btn>

            <b-modal id="metainfo" title="Website OpenGraph Data" ok-only>
              <pre style="white-space: pre-wrap; ">{{
                this.metadata.data
              }}</pre>
            </b-modal>
          </b-alert>
        </div>
        <div v-if="this.metadata.title === undefined">
          <b-alert variant="warning" show>
            URL resource has no defined metadata - may redirect to another
            resource.
          </b-alert>
        </div>

        <h2>Target Description</h2>
        <div class="input-group mb-3">
          <b-form-textarea
            id="descriptionInput"
            type="text"
            v-model="form.description"
            required
            placeholder="Describe the purpose of the resource(s)."
            rows="3"
            max-rows="6"
            aria-label="Describe the purpose of the resource (free text)."
            aria-describedby="basic-addon2"
          />
        </div>

        <div class="descripcard" v-if="this.description !== ''">
          <strong>url</strong>: {{ this.url }}<br />
          <strong>Description</strong>: {{ this.description }}
        </div>

        <h2>Keywords</h2>
        <b-form-group id="exampleInputGroup3" label-for="exampleInput3">
          <b-form-input
            id="exampleInput3"
            type="text"
            required
            placeholder="Add keywords"
            v-model="form.keyword"
          >
          </b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </div>
    </b-form>
  </div>
</template>

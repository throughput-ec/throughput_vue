<template>
  <div class="annotations">
    <div class="addannot">
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <h2>User ORCID</h2>
        <div class="input-group mb-3">
          <b-form-input id="orcidInput"
                        type="text"
                        v-model="form.orcid"
                        required
                        :placeholder="this.orcid"
                        class="form-control"
                        aria-label="Enter valid ORCID."
                        aria-describedby="basic-addon2" />
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" v-on:click="checkorcid(form.orcid)">Validate ORCID</button>
          </div>
        </div>
        <h2>Target URL</h2>
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
            <b-btn v-b-modal.metainfo>Show full metadata</b-btn>

            <b-modal id="metainfo" title="Website OpenGraph Data" ok-only >
              <pre style="white-space: pre-wrap; ">{{ this.metadata.data }}</pre>
            </b-modal>

          </b-alert>
        </div>
        <div v-if="this.metadata.title === undefined">
          <b-alert variant="warning" show>
            URL resource has no defined metadata - may redirect to another resource.
          </b-alert>
        </div>

        <h2>Target Description</h2>
        <div class="input-group mb-3">
          <b-form-textarea id="descriptionInput"
                        type="text"
                        v-model="form.description"
                        required
                        placeholder="Describe the purpose of the resource."
                        rows="3"
                        max-rows="6"
                        aria-label="Describe the purpose of the resource (free text)."
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
      <svg id="svg" width="500">
        <g :id="links"></g>
        <g :id="nodes"></g>
      </svg>
    </div>
  </div>
</template>

<script src="page-metadata-parser.bundle.js" type="text/javascript" />

<script>
  import * as d3 from 'd3';

  export default {
    data () {
      return {
        form: {
          orcid: this.$cookies.get('orcid'),
          url: '',
          description: '',
          keyword: ''
        },
        data: null,
        line: '',
        show: true,
        metadata: { 'title': '', 'description': '' },
        url: '',
        description: '',
        orcid: this.$cookies.get('orcid'),
        simulation: null,
        graph: null,
        color: "#aa0000",
        settings: {
            strokeColor: "#29B5FF",
            width: "100%",
            svgWigth: 500,
            svgHeight: 500
        }
      }
    },
    created() {
      if (this.$route.query.code) {
        var orcid_auth = require('@/assets/orcid_secret.json');

        var options = {
          client_id: orcid_auth.id,
          client_secret: orcid_auth.secret,
          grant_type: "authorization_code",
          code: this.$route.query.code,
          redirect_uri: "http://throughputdb.com"
        }

        var url_options = Object.entries(options)
          .map(([key, val]) => `${key}=${val}`).join('&')

          console.log(url_options)

        fetch("https://sandbox.orcid.org/oauth/token", {
          body: url_options,
          mode: "no-cors",
          credentials: "include",
          headers: { Accept: "application/json",
                     "Content-Type": "application/x-www-form-urlencoded" },
                     method: "POST" })
          .then(response => console.log(response))
          .then(data => console.log(data))
          .catch(err => console.log(err))
      }
    },
    methods: {
      d3plot: function() {
        var that = this;
        var svg = d3.select("svg")

        this.simulation = d3.forceSimulation()
          .nodes(that.graph.nodes)
          .force("link", d3.forceLink(that.graph.links).distance(100).strength(0.1))
          .force("charge", d3.forceManyBody())
          .force("center", d3.forceCenter(that.settings.svgWigth / 2, that.settings.svgHeight / 2));
      },
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
                       'description': result.data.ogDescription,
                       'data': JSON.stringify(result.data, null, 2) };
                     })
            .catch(function (error) {
              console.log('error:', error);
              return null;
            })
            .then(x =>  {
              this.metadata = x
              });

        fetch('http://localhost:3000/query?search=' + url)
        .then((response) => { return response.json() })
        .then((data) => {
          var graph = data.data.records;

          var nodes = [];
          var links = [];

          var newNodes = graph.map(x => x._fields[0].segments.map(y => [y.start, y.end]) )

          newNodes
            .flat(2)
            .map(x => {
              if (nodes.length == 0) {
                nodes[0] = {
                  identity: x.identity.low,
                  label: x.labels[0],
                  properties: x.properties
                }
              }

              if (nodes.map(x => x.identity).indexOf(x.identity.low) == -1) {
                nodes.push({
                  identity: x.identity.low,
                  label: x.labels[0],
                  properties: x.properties
                })
              }

            })

          var addlinks = newNodes.flat().map(x => {

            links.push({source: nodes.map(y => y.identity).indexOf(x[0].identity.low),
                        target: nodes.map(y => y.identity).indexOf(x[1].identity.low)})
          })

          this.graph = {nodes: nodes, links: links};
          this.d3plot();
        })
        .catch(function (error) {
          console.log('error:', error);
          return null;
        });
      },
      checkorcid: function(orcid) {
        this.$cookies.set('orcid', orcid);
        this.$cookies.set("default_unit_second","input_value","0");

        var orcid_auth = require('@/assets/orcid_secret.json');

        var options = {client_id: orcid_auth.id,
          response_type:"code",
          scope:"/authenticate",
          redirect_uri:"http://throughputdb.com"}

        var url = "https://sandbox.orcid.org/oauth/authorize?"

        window.open(url + "client_id=" + options.client_id +
                    "&response_type=" + options.response_type +
                    "&scope=" + options.scope +
                    "&redirect_uri=" + options.redirect_uri, name="_blank");
      },
      onSubmit: function (evt) {
        evt.preventDefault();
        var url = 'http://localhost:3000/datanote/?body=' + this.form.description +
                  '&url=' + JSON.stringify(this.form.url) +
                  '&person=' + this.form.orcid;

        fetch(url, {
          method: "POST", mode: "cors"} )
          .then(response => {
            response;
            this.form.url = null;
            this.form.description = null;
            this.form.keyword = null;
          });

      },
      onReset (evt) {
        evt.preventDefault();
        /* Reset our form values */
        this.form.url = '';
        this.form.description = '';
        this.form.keyword = null;
        this.metadata = { 'title': '', 'description': '' };
        /* Trick to reset/clear native browser form validation state */
        this.show = false;
        this.$nextTick(() => { this.show = true });
      }
    },
    computed: {
      nodes: function () {
          var that = this;
          if (that.graph) {
              return d3.select("svg").append("g")
                  .attr("class", "nodes")
                  .selectAll("circle")
                  .data(that.graph.nodes)
                  .enter().append("circle")
                  .attr("r", 20)
                  .attr("fill", function (d ,i) {
                      return that.color;
                  })
                  .call(d3.drag()
                      .on("start", function dragstarted(d) {
                          if (!d3.event.active) that.simulation.alphaTarget(0.3).restart();
                          d.fx = d.x;
                          d.fy = d.y;
                      })
                      .on("drag", function dragged(d) {
                          d.fx = d3.event.x;
                          d.fy = d3.event.y;
                      })
                      .on("end", function dragended(d) {
                          if (!d3.event.active) that.simulation.alphaTarget(0);
                          d.fx = null;
                          d.fy = null;
                      }));
          }
      },
      links: function () {
          var that = this;
          if (that.graph) {
              return d3.select("svg").append("g")
                  .attr("class", "links")
                  .selectAll("line")
                  .data(that.graph.links)
                  .enter().append("line")
                  .attr("stroke-width", function (d) { return Math.sqrt(50); });
          }
      },
    },
    updated: function () {
        if (this.simulation) {
          var that = this;
          that.simulation.nodes(that.graph.nodes).on('tick', function ticked() {
              that.links
                  .attr("x1", function (d) { return d.source.x; })
                  .attr("y1", function (d) { return d.source.y; })
                  .attr("x2", function (d) { return d.target.x; })
                  .attr("y2", function (d) { return d.target.y; });

              that.nodes
                  .attr("cx", function (d) { return d.x; })
                  .attr("cy", function (d) { return d.y; });
          });
        }
      }
    }
</script>

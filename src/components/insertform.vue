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
          <b-form-invalid-feedback id="basic-addon2">
            This is a required field and must be at least 3 characters
          </b-form-invalid-feedback>
          <div class="input-group-append">
            <button class="btn btn-outline-secondary"
                    style = "background-color:#A6CE39"
                    type="button"
                    v-on:click="checkorcid(form.orcid)"
                    title="Link to your ORCID account">ORCID</button>
          </div>
        </div>
        <div>
          <h2 class="headerwbutton">Target URL</h2>
          <button class="btn btn-outline-secondary buttonhead"
                type="button"
                v-on:click="drop_url()"
                title="Add space for an additional URL">-</button>
          <button class="btn btn-outline-secondary buttonhead"
                type="button"
                v-on:click="add_url()"
                title="Remove the last URL">+</button>
        </div>
        <div v-for="(urls, index) in form.url">
          <div class="input-group mb-3">
            <b-form-input id="'urls'+index"
                          type="text"
                          v-model="form.url[index]"
                          required
                          placeholder="Enter URL or identifier."
                          class="form-control"
                          aria-label="Enter URL or identifier."
                          aria-describedby="basic-addon2" />
            <div class="input-group-append">
              <button class="btn btn-outline-secondary"
                      type="button"
                      v-on:click="fetchmeta(form.url[index])"
                      title="Find additional metadata and existing links">Check URL</button>
            </div>
          </div>
        </div>

        <div v-if="this.metadata.title !== '' &
                   this.metadata.title !== undefined">
          <b-alert variant="info"
                   dismissible
                   :show="showDismissibleAlert"
                   @dismissed="showDismissibleAlert=false">
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
                        placeholder="Describe the purpose of the resource(s)."
                        rows="3"
                        max-rows="6"
                        aria-label="Describe the purpose of the resource (free text)."
                        aria-describedby="basic-addon2" />
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
      <svg id="svg" width="100%" height="100%">
        <g :class="links"></g>
        <g :class="nodes"></g>
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
        showDismissibleAlert: false,
        form: {
          orcid: this.$cookies.get('orcid'),
          url: [''],
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
      var orcid_params = this.$route.hash
        .substring(1,this.$route.hash.length)
        .split("&")
        .map(x => x.split("="))
        .reduce(function(p, c) {
          p[c[0]] = c[1];
          return p; }, {})

      if (orcid_params.access_token) {
        console.log("Bearer " + orcid_params.access_token)

        fetch("https://sandbox.orcid.org/oauth/userinfo", {
          headers: { Accept: "application/json",
                     "Authorization": orcid_params.token_type + " " + orcid_params.access_token },
                     method: "GET" })
          .then((response) => { return response.json() })
          .then(data => {
            console.log(data)
            this.$cookies.set('orcid', data.sub);
            this.$cookies.set("default_unit_second","input_value","0");
            this.form.orcid = data.sub })
          .catch(err => console.log(err))
      }
    },
    methods: {
      d3plot: function() {
        var that = this;
        var svg = d3.select("svg")

        d3.select("#allLinks").remove()
        d3.select("#allNodes").remove()

        console.log(that.graph);

        this.simulation = d3.forceSimulation()
          .nodes(that.graph.nodes)
          .force("link", d3.forceLink().links(that.graph.links).distance(80))
          .force("charge", d3.forceManyBody().strength(-100))
          .force("center", d3.forceCenter(that.settings.svgWigth / 2, that.settings.svgHeight / 2));
      },
      setValues: function() {
        this.url = this.form.url;
        this.description = this.form.description;
      },
      add_url: function() {
        this.form.url.push('');
      },
      drop_url: function() {
        if (this.form.url.length > 1) {
          this.form.url.pop();
        }
      },
      fetchmeta: function (url) {

        this.metadata = { 'title': '', 'description': '' };

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

        this.showDismissibleAlert=true;

        fetch('http://ec2-52-32-164-166.us-west-2.compute.amazonaws.com/query?search=' + url)
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

        var orcid_auth = require('@/assets/orcid_secret.json');

        var options = {client_id: orcid_auth.id,
          scope:"openid",
          nonce: "whatever",
          response_type:"token",
          redirect_uri:"http://throughputdb.com"}

        var url = "https://sandbox.orcid.org/oauth/authorize?"

        window.open(url + "client_id=" + options.client_id +
                    "&response_type=" + options.response_type +
                    "&scope=" + options.scope +
                    "&nonce=" + options.nonce +
                    "&redirect_uri=" + options.redirect_uri);
      },
      onSubmit: function (evt) {
        evt.preventDefault();
        var url = 'http://ec2-34-219-104-150.us-west-2.compute.amazonaws.com/datanote/?body=' + this.form.description +
                  '&url=' + JSON.stringify(this.form.url) +
                  '&person=' + this.form.orcid;

        console.log(url)
        fetch(url, {
          method: "POST", mode: "cors"} )
          .then(response => {
            response;
          })
          .then((x) => {
              fetchmeta(this.form.url);
            })
          .then((x) => {
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
            var svg = d3.select("svg")

            var node = svg.append("g")
                  .attr("id", "allNodes")
                  .attr("class", "nodes")
                  .selectAll("circle")
                  .data(that.graph.nodes)
                  .enter().append("circle")
                  .attr("r", function(d) {
                    var dtype = Object.keys(d.properties)
                    if (dtype.indexOf("value") > -1) {
                      return 30;
                    } else if (Object.keys(d.properties).indexOf("url") > -1) {
                      return 30;
                    } else if (Object.keys(d.properties).indexOf("id") > -1) {
                      return 20;
                    } else {
                      return 10;
                    }
                  })
                  .attr("fill", function (d ,i) {
                    if (Object.keys(d.properties).indexOf("value") > -1) {
                      return "#CF394E";
                    } else if (Object.keys(d.properties).indexOf("url") > -1) {
                      return "#A42D81";
                    } else if (Object.keys(d.properties).indexOf("id") > -1) {
                    return "#A6CE39";
                    } else {
                      return "#53B933"
                    }
                  })
                  .attr("stroke", "#00000077")
                  .attr("stroke-width", 3)

            node.append("title")
              .text(function(d) {
                var newobj = d.properties;
                delete newobj.created;
                return JSON.stringify(newobj, null, 2)
              })

            node.call(d3.drag()
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
            return node;
          }
      },
      links: function () {
          var that = this;
          if (that.graph) {
              return d3.select("svg")
                  .append("g")
                  .attr("id", "allLinks")
                  .attr("class", "links")
                  .selectAll("line")
                  .data(that.graph.links)
                  .enter().append("line")
                  .attr("stroke-width", function (d) { return 10; });
          }
      },
    },
    updated: function () {
        if (this.simulation) {
          var that = this;
          that.simulation.nodes(that.graph.nodes)
            .on('tick', function ticked() {
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

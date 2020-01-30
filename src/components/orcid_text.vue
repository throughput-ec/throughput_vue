<template>
  <div style="float:right">
    <b-btn v-b-modal.orcidinfo variant="outline-success" title="Why ORCID?"><strong>?</strong></b-btn>
    <b-modal id="orcidinfo" title="Why ORCID?" ok-only >
      <p>ORCID provides a trusted and well supported system for unique identifiers for individuals.  We have chosen to use ORCID because it is linked to resources that provide researchers with ways of tracking credit, and because it helps manage personal information in a way that is user-centered, rather than part of a larger corporation.</p>
      <p>Using an ORCID means that you can get credit for adding annotations to the graph of research knowledge since we can connect your research annotations to you.</p>
      <p>ORCID also provides a secure login, which ensures that Throughput never manages any of your passwords, reducing the likelihood that we might accidentally reveal any of your personal information.</p>
    </b-modal>
  </div>
</template>

<script>
  import '../assets/containers.css'

  export default {
    name: 'orcidText',
    data () {
      return {
        msg: 'Orcid description'
      }
    }
  }
</script>

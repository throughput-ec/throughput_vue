<template>
  <div style="margin:10px;">
     <b-alert show variant="primary">
       <h3>Adding Annotations</h3>
       This application allows a user with an authorized ORCID to add
       information to records by linking to their URL or URI.
       <h4>Use your ORCID</h4>
       <p>Your ORCID iD is a resolvable internet address, with the structure
         https://orcid.org/0000-000x-xxxx-xxxx.  This ID is unique to you
         (as opposed to your name), and can be used to link your research
         products, such as DOIs, or annotations, to you, so you can be sure
         to be credited for your efforts.</p>
      <h4>Target a resource</h4>
        <p>The Annotation Engine is designed to work with web resources so
          that we can share information with our colleagues and peers.  You
          can link to tutorials, add secondary information about datasets,
          link to publications, or any other resources, provided they have
          a URL on the internet.</p>
      <h4>View the Graph</h4>
        <p>If you want to see who else has tagged a resource then you can
          click the <em>Check URL</em> button and see who has already linked
          to the resource, and what they've noted.</p>
      <h4>Add Keywords</h4>
        <p>Sometimes it helps to add some extra keywords.  You can look
          through the set of keywords in the database, or add your own.</p>
      <img src="../assets/graph_place.svg" style="text-align:center;">
     </b-alert>

   </div>
</template>

<script>
  import '../assets/containers.css'

  export default {
    name: 'opener',
    data () {
      return {
        msg: 'Text opening'
      }
    }
  }
</script>

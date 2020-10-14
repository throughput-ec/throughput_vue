<template>
  <div class="headerbox">
    <div class="headermouse" style="padding-left:1%;padding-top:1%">
      <img src="@/assets/graph_place.png" width="60%" />
    </div>
    <div class="headername">
      <h1>Throughput Data and Software Annotation</h1>
      Annotation Editor
      <div>
        <b-button size='sm' variant='outline-primary' href='http://throughputdb.com/about'>About Throughput</b-button>
        <b-button size='sm' variant='outline-primary' href='http://github.com/throughput-ec'>GitHub Code</b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  }
};
</script>

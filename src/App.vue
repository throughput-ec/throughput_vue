<template>
    <div id="app" class="app-body">
        <app-graph></app-graph>
        <cookies />
    </div>
</template>

<script>
    import throughGraph from "./components/firstgraph.vue";
    import cookieLaw from "./components/cookie_note.vue";
    import "./assets/d3styles.css";

    export default {
        name: "app",
        components: {
            "app-graph": throughGraph,
            cookies: cookieLaw,
        }
    };
</script>

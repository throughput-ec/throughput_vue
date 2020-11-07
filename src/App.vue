<template>
    <div id="app" class="app-body">
        <Home></Home>
        <cookies />
    </div>
</template>

<script>
    import throughGraph from "./components/homepage";
    import cookieLaw from "./components/cookie_note.vue";
    import "./assets/global-styles.css";

    export default {
        name: "app",
        components: {
            "Home": throughGraph,
            cookies: cookieLaw,
        }
    };
</script>

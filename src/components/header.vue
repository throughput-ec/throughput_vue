<template>
    <header class='header'>
        <div class='header-menu'>
            <a :href='home' class='menu-button'>Home</a>
            <a :href='about' class='menu-button'>About Throughput</a>
            <a href='http://github.com/throughput-ec' class='menu-button'>GitHub Code</a>
            <a v-if='showLogin' :href='orcid' class='menu-button'>ORCID Login</a>
        </div>

        <div class='header-hero'>
            <div class='hero-container'>
                <div class='hero-inner'>
                    <h1>Throughput Data and Software Annotation</h1>
                    <img src="@/assets/graph_place.png" class='header-logo' alt='sample-network-diagram' />
                    <h4>Annotation Editor</h4>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
    export default {
        name: "Header",
        data() {
            return {
                showLogin: true,
                orcid: '',
                orcidId: '',
                home: '',
                about: 'http://throughputdb.com/about'
            };
        },
        created() {
            this.orcid = `https://orcid.org/oauth/authorize?client_id=${process.env.VUE_APP_ORCID}&response_type=code&scope=/authenticate&redirect_uri=http://localhost:8080/search`;

            this.home = process.env.VUE_APP_BASEURL;
            console.log("BASE URL: " + process.env.VUE_APP_BASEURL);

            // ORCID CODE & COOKIES
            const code = this.$route.query.code;
            const path = this.$route.path;

            if (code != null) {
                // EXCHANGE CODE FOR AUTH TOKEN
                console.log("GET ORCID TOKEN USING CODE: " + code);
                const body = {
                    client_id: process.env.VUE_APP_ORCID,
                    client_secret: process.env.VUE_APP_ORCIDSECRET,
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: 'https://localhost:8080'
                };


                // URL ENCODED FETCH REQUEST - TODO IMPLEMENT THIS ONCE HTTPS / API DECISION IS IMPMEMENTED
                // fetch("https://orcid.org/oauth/token", {
                //     method: "POST",
                //     headers: { "Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded" },
                //     body: this.uriEncodeData(body)
                //     })
                //     .then(function(response) {
                //         return response.json();
                //     })
                //     .then(data => {
                //         console.log("ORCID RESPONSE: " + JSON.stringify(data));
                //
                //         // SAVE CODE AS COOKIE
                //         let date = new Date();
                //         date.setTime(date.getTime() + (90 * 86400000)); // EXPIRE COOKIE AFTER 90 DAYS;
                //         const expires = date.toUTCString();
                //         document.cookie = "orcid-id=" + code.toString() + "; expires=" + expires;
                //
                //         this.showLogin = false;
                //
                //     })
                //     .catch( error => console.log(error) );

            } else {
                // CHECK COOKIES FOR ORCID
                const store = decodeURIComponent(document.cookie);
                const cookies = store.split(";");

                for (const cookie of cookies) {
                    if (cookie.substring(0, 8) === 'orcid-id') {
                        this.orcidId = cookie.substring(9);
                    }
                }

                //TODO: USE ORCID CODE TO GET ORCID ID
                this.showLogin = (this.orcidId === '');
            }
        },
        methods: {
            uriEncodeData(data) {
                return Object.keys(data)
                    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
                    .join('&');
            }
        }
    };
</script>

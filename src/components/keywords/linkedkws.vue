<template>
    <b-card title="Linked terms:">
        <div v-if='loading' class='screen-center'>
            <b-spinner label='Loading...' style='width: 2rem; height: 2rem;' variant='primary'/>
        </div>

        <div v-if="kwin.length > 0 && loading === false" style='max-height: 200px; width: 100%; overflow-y: scroll;'>
            <small>These keywords are associated with a database that shares a linked code repository.</small>

            <div class='keyword-container'>
                <div  v-for="(item, index) in keyLinked" v-bind:key="index" v-on:click="addkw(item.keywords)" class='keyword-badge blue-green-badge'>
                    <span>{{ item.keywords }}</span>
                    <span class='inner-badge'>{{ item.count }}</span>
                </div>
            </div>
        </div>

        <div v-else>
            <small v-if='!loading'>Click to find databases that match the selected combinations.</small>
        </div>
    </b-card>
</template>

<script>
    export default {
        name: "linkedkws",
        props: ["kwin"],
        data: () => ({
            keyLinked: [],
            loading: false
        }),
        watch: {
            kwin: {
                handler(val) {
                    this.loading = true;
                    let self = this;
                    let input = val.join(",");
                    fetch(`http://${process.env.VUE_APP_URLPATH}/api/keyword/dbs/linked?keywords=${input}`)
                        .then(function(response) {
                            return response.json();
                        })
                        .then(data => {
                            self.keyLinked = data.data.filter(x => !val.includes(x.keywords));
                            this.loading = false;
                        }).catch( () => {
                            this.loading = false;
                    });
                }
            }
        },
        methods: {
            addkw(val) {
                return this.kwin.push(val);
            }
        }
    };
</script>

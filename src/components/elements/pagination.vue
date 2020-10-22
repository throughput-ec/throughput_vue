<template>
    <div class='flex flex-space-between' style='padding: 10px 15px; background: transparent'>
        <span style='color: var(--t-color-light-blue);'>Showing {{start}} - {{end}} of {{ data.length }} records</span>
        <div>
            <button v-if='start >= show' @click='getPrevious' class='light-blue-outline-button' style='width: 105px;'>Previous</button>
            <button v-if='start < show' class='disabled-outline-button' style='width: 105px;'>Previous</button>
            <button v-if='end < data.length' @click='getNext' class='light-blue-outline-button' style='margin-left: 10px; width: 105px;'>Next</button>
            <button v-if='end >= data.length' class='disabled-outline-button' style='margin-left: 10px; width: 105px;'>Next</button>
        </div>
    </div>
</template>


<script>
    export default {
        name: "pagination",
        props: {
            data: {type: Array}
        },
        data() {
            return {
                show: 10,
                start: 1,
                end: 10,
            };
        },
        created() {
            this.end = this.show;
            const initialData = this.data.slice(0, this.show);
            this.$emit('updateToDisplay', initialData);
        },
        watch: {
            data: {
                handler(newData) {
                    if(this.end > newData.length) {
                        this.start = (newData.length - (this.show - 1) >= 0) ? newData.length - (this.show - 1) : 0;
                        this.end = newData.length;
                    }

                    const updatedData = this.data.slice(this.start - 1, this.end);
                    this.$emit('updateToDisplay', updatedData);
                }
            },
        },
        methods: {
            getPrevious() {
                this.start = this.start - this.show;
                this.end = this.end - this.show;

                if(this.start < 0) {
                    this.start = 0;
                    this.end = this.show;
                }

                const updatedData = this.data.slice(this.start - 1, this.end);
                this.$emit('updateToDisplay', updatedData);

            },
            getNext() {
                if(this.start <= this.data.length) {
                    this.start = this.start + this.show;
                    this.end = this.end + this.show;
                } else {
                    return;
                }

                if(this.end > this.data.length) {
                    this.end = this.data.length;
                }

                const updatedData = this.data.slice(this.start - 1, this.end);
                this.$emit('updateToDisplay', updatedData);
            }
        }
    }
</script>

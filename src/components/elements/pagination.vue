<template>
    <div class='flex flex-space-between' style='padding: 10px 15px; background: transparent'>
        <span style='color: var(--t-color-light-blue);'>Showing {{start}} - {{end}} of {{ dataToDisplay.length }} records</span>
        <div>
            <button v-if='start >= 2' @click='getPrevious' class='light-blue-outline-button' style='width: 105px;'>Previous</button>
            <button v-if='start < 2' class='disabled-outline-button' style='width: 105px;'>Previous</button>
            <button v-if='end < dataToDisplay.length' @click='getNext' class='light-blue-outline-button' style='margin-left: 10px; width: 105px;'>Next</button>
            <button v-if='end >= dataToDisplay.length' class='disabled-outline-button' style='margin-left: 10px; width: 105px;'>Next</button>
        </div>
    </div>
</template>


<script>
    export default {
        name: "pagination",
        props: {
            data: {type: Array},
            showAll: false
        },
        data() {
            return {
                dataToDisplay: [],
                show: 10,
                start: 1,
                end: 10,
            };
        },
        created() {
            this.end = this.show;

            if(this.data.length > 0) {
                this.setToDisplayData();
                this.$emit('updateToDisplay', this.dataToDisplay.slice(0, this.show));
            }
        },
        watch: {
            data: {
                handler() {
                    this.setToDisplayData();

                    if(this.end > this.dataToDisplay.length) {
                        this.start = (this.dataToDisplay.length - (this.show - 1) >= 0) ? this.dataToDisplay.length - (this.show - 1) : 0;
                        this.end = this.dataToDisplay.length;
                    }

                    const updatedData = this.dataToDisplay.slice(this.start - 1, this.end);
                    this.$emit('updateToDisplay', updatedData);
                }
            },
            showAll: {
                handler() {
                    this.setToDisplayData();
                }
            }
        },
        methods: {
            getPrevious() {
                this.start = this.start - this.show;
                this.end = this.end - this.show;

                if(this.start < 1) {
                    this.start = 1;
                    this.end = this.show;
                }

                this.checkEnd();
                this.emitNewRecordSet();
            },
            getNext() {
                if(this.start <= this.dataToDisplay.length) {
                    this.start = this.start + this.show;
                    this.end = this.end + this.show;
                } else {
                    return;
                }

                this.checkEnd();
                this.emitNewRecordSet();
            },
            setToDisplayData() {
                if(this.showAll === true) {
                    this.dataToDisplay = this.data;
                } else {
                    this.dataToDisplay = this.data.filter(x => x.show === 'yes');
                }

                this.checkEnd();
                this.emitNewRecordSet();
            },
            checkEnd() {
                if(this.end > this.dataToDisplay.length) {
                    // NUMBER OF RECORDS IN RECORD SET DECREASED & END IS BEYOND UPPER LIMIT - BRING DOWN END
                    this.end = this.dataToDisplay.length;
                } else if( ((this.end - this.start) < this.show) && ( (this.start + this.show) <= this.dataToDisplay.length )) {
                    // IF NOT SHOWING AMOUNT OF RECORDS TO DISPLAY ON EACH PAGE AND NOT ON LAST PAGE -> ADJUST END TO SHOW CORRECT NUMBER OF RECORDS
                    this.end = this.start + this.show - 1;

                } else if(((this.end - this.start) < this.show) && this.dataToDisplay.length > this.end) {
                    // PARTIAL PAGE & RECORD SET IS > END
                    this.end = this.dataToDisplay.length;
                }

                if(this.start >= this.end) {
                    this.start = ( (this.end - this.show) >= 1 ) ? (this.end - this.show + 1) : 1;
                }
            },
            emitNewRecordSet() {
                const updatedData = this.dataToDisplay.slice(this.start - 1, this.end);
                this.$emit('updateToDisplay', updatedData);
            }
        }
    }
</script>

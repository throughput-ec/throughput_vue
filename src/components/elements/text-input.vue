<template>
    <b-container>
        <b-input-group prepend="Text Search" class="mt-3">
            <b-form-input type="text" v-model="textQuery" v-on:keyup="$emit('change', textQuery)" placeholder='Search...'></b-form-input>

            <b-input-group-append>
                <b-button @click=' $bvModal.show("text-search-info-modal")'>Info</b-button>
                <b-modal id="text-search-info-modal" hide-footer hide-header>
                    <div style='padding: 20px;'>
                        <p><strong>Text search</strong>: Search for databases based on a text entered.  Text queries may include
                            <strong>and</strong>/<strong>or</strong> based searches and can also include wildcards (<strong style='color: var(--t-color-blue);'>*</strong>)
                        </p>
                        <div class='flex'>
                            <button class='blue-button' @click='$bvModal.hide("text-search-info-modal")'>OK</button>
                        </div>
                    </div>
                </b-modal>
            </b-input-group-append>

        </b-input-group>
    </b-container>
</template>

<script>
    export default {
        data: () => ({ textQuery: "" }),
    };
</script>

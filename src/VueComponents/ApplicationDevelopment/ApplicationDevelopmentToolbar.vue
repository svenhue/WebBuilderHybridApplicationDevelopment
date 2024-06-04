<template>

    <div>
                <q-toolbar >
                
      
                    <ApplicationScreenComponent
                    :contextid="contextid">

                    </ApplicationScreenComponent>
                    <ApplicationRoutingComponent
                    :style="{
                        'min-width': '500px',
                        'max-width': '500px',
                    }"
                    :route="props.route">

                    </ApplicationRoutingComponent>
                </q-toolbar>
        </div>
</template>

<script setup lang="ts">
import ApplicationRoutingComponent from './ApplicationRoutingComponent.vue'
import ApplicationScreenComponent from './ApplicationScreenComponent.vue'
//import { BrowserDownload, FileTypes  } from 'alphautils';


const props = defineProps({
    contextid: {
        type: Number,
        required: true
    },
    route: {
        type: Object,
        required: true
    }
})


</script>

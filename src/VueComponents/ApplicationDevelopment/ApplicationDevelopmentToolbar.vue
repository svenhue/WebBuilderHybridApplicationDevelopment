<template>

    <Teleport v-if="ready == true" to="#dev-toolbar">
        <div class="dev-toolbar">
            
                
      
                    <ApplicationScreenComponent
                    :contextid="contextid">

                    </ApplicationScreenComponent>
                    <CommandPaletteSearchBarComponent>
                    </CommandPaletteSearchBarComponent>
                    <DeploymentComponent :view-model="viewModel">

                    </DeploymentComponent>
             
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import CommandPaletteSearchBarComponent from '../../utils/CommandPalette/VueComponents/CommandPaletteSearchBarComponent.vue';

import ApplicationRoutingComponent from './ApplicationRoutingComponent.vue'
import ApplicationScreenComponent from './ApplicationScreenComponent.vue'
import DeploymentComponent from '../../utils/Features/Deployment/VueComponent/DeploymentComponent.vue';
import { RunTimeVueApplicationViewModel } from 'src/ViewModels/RuntimeVueApplicationViewModel';
import { ref } from 'vue';
import { waitForElm } from 'alphautils';
//import { BrowserDownload, FileTypes  } from 'alphautils';


const props = defineProps({
    contextid: {
        type: Number,
        required: true
    },
    route: {
        type: Object,
        required: true
    },
    viewModel: {
        type: Object as () =>RunTimeVueApplicationViewModel,
        required: true
    }
})
const ready = ref(false)

waitForElm('#dev-toolbar').then(() => {
    ready.value = true
})

</script>

<style scoped lang="scss">

.dev-toolbar{
    display:inline-flex;
    align-items: center;
    
    width: 100%;
}

</style>
<template>

    <Teleport v-if="ready == true" to="#dev-toolbar" class="dev-toolbar">

        <div :style="{display: 'flex', alignItems: 'center'}">
                    <ApplicationScreenComponent :style="{
                        marginRight: 0,
                        marginLeft: 'auto',
                    }"
                    :contextid="contextid">

                    </ApplicationScreenComponent>
                    
                    <CommandPaletteSearchBarComponent :style="{
                      
                    }">
                    </CommandPaletteSearchBarComponent>

                    <q-select dense 
                    :options="['design', 'edit']" 
                    :model-value="store.devSettings?.editorMode" 
                    :style="{width: '70px', backgroundColor: 'white', margin: '4px', borderRadius: '4px'}" 
                    @update:model-value="(val) => viewModel.settingsService.ChangeEditorMode(val, viewModel)">
                    </q-select>
                    <DeploymentComponent :view-model="viewModel">

                    </DeploymentComponent>
                </div>
    </Teleport>
</template>

<script setup lang="ts">
import CommandPaletteSearchBarComponent from '../../utils/CommandPalette/VueComponents/CommandPaletteSearchBarComponent.vue';
import ApplicationScreenComponent from './ApplicationScreenComponent.vue'
import DeploymentComponent from '../../utils/Features/Deployment/VueComponent/DeploymentComponent.vue';
import { RunTimeVueApplicationViewModel } from 'src/ViewModels/RuntimeVueApplicationViewModel';
import { ref } from 'vue';
import { useApplicationStore, waitForElm } from 'alphautils';
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
const store = useApplicationStore()
waitForElm('#dev-toolbar').then(() => {
    ready.value = true
})

</script>

<style lang="scss">

#dev-toolbar{
    display:flex;
    justify-content:center;
    align-items: center;
    width: 100%,
}

</style>
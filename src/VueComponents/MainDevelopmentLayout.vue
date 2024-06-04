<template>
    <q-layout class="main-development-layout" :style="{minHeight: '100px'}">
        <div class="layout-placeholder"    id="XXX">

        </div>
  

        
        <q-page-container id="development-container" ref="container"
        >
            <NuxtPage :contextid="contextid"></NuxtPage>
        </q-page-container>
    
    </q-layout>
</template>

<script setup lang="ts">
import { ref} from 'vue';

const props = defineProps({
    contextid: {
        type: Number,
        required:true
    }
})

const container = ref(null)
const developmentModuleRef = ref(null)

function deleteFocussedView(){
    developmentModuleRef.value.deleteFocussedView()
}





</script>

<style lang="scss">
.main-development-layout{
    width: 100%;
    height: 100%;
    position: absolute;
   
    overflow: clip;
    
    .mdl-drawer{
        margin-top:100px;
        z-index: 100;
    }
    .layout-placeholder{
      
    }
    #development-container{
        width: 100%;
        height: 100%;
        margin-left: 42px;
        overflow: clip;
    }
}

</style>
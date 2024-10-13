<template>
    <div :style="{     
            borderRadius: '5px',
            zIndex: 999999999,      
            height: '40px',
            width: '300px',
            display: 'flex'   
        }"
    >
    <PreviewComponent>

    </PreviewComponent>
    <PublishComponent
    :view-model="viewModel">
        
    </PublishComponent>
    </div>
</template>


<script setup lang="ts">
import { RunTimeVueApplicationViewModel } from '../../../../ViewModels/RuntimeVueApplicationViewModel';
import PreviewComponent from './PreviewComponent.vue';
import PublishComponent from './PublishComponent.vue';

const props = defineProps({
    viewModel:{
        type: RunTimeVueApplicationViewModel,
        required: true
    }
})


</script>
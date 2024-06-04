<template>
    <div :style="{
            position: 'absolute',
            top: '4px',
            borderRadius: '5px',
            zIndex: 999999999,
            right: '30px',
            height: '40px',
            width: '300px',
            display: 'flex',
            
            
        }"
    >
    <PreviewComponent>

    </PreviewComponent>

    <PublishComponent>
        
    </PublishComponent>
    </div>
</template>


<script setup lang="ts">
import PreviewComponent from './PreviewComponent.vue';
import PublishComponent from './PublishComponent.vue';




</script>
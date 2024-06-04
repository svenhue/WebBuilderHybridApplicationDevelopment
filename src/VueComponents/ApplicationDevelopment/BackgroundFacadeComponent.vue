<template>
    <div :style="style" class="editor-background-facade">    
            <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';


const style = reactive({
   width: '1200px',
   height: '100%'
})

function ChangeFacadeStyle(newStyle: object){
    style.width = newStyle.width + 'px';
    style.height = newStyle.height + 'px';
}

defineExpose({
    ChangeFacadeStyle
})

onMounted(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    ChangeFacadeStyle({
        left: '0px',
        width: width -50 + 'px',
        height: height -150+ 'px'
    })
})


/*

<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="background-facade">
    <defs>
    <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="lightblue" stroke-width="0.5"/>
    </pattern>
    <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
    <rect width="100" height="100" fill="url(#smallGrid)"/>
    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="lightblue" stroke-width="1"/>
    </pattern>
</defs>
<rect width="20000px" height="20000px" fill="url(#grid)" />
        </svg>
*/
</script>

<style scoped lang="scss">

.editor-background-facade{
    overflow:scroll;
    overflow-block: scroll;
    position: 'absolute';
    background-color: $brightgrey;
 
    min-width: 200px;
    
    
    .background-facade{ 


    }
}


</style>


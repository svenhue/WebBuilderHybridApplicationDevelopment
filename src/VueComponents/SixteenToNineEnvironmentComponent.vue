<template>
    <div :style="environmentStyle"  :id="'developmentenvironment_' + contextid"  class="sixteen-nine-environment-component">
        <slot>
            
        </slot>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const props = defineProps({
    contextid:{
        type: Number,
        required: true
    }
})

const screenRect = {
    width: window.innerWidth,
    height: window.innerHeight
}
const environmentStyle = reactive({
    position: 'absolute',
    width: screenRect.width -250 + 'px',
    height: screenRect.height + 'px',
    border: '1px solid black'
})
</script>

<style scoped lang="scss">
.sixteen-nine-environment-component{

}
</style>
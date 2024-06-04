<template>
    <div>
        <q-input dense 
        :model-value="currentElement?.content?.label" 
        @update:model-value="(val) => $emit('updateElement', [{key: 'content.label', value: val}])">
            <template v-slot:before>
                <div class="editor-input-label">Label </div>
            </template>
        </q-input>

        <TextInputEditorComponent
        :label="'Icon'"
        @updateValue="(val) => $emit('updateElement', [{key: 'content.iconName', value: val}])"
        :value="currentElement?.content?.iconName ?? ''">

        </TextInputEditorComponent>
    </div>
</template>


<script setup lang="ts">
import { IViewConfiguration } from 'alphautils';
import TextInputEditorComponent from 'alphaviewlibrary/src/Editor/TextInputEditorComponent.vue';

defineProps({
    currentElement: {
        type: Object as () => IViewConfiguration,
        required: true
    }
})


defineEmits(['updateElement'])

</script>
<template>
    <div>
        <div>
        Fields
            <q-select dense 
            :options="formSourceOptions" 
            :model-value="currentElement.dataConfig.fieldSource" 
            @update:model-value="(val) => $emit('updateElement', [{key:'dataConfig.fieldSource', value:val}])">

                <template v-slot:before>
                    <div class="editor-input-label" > Field source</div>

                </template>
            </q-select>
        </div>
        <div>
            <q-btn dense icon='add' @click='addField()'></q-btn>
        </div>
        
        <q-list dense >
            <q-item dense
            v-for="field in fieldsModel" :key="field">
                <q-input dense 
                :model-value="field?.label" 
                @focusout="() => { emits('updateElement', [{key: 'content.fields', value: JSON.parse(JSON.stringify(fieldsModel))}]), showEditor = false}"
                @enter="() => { emits('updateElement', [{key: 'content.fields', value: JSON.parse(JSON.stringify(fieldsModel))}]), showEditor = false}"
                @update:model-value="(val) => updateFieldProp(field, 'label',val)">
                </q-input>
                
                <q-item-section side> 
                    <q-btn dense icon='edit' @click='editField(field)'></q-btn>
                </q-item-section>
                <q-item-section side>
                    <q-btn dense icon='delete' @click='deletefield(field)'></q-btn>
                </q-item-section>
            </q-item>
        
        </q-list>
        <FormFieldDesignerComponent 
        ref="formFieldDesigner"
        @updateField="(val) => updateField(val)"
        
        >

        </FormFieldDesignerComponent>
        <q-separator></q-separator>
    </div>
</template>

<script setup lang="ts">
import { IFormViewConfiguration,IFormField } from 'alphaviewlibrary';
import { ref, watch } from 'vue';
import FormFieldDesignerComponent from './FormFieldDesignerComponent.vue';

const props = defineProps({
    currentElement: {
        type: Object as () => IFormViewConfiguration,
        required: true
    }
})

const emits = defineEmits(['updateElement'])

const fieldsModel = ref<Array<IFormField>>([])
const formFieldDesigner = ref<typeof FormFieldDesignerComponent>(null)

const showEditor = ref(false)

const fieldInEditor = ref<IFormField>({})

watch(() => props.currentElement, (val) => {
    fieldsModel.value = JSON.parse(JSON.stringify(val.content?.fields)) ?? [];
})
const formSourceOptions = [
    {
        label: 'Manual',
        value: 'manual'
    },
    {
        label: 'Auto',
        value: 'auto'
    }
]

function editField(field: IFormField) {
    fieldInEditor.value = JSON.parse(JSON.stringify(field))

    formFieldDesigner.value?.setField(field)
    formFieldDesigner.value?.showEditor()
    showEditor.value = true
    
}

function deletefield(field: IFormField) {
    
    const i = fieldsModel.value.indexOf(field)

    if(i == -1){
        throw new Error('Field not found')
    }
    fieldsModel.value.splice(i, 1)
    emits('updateElement', [{key: 'content.fields', value: JSON.parse(JSON.stringify(fieldsModel.value))}])
}
function updateField(field: IFormField){

    const i =fieldsModel.value.findIndex(f => f.label == fieldInEditor.value.label && f.name == fieldInEditor.value.name)
    if(i == -1){
        throw new Error('Field not found')
    }
    fieldsModel.value[i] = field
    emits('updateElement', [{key: 'content.fields', value: JSON.parse(JSON.stringify(fieldsModel.value))}])
    fieldInEditor.value = {};
}

function addField(){

    fieldsModel.value.push({
        label: 'New Field',
        name: 'newField',
        type: 'text',
        required: false
    })

    emits('updateElement', [{key: 'content.fields', value:JSON.parse(JSON.stringify(fieldsModel.value))}])
}

function updateFieldProp(field, key: string, val: string){
    field[key] = val
    
}
</script>

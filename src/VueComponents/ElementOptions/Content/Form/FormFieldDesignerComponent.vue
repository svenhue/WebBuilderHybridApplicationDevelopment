<template>
    <q-dialog v-model="show" >
        <q-card class="editor-formfield-form">
            <q-card-section>
                Edit Field
            </q-card-section>
            <q-card-section>
                <q-form @submit="onSubmit">
                <q-input v-model="formField.name" label="Name" required dense></q-input>
                <q-input v-model="formField.label" label="Label" required dense></q-input>
                <q-input v-model="formField.field" label="Field" required dense></q-input>
                <q-checkbox v-model="formField.required" label="Required" type="boolean" dense></q-checkbox>
                <q-input v-model="formField.align" label="Align" dense></q-input>
                <q-checkbox v-model="formField.sortable" label="Sortable" type="checkbox" dense></q-checkbox>
                <q-separator></q-separator>
                <q-btn label="Submit" type="submit" color="primary"></q-btn>
                </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>


<script setup lang="ts">
import { IFormField } from 'alphaviewlibrary';
import { reactive, ref } from 'vue';

const emits = defineEmits(['updateField'])

defineExpose({
    setField,
    showEditor
})
const show = ref(false)
const formField = reactive<IFormField>({
    name: '',
    label: '',
    field: '',
    required: false,
    align: '',
    sortable: false,
    style: '',
    classes: ''
});

function setField(newField) {
    Object.assign(formField, newField);

}
function showEditor(){
    show.value = true;
}

function onSubmit() {

    emits('updateField', formField);
    show.value = false;
}

</script>

<style lang = "scss" scoped>

.editor-formfield-form{
    width: 500px;
        height: 500px;
        background-color: white;
        padding: 20px;
       // border: 2px solid $primary;
}

</style>
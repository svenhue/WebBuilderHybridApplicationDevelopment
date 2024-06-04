<template>
    <div>
        <div :style="{display: 'flex'}">
            <AddNewLocaleComponent @addLocale="(v) => { viewModel.AddLanguageFileString({name: v.label, code: v.value, fileString: '', file: ''}), OpenLocaleString({name: v.label, code: v.value, fileString: '', file: ''}) }"></AddNewLocaleComponent>
        <q-tabs
            
            dense
            v-model="tab"
            
            class="app-settings-panels"
            >
                <q-tab v-for="lang in viewModel.GetLocales()" 
                clickable
                @click="() => OpenLocaleString(viewModel.GetFileStringByCode(lang.code))"
                :name="lang.code"  
                :label="lang.name"></q-tab>
        </q-tabs>
    </div>
        <div class="jsoneditor1" ref="refEditorX" >
            
            
            <q-btn v-show="tab != undefined" dense icon='close' @click="() => { CloseEditor()}">

            </q-btn>
            <q-btn v-show="tab != null" dense icon='check' @click="() => {SaveValue()}">

            </q-btn>
        </div>
    </div>
</template>


<script setup lang="ts">
import { BaseServiceProvider } from 'alphautils';
import { InternationalizationViewModel } from '../../../utils/Features/Internationalization/InternationalizationViewModel';
import { inject, onUnmounted, ref } from 'vue';
import { ICodeEditorService } from 'alphaviewlibrary';
import { ILanguageFileString } from '../../../utils/Features/Internationalization/ILanguageFileString';
import * as monaco from 'monaco-editor';
import AddNewLocaleComponent from './AddNewLocaleComponent.vue';


const props = defineProps({
    contextid: {
        type: Number, //this must be the app context!
        required: true
    }
})
const tab = ref(undefined);
const viewModel = inject('languageVM_' + props.contextid) as InternationalizationViewModel
const service = BaseServiceProvider.ServiceWithContext<ICodeEditorService>("CodeEditorService", 0) as ICodeEditorService
const refEditorX = ref<HTMLElement | null>(null);
let editor = null as monaco.editor.IStandaloneCodeEditor | null


function OpenLocaleString(locale: ILanguageFileString){

    if(tab.value == undefined || tab.value != locale.code){
        tab.value = locale.code
    }
    if(editor != null){
        service.dispose()
        editor = null;
    }
    locale.fileString  = SetDefaultValue(locale.fileString)
    console.log(123, locale)
    editor = service.OpenJSONEditor(refEditorX, props.contextid, locale.fileString)
}


function SaveValue(){
    viewModel.SetFileStringByCode(tab.value, editor.getModel().getValue())
}

function CloseEditor(){
    service.dispose();
    tab.value = ''
    editor = null
}

function SetDefaultValue(fileString: string){
    if(fileString != '' && fileString != undefined){
        return fileString;
    }

    const fs = JSON.stringify(
        // provide your messages as key value pairs in the main object
        // in this example the message "key" would be translated to "value"
        {
            "main":{
                "key": "value"
            }
        },
     null, 4)

     return fs;
}
</script>

<style scoped lang="scss">


.jsoneditor1{
    width: 1005;
    height: 400px;

}

</style>
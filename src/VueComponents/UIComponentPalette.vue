<template>
    <div class="component-palette">
        <div class="drawer-header">
            Add
            <q-btn 
            
            dense
            icon="store" 
            :style="{
                margin: 'auto'
            }"
            @click="navService.AddAndOpenTab({ path: '/marketplace', title: 'Marketplace'})"
            clickable
            >
            <q-tooltip>
            Marketplace
            </q-tooltip>
            </q-btn>
            <q-btn class="close-btn" dense unelevated size="10px" icon="close" @click="emits('close')"></q-btn>
        </div>
     
        <q-expansion-item label="Basic">
            <div class="palette-grid">
                <q-card v-for="(view, index) in views.filter(v => v.type.startsWith('viewdefinition:Basic') && v?.isDisabled != true)" :key="view.name" clickable class="component-card" 
                    @mousedown="(e) => startElementTransition(e, view.type , )"
                    >
                    <div  class="component-card-image" >
                       <div>
                        
                        <q-img v-if="view?.icon != undefined"
                            :src="GetImageURL('../../../assets/icons/', view.icon)" >    
                        </q-img>
                        <div v-else :style="{width: '50px', height: '50px'}">

                        </div>
                        <q-icon  class="absolute-right" name="info" @mousemove="() => showInfo['basic'][index] = true" >
                                <q-tooltip 
                                :style="{zIndex: 999999}"
                                    :model-value="showInfo['basic'][index]">
                                        {{ GetInfo(view.type) }}
                                    </q-tooltip>
                        </q-icon>
                    </div>
                    </div>
                    <div class="component-card-name">
                            {{ view.name.replace('Component','') }}
                    </div>
                </q-card>
            </div>
        </q-expansion-item>
        <q-expansion-item label="Structure">
            <div class="palette-grid">
                <q-card v-for="(view, index) in views.filter(v => v.type.startsWith('viewdefinition:Structure'))" :key="view.name" clickable class="component-card" @mousedown="(e) => startElementTransition(e, view.type)">
                    <div :draggable="true"  class="component-card-image" >
                        <div>
                            <q-img v-if="view?.icon != undefined"
                            :src="GetImageURL('../../../assets/icons/', view.icon)" >    
                        </q-img>
                        <div v-else :style="{width: '50px', height: '50px'}">

                        </div>
                        <q-icon  class="absolute-right" name="info" @mousemove="() => showInfo['structure'][index] = true" >
                                <q-tooltip 
                                :style="{zIndex: 999999}"
                                    :model-value="showInfo['structure'][index]">
                                        {{ GetInfo(view.type) }}
                                    </q-tooltip>
                                </q-icon>
                    </div>
                    </div>
                      
            

                    <div class="component-card-name" >
                            {{ view.name.replace('Component','') }}
                    </div>
                </q-card>
                
            </div>
        </q-expansion-item>
        <q-expansion-item label="Navigation">
            <div class="palette-grid">
                <q-card v-for="(view, index) in views.filter(v => v.type.startsWith('viewdefinition:Navigation'))" :key="view.name" clickable class="component-card" @mousedown="(e) => startElementTransition(e, view.type)">
                    <div :draggable="true"  class="component-card-image">
                      <div>
                        <q-img v-if="view?.icon != undefined"
                            :src="GetImageURL('../../../assets/icons/', view.icon)" >    
                        </q-img>
                        <div v-else :style="{width: '50px', height: '50px'}">

                        </div>
                        <q-icon  class="absolute-right" name="info" @mousemove="() => showInfo['navigation'][index] = true" >
                                <q-tooltip 
                                :style="{zIndex: 999999}"
                                    :model-value="showInfo['navigation'][index]">
                                        {{ GetInfo(view.type) }}
                                    </q-tooltip>
                                </q-icon>
                    </div>
                    </div>
                    <div class="component-card-name" >
                            {{ view.name.replace('Component','') }}
                    </div>
                </q-card>
            </div>
        </q-expansion-item>
        <q-expansion-item label="Typography">
            <div class="palette-grid">
                <q-card v-for="(view, index) in views.filter(v => v.type.startsWith('viewdefinition:Typography') && v?.isDisabled != true)" :key="view.name" clickable class="component-card" @mousedown="(e) => startElementTransition(e, view.type)">
                    <div :draggable="true"  class="component-card-image" >
                        <div>
                            <q-img v-if="view?.icon != undefined"
                            :src="GetImageURL('../../../assets/icons/', view.icon)" >    
                        </q-img>
                        <div v-else :style="{width: '50px', height: '50px'}">

                        </div>
                        <q-icon  class="absolute-right" name="info" @mousemove="() => showInfo['typography'][index] = true" >
                                <q-tooltip 
                                :style="{zIndex: 999999}"
                                    :model-value="showInfo['typography'][index]">
                                        {{ GetInfo(view.type) }}
                                    </q-tooltip>
                                </q-icon>
                    </div>
                    </div>
                    <div class="component-card-name" >
                            {{ view.name.replace('Component','') }}
                    </div>
                </q-card>
            </div>
        </q-expansion-item>
        <q-expansion-item label="Layout">
            <div class="palette-grid">
                <q-card v-for="(view, index) in views.filter(v => v.type.startsWith('viewdefinition:Layout'))" :key="view.name" clickable class="component-card" @mousedown="(e) => startElementTransition(e, view.type)">
                    <div :draggable="true"  class="component-card-image">
                       <div>
                        <q-img v-if="view?.icon != undefined"
                            :src="GetImageURL('../../../assets/icons/', view.icon)" >    
                        </q-img>
                        <div v-else :style="{width: '50px', height: '50px'}">

                        </div>
                        <q-icon  class="absolute-right" name="info" @mousemove="() => showInfo['layout'][index] = true" >
                                <q-tooltip 
                                :style="{zIndex: 999999}"
                                    :model-value="showInfo['layout'][index]">
                                        {{ GetInfo(view.type) }}
                                    </q-tooltip>
                                </q-icon>
                    </div>
                    </div>
                    <div class="component-card-name" >
                            {{ view.name.replace('Component','') }}
                    </div>
                </q-card>
            </div>
        </q-expansion-item>
        <q-expansion-item label="Media">
            <div class="palette-grid">
                <q-card v-for="(view, index) in views.filter(v => v.type.startsWith('viewdefinition:Media'))" :key="view.name" clickable class="component-card" @mousedown="(e) => startElementTransition(e, view.type)">
                    <div :draggable="true"  class="component-card-image" >
                       <div>
                        <q-img v-if="view?.icon != undefined"
                            :src="GetImageURL('../../../assets/icons/', view.icon)" >    
                        </q-img>
                        <div v-else :style="{width: '50px', height: '50px'}">

                        </div>
                        <q-icon  class="absolute-right" name="info" @mousemove="() => showInfo['media'][index] = true" >
                                <q-tooltip 
                                :style="{zIndex: 999999}"
                                    :model-value="showInfo['media'][index]">
                                        {{ GetInfo(view.type) }}
                                    </q-tooltip>
                                </q-icon>
                    </div>
                    </div>
                    <div class="component-card-name" >
                            {{ view.name.replace('Component','') }}
                    </div>
                </q-card>
            </div>
        </q-expansion-item>
        <q-expansion-item label="Forms">
            <div class="palette-grid">
                <q-card v-for="(view, index) in views.filter(v => v.type.startsWith('viewdefinition:Form'))" :key="view.name" clickable class="component-card" @mousedown="(e) => startElementTransition(e, view.type)">
                    <div :draggable="true"  class="component-card-image" >
                        <div>
                            <q-img v-if="view?.icon != undefined"
                            :src="GetImageURL('../../../assets/icons/', view.icon)" >    
                        </q-img>
                        <div v-else :style="{width: '50px', height: '50px'}">

                        </div>
                        <q-icon  class="absolute-right" name="info" @mousemove="() => showInfo['forms'][index] = true" >
                                <q-tooltip 
                                :style="{zIndex: 999999}"
                                    :model-value="showInfo['forms'][index]">
                                        {{ GetInfo(view.type) }}
                                    </q-tooltip>
                                </q-icon>
                    </div>
                    </div>
                    <div class="component-card-name" >
                            {{ view.name.replace('Component','') }}
                    </div>
                </q-card>
            </div>
        </q-expansion-item>
        <q-expansion-item label="Data">
            <div class="palette-grid">
                <q-card v-for="(view, index) in views.filter(v => v.type.startsWith('viewdefinition:Data'))" :key="view.name" clickable class="component-card" @mousedown="(e) => startElementTransition(e, view.type)">
                    <div :draggable="true"  class="component-card-image" >
                        <div>
                            
                            <q-img v-if="view?.icon != undefined"
                            :src="GetImageURL('../../../assets/icons/', view.icon)" >    
                        </q-img>
                        <div v-else :style="{width: '50px', height: '50px'}">

                        </div>
                        <q-icon  class="absolute-right" name="info" @mousemove="() => showInfo['data'][index] = true" >
                                <q-tooltip 
                                :style="{zIndex: 999999}"
                                    :model-value="showInfo['data'][index]">
                                        {{ GetInfo(view.type) }}
                                    </q-tooltip>
                                </q-icon>
                    </div>
                    </div>
                    <div class="component-card-name" >
                            {{ view.name.replace('Component','') }}
                    </div>
                </q-card>
            </div>
        </q-expansion-item>
        <q-expansion-item label="Editor">
            <q-list>
                <q-item v-for="(view, index) in views.filter(v => v.type.startsWith('viewdefinition:Editor'))" :key="view.name" clickable>
                    <q-item-section @mousedown="(e) => startElementTransition(e, view.type)">
                        <q-item-label>{{ view.name }}</q-item-label>
                    </q-item-section>
                      
                    <q-icon name="info" @mousemove="() => showInfo['editor'][index] = true" >
                        <q-tooltip 
                        :style="{zIndex: 99999}"
                        :model-value="showInfo['editor'][index]">
                            {{ GetInfo(view.type) }}
                        </q-tooltip>
                    </q-icon>
                </q-item>
            </q-list>
        </q-expansion-item>
        <q-expansion-item label="Advanced">
            <q-list>
                <q-item v-for="(view, index) in views.filter(v => v.type.startsWith('viewdefinition:Advanced'))" :key="view.name" clickable>
                    <q-item-section @mousedown="(e) => startElementTransition(e, view.type)">
                        <q-item-label>{{ view.name }}</q-item-label>
                        
                    </q-item-section>
                   
                    <q-icon name="info" @mousemove="() => showInfo['advanced'][index] = true" >
                        <q-tooltip 
                        :style="{zIndex: 99999}"
                        :model-value="showInfo['advanced'][index]">
                            {{ GetInfo(view.type) }}
                        </q-tooltip>
                    </q-icon>
                </q-item>
            </q-list>
        </q-expansion-item>
        <q-expansion-item label="Your templates">
            <q-list>
                <q-item v-for="view in avaibleTemplates" :key="view.name" clickable>
                    <q-item-section @mousedown="(e) => startElementTransition(e, view.type)">
                        <q-item-label>{{ view.name }}</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-expansion-item>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { BORepository, BaseServiceProvider, TabService, useWebNodeTemplateStore } from 'alphautils';
import { GetImageURL } from '../utils/composables/GetImageURL';
import { IViewConfiguration, IDataAdapter } from 'alphautils';
import { ViewDefinition } from '../utils/Models/ViewDefinition';
const store = useWebNodeTemplateStore()
const views = computed(() => {
    return store.avaiblenodetemplates.filter(v => v.name != undefined) as Array<IViewConfiguration>
})
const showInfo = reactive({
    advanced: [],
    structure: [],
    editor: [],
    data: [],
    forms: [],
    media: [],
    layout: [],
    typography: [],
    navigation: [],
    basic: [],
    action: []

})


const boRepository = BaseServiceProvider.ServiceWithContext<BORepository>("BORepository", 0)
const navService = BaseServiceProvider.ServiceWithContext<TabService>("TabService", 0)
const avaibleTemplates = computed(() => {
    return boRepository.Get("UIViewTemplate", undefined, 0)
})


function GetInfo(type: string){
    return ViewDefinition.GetInfoOrUndefined(type)
}
const emits = defineEmits(['addComponent', 'close'])

function startElementTransition(e: MouseEvent, type: string){
    e.stopPropagation();
    e.preventDefault();
    AnimateComponentDrag()
    emits('addComponent',e ,type)
}


function AnimateComponentDrag(){
    const el = CreateDragElement()

    document.body.appendChild(el)
    document.addEventListener('mousemove', bindDragElementToMouse)

    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', bindDragElementToMouse)
        document.getElementById('dragElement111_123')?.remove()
    })

}

function CreateDragElement(){
    const dragElement = document.createElement('div')
    dragElement.style.position = "absolute"
    dragElement.style.zIndex = "99999"
    dragElement.style.backgroundColor = "white"
    dragElement.style.width = "40px"
    dragElement.style.height = "40px"
    dragElement.style.border = "1px solid black"
    dragElement.style.opacity = "0.5"
    dragElement.id = 'dragElement111_123'
    return dragElement
}


function bindDragElementToMouse(event: MouseEvent){
    const element = document.getElementById('dragElement111_123')

    element.style.top = event.clientY + "px"
    element.style.left = event.clientX + "px"
    
    console.log(element.style.y, element.style.x)
}

</script>

<style scoped lang="scss">

.component-palette{
    width: 250px;
.palette-grid{
    column-gap: 5px;
    row-gap: 5px;
    display: grid;
    columns: 4;
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    .component-card{
        cursor: pointer;
        width: 70px;
        height: min-content;
        background-color: transparent;
        position: relative;
        
        
        .component-card-image{
            background-color: $darkgrey;
        }
        .component-card-name{
            width: 100%;
            text-align: center;
            background-color: rgba(0,0,0,0.5);
            color: white;
            padding: 0px;
        }
    }
}
}
</style>
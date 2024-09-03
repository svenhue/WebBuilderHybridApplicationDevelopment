
<template>
    <q-layout>
    <div class="development-root-component" id="XXX" ref="XXX">
        <LeftDevelopmentOptionsBar 
        ref="leftBar"
        :contextid="viewModel.currentPage.value"
        v-show="showleftBar" 
        @focusView="(view) => viewModel.focusView(view, true)"
        @add-component="(e, type) =>{leftBar.CloseAllTabs(), StartAddNewElement(e, type)}">
            
        </LeftDevelopmentOptionsBar>
        <Teleport :to="'body'">
            <TreePathComponent
        @focus-view="(id) => viewModel.focusView(id, true)">
            
        </TreePathComponent>
            <DeploymentComponent>

            </DeploymentComponent>
        </Teleport>
        <div
     
        class="component-navigation-wrapper"
        >
                <q-btn dense rounded :icon="optionsBar == true ? 'close' : 'menu_open'"  no-caps  @click="optionsBar = !optionsBar"
                    :style="buttonStyle">
                    </q-btn>
                <q-drawer side="right"  v-model="optionsBar" :width="350" no-swipe-close no-swipe-backdrop no-swipe-open >
                  
                    <DevelopmentOptionsDrawer
                    :style="{
                        position: 'absolute',
                    }"
                    @focusView="(view) => viewModel.focusView(view, true)"
                    @updateelement="(values) => viewModel.UpdateFocusedElement(values)"
                    :contextid="viewModel.applicationConfiguration.contextid"
                    :currentElement="viewModel.GetFocussedElement()">
                    </DevelopmentOptionsDrawer>
                </q-drawer>
   
            <div
            class="component-wrapper"
            ref="componentWrapper"
            :id="'developmentcomponent_' + viewModel.applicationConfiguration.contextid"
            @mousemove="(e) => tryFocus(e, false)" 
            @mousedown="(e) => tryFocus(e, true)"
            >
            <ApplicationDevelopmentToolbar :contextid="viewModel.currentPage.value" :route="useRoute()">

            </ApplicationDevelopmentToolbar>
            <div class="app-container">
            <BackgroundFacadeComponent class="appbase"ref="facade" v-if="viewModel.currentPage.value != -1"  id="development-container">
                <template #default>
                    <div :style="{
                        width: '100%',
                        height: '100%',
                       zIndex: 10
                    }">
                        <div
                        v-for="page of viewModel.GetPages().value" :key="page"
                        :style="{
                            width: '100%',
                            height: '100%',
                           
                            display: viewModel.currentPage.value == page ? '' : 'none'
                        }"
                        >
                        
                        <KeepAlive>
                            <ComponentTreeBase
                            v-if="viewModel.currentPage.value == page"
                            :contextid="page"
                            :view="viewModel.GetRootView(page)">

                            </ComponentTreeBase>
                        </KeepAlive>
                        </div>
                    </div>
                </template>
            </BackgroundFacadeComponent>
            <div v-else>
                <div>
                    Oops! Nothing to see here. Please select a page to start developing.
                </div>
            </div>
        </div>
            
       
            </div>
        </div>
        
        <FocussedViewOptionsComponent
        :app-name="viewModel.applicationConfiguration.name">

        </FocussedViewOptionsComponent>

        
        <DevelopmentContextBarComponent
        :contextid="viewModel.currentPage.value"
        :element="viewModel.GetFocussedElement().value"
        @delete-element="() => viewModel.DeleteElement(viewModel.GetFocussedElement().value?.id)"
        :targetId="'development-container'">

        </DevelopmentContextBarComponent>
        <div :id="'developmentcomponent_container' + viewModel?.applicationConfiguration.name">

        </div>
    </div>
</q-layout>
</template>

<script setup lang="ts">   
//@ts-ignore 
import { defineExpose, ref, computed, Ref } from 'vue';
import { useRoute } from 'vue-router'
import { RunTimeVueApplicationViewModel } from '../ViewModels/RuntimeVueApplicationViewModel'
import TreePathComponent from './ApplicationDevelopment/TreePathComponent.vue';
import FocussedViewOptionsComponent from './ApplicationDevelopment/FocussedViewOptionsComponent.vue'
import ApplicationDevelopmentToolbar from './ApplicationDevelopment/ApplicationDevelopmentToolbar.vue'
import { ComponentTreeBase } from 'alphaviewlibrary'
import DevelopmentOptionsDrawer from './DevelopmentOptionsDrawer.vue'
import BackgroundFacadeComponent from './ApplicationDevelopment/BackgroundFacadeComponent.vue';
import LeftDevelopmentOptionsBar from './LeftDevelopmentOptionsBar.vue';
import DevelopmentContextBarComponent from './DevelopmentContextBarComponent.vue';
import { ViewPositioningHelper } from '../utils/Helpers/ViewPositioningHelp';
import DeploymentComponent from '../utils/Features/Deployment/VueComponent/DeploymentComponent.vue';
const showleftBar = ref(true)
const optionsBar = ref(true)
const facade = ref(null)
const leftBar = ref(null)
const route = useRoute()
const XXX = ref<HTMLElement>(null)
const solutionname = route.params.appName

const viewModel = new RunTimeVueApplicationViewModel(solutionname, facade)

const positioningHelper = new ViewPositioningHelper(viewModel)

let newElements = null

function newElementMouseMoveHandler(e: MouseEvent){
    positioningHelper.OnMouseChanged(e, newElements)
}

function StartAddNewElement(e: Event, type: string, values?){
    
    newElements = viewModel.createElement(type, values)
    document.addEventListener('mousemove', newElementMouseMoveHandler)
                document.addEventListener('mouseup', () => {
                    positioningHelper.OnMouseUp(newElements)
                    document.removeEventListener('mousemove', newElementMouseMoveHandler)
                },{
                    once: true
                })
}
function tryFocus(e, fixed = false){
    if(viewModel == undefined){
        return
    }

    if(fixed == true){
        let downTime = true
        document.addEventListener('mouseup', () => {
            downTime = false
        })
        setTimeout(() => {
            if(downTime == true){
                
                positioningHelper.StartRelocatOnMouseDown(e, viewModel.GetFocussedElement().value)

                
            }
        }, 300)
        
    }
    viewModel.tryFocus(e, fixed)
}
const buttonStyle = computed(() => {
    if(optionsBar.value == true){
        return {position:'absolute', zIndex:1001, top:'20px', right:'355px', width:'30px',  height:'30px'}
    }
    else{
        return {position:'absolute', top:'20px', right:'10px', width:'30px', height:'20px', zIndex:1001}
    }
})

const height = computed(() => {
    const el = XXX.value

    if(el == undefined){
        return "80%"
    }
        console.log(el.offsetHeight)
    return el.offsetHeight - 136 + 'px'
})
defineExpose({
       
        deleteFocussedView: () => viewModel.deleteFocussedView()
    })

//todo destory viewmodel on unmount
</script>

<style scoped lang="scss">
.development-root-component{
   
    position: absolute;
    width: 100%;
    height: 100%;
    display:flex;
    
    .component-navigation-wrapper{
        width: 100%;
        height: 100%;
        
        
        .component-wrapper{
            position: relative;
            width: 100%;
            height: 100%;
          
            justify-content: center;
        }
        .app-container{
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            position: absolute;
            width:80%;
            height:v-bind(height);
           

            .appbase{
                position: inherit;
                left: 50%;
                transform: translate(-50%);
                
            
        }
        }
        
    }

}

</style>

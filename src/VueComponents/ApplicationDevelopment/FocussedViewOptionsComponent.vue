<template>
    <div>
        <div >
            <q-expansion-item 
            close
            
            hide-expand-icon
            v-model="isExpanded"
            v-if="focussedView != undefined"
            size dense dense-toggle 
            :style="styleFocussed"  
            class="f-component-options component-options-position"
            header-class="f-component-options-header" 
            
            :label="focussedView?.tag.substring(focussedView?.tag.lastIndexOf(':')+ 1)">
                <q-list dense>
                    <q-item dense 
                    @click="service.SetFocussedView(parent)"
                    v-for=" parent in tree" :key="parent.id">
                        <q-item-section
                        @click="service.SetFocussedView(parent)">
                            <q-item-label>{{ parent.tag.substring(parent.tag.lastIndexOf(':')+ 1) }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-expansion-item>
        </div>

        <div :style="styleHovered" v-if="hoveredView != undefined && showHovered == true" class="f-component-options-hovered" id="focussed-helper">
            <div>
                {{ hoveredView?.tag.substring(hoveredView?.tag.lastIndexOf(':')+ 1)  }}
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { IViewConfiguration, BaseServiceProvider, waitForElm } from 'alphautils';
import { FocussedViewContextService } from '../../utils/Services/Designer/FocussedViewContextService';
import { reactive, watch, ref, computed } from 'vue';


const service = BaseServiceProvider.Service<FocussedViewContextService>('FocussedViewContextService') as FocussedViewContextService

const isExpanded = ref(true);
const showHovered = ref(false); 
const focussedView = service.GetFocussedView();
const hoveredView = service.GetHoveredView();

const tree = computed(() => {
    return service.GetTree(true, 'asc').value
})

const styleFocussed = reactive({
    position: 'absolute',
    left: '0px',
    top: '0px',
    zIndex: 99

})

const styleHovered = reactive({
    position: 'absolute',
    left: '0px',
    top: '0px',
    zIndex: 99,
    display: 'none' // dont needed yet
}) 

watch(focussedView, (newVal) => {
    SetStyle(newVal);
})
watch(hoveredView, (newVal) => {
    SetStyle(newVal, true);
})



function SetStyle(view: IViewConfiguration, hovered = false){

    if(view == undefined){
        //view is undefined when all views of the current viewcontext are deleted
        showHovered.value = false;
        isExpanded.value = false;
        return;
    }
    isExpanded.value = false;

    if(hovered == true && view == undefined){
        showHovered.value = false;
    }
    
    if(hoveredView?.value?.id == focussedView?.value?.id ){
        showHovered.value = false;
    }else  if(hovered == true){
        showHovered.value = true;
        SetPosition(view, true);
        return;
    }

    if(view == undefined){
        return;
    }

   

    SetPosition(view);


}

function SetPosition(view: IViewConfiguration, hovered = false){
    waitForElm(`[data-element="element_${view.id}"]`).then(() => {
        const target = document.querySelector(`[data-element="element_${view.id}"]`);

        if(target == null){
            throw new Error("Target not found");
        }

        const style = hovered ? styleHovered : styleFocussed;

        const clientRect = target.getBoundingClientRect();
        style.left = clientRect.left + 'px';
        //todo: fix this
        style.top = clientRect.top - 45 + 'px';
    })
}

</script>

<style scoped lang="scss">

.component-options-position{
    margin-top: -40px;
}

.f-component-options{
    position: absolute;
    background-color: $primary;
    width: min-content;
    z-index: 99;
    color:white;
    border-radius: 5px;

    .f-component-options-header{
        color:white;
        height:20px
    }
}

.f-component-options-hovered{
    position: absolute;
    background-color: transparent;
    width: min-content;
    height: 20px;
    z-index: 99;
    color:$primary;
    border-radius: 5px;
    padding-bottom: 2px;
    padding-left: 2px;
    padding-right: 2px;

}

</style>



<template>
    <div class="sdec">
        <table>
            <col width="30"><col width="50"><col width="50"><col width="50"><col width="50">

            <tbody>
            <tr >
                <td>
                    Width
                </td>
                <td>
                    <q-input 
                    :style="{left: '22px', top: '40px'}"
                    v-model="styles.width"
                    @update:model-value="(v) => UpdateStyle('style.width', (v + styles.widthUnit))"
                     hide-bottom-space  dense class="spec-input">
                        <template v-slot:append>
                            <q-select dense 
                            v-on:update:model-value="(v) => UpdateStyle('style.width', (styles.width + v))"
                                v-model="styles.widthUnit"
                                :options="styleManager.sizeUnits">
                            </q-select>
                        </template>

                    </q-input>
                </td>
                <td>
                    Height
                </td>
                
                <td>
                    <q-input 
                    :style="{left: '22px', top: '40px'}"
                    v-model="styles.height"
                    color="fontwhite"
                    @update:model-value="(v) => UpdateStyle('style.height', (v + styles.heightUnit))"

                     hide-bottom-space  dense class="spec-input">
                     <template v-slot:append>
                            <q-select dense 
                            @update:model-value="(v) => UpdateStyle('style.height', (styles.height + v))"

                                v-model="styles.heightUnit"
                                :options="styleManager.sizeUnits">
                                </q-select>
                        </template>

                    </q-input>

                </td>
            </tr>

            <tr>
                <td>
                    Min W
                </td>
                <td>
                    <q-input 
                    :style="{left: '22px', top: '40px'}"
                    v-model="styles.minWidth"
                    color="fontwhite"
                    @update:model-value="(v) => UpdateStyle('style.minWidth', (v + styles.minWidthUnit))"
                     hide-bottom-space  dense class="spec-input">
                     <template v-slot:append>
                            <q-select dense 
                            class="sp"
                            @update:model-value="(v) => UpdateStyle('style.minWidth', (styles.minWidth + v))"
                                v-model="styles.minWidthUnit"
                                :options="styleManager.sizeUnits">
                                </q-select>
                        </template>

                    </q-input>
                </td>
                <td>
                    Min H
                </td>

                <td>
                    <q-input 
                    :style="{left: '22px', top: '40px'}"
                    v-model="styles.minHeight"
                    @update:model-value="(v) => UpdateStyle('style.minHeight', (v + styles.minHeightUnit))"
                    color="fontwhite"
                     hide-bottom-space  dense class="spec-input">
                     <template v-slot:append>
                            <q-select dense 
                            @update:model-value="(v) => UpdateStyle('style.minHeight', ( styles.minHeight + v))"
                                v-model="styles.minHeightUnit"
                                :options="styleManager.sizeUnits">
                                </q-select>
                        </template>

                    </q-input>

                </td>
            </tr>
            <tr>
                <td>
                    Max W
                </td>

                <td>
                    <q-input 
                    :style="{left: '22px', top: '40px'}"
                    v-model="styles.maxWidth"
                    color="fontwhite"
                    @update:model-value="(v) => UpdateStyle('style.maxWidth', (v + styles.maxWidthUnit))"
                     hide-bottom-space  dense class="spec-input">
                     <template v-slot:append>
                            <q-select dense 
                            @update:model-value="(v) => UpdateStyle('style.maxWidth', (v + styles.maxWidth))"

                                v-model="styles.maxWidthUnit"
                                :options="styleManager.sizeUnits">
                                </q-select>
                        </template>

                    </q-input>
                </td>

                <td>
                    Max H
                </td>

                <td>
                    <q-input 
                    @update:model-value="(v) => UpdateStyle('style.maxHeight', (v + styles.maxHeightUnit))"
                    :style="{left: '', top: '40px'}"
                    v-model="styles.maxHeight"
                    color="fontwhite"

                     hide-bottom-space  dense class="spec-input">
                     <template v-slot:append>
                            <q-select dense 
                            @update:model-value="(v) => UpdateStyle('style.maxHeight', (styles.maxHeight + v))"
                                v-model="styles.maxWidthUnit"
                                :options="styleManager.sizeUnits">
                                </q-select>
                        </template>

                    </q-input>

                </td>
            </tr>

            <tr>
                <td>
                    Overflow
                </td>

                <td colspan="4"  :style="{justifyContent: 'space-between'}">
                    <div :style="{display: 'inline-flex', width:'100%', justifyContent:'space-evenly'}">
                    <q-btn dense icon="visibility" unelevated 
                    :style="{color: overflowIsVisibility == true ? 'black' : 'white'}"
                        @click="overflowIsVisibility = !overflowIsVisibility ,
                        changeOverflow(overflowIsVisibility == false ? '' : 'visibel')">
                    </q-btn>
                    <q-btn dense icon="visibility_off" unelevated 
                    :style="{color: overflowIsVisibilityOff == true ? 'black' : 'white'}"
                        @click="overflowIsVisibilityOff = !overflowIsVisibilityOff ,
                        changeOverflow(overflowIsVisibilityOff == false ? '' : 'hidden')">
                    </q-btn>
                    <q-btn dense icon="format_line_spacing" unelevated 
                    :style="{color: overflowIsLineSpacing == true ? 'black' : 'white'}"
                        @click="overflowIsLineSpacing = !overflowIsLineSpacing ,
                        changeOverflow(overflowIsLineSpacing == false ? '' : 'scroll')">
                    </q-btn>
                    <q-btn dense label="Auto" unelevated 
                    :style="{color: overflowIsAuto == true ? 'black' : 'white'}"
                        @click="overflowIsAuto = !overflowIsAuto ,
                        changeOverflow(overflowIsAuto == false ? '' : 'auto')">
                    </q-btn>

                    </div>
                  
                </td>
            </tr>
            <tr>
                <td>
                    Fit
                </td>

                <td colspan="3">
                    <q-select dense @update:model-value="(valuee) => emits('updateElement', [{key: 'style.objectFit', value: valuee}])" 
                    v-model="styles.objectFit" :options="styleManager.objectFits">

                    </q-select>
                </td>
            </tr>
        </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, inject } from 'vue';
import { StyleManagerViewModel } from '../../ViewModels/StyleManagerViewModel';
import { ViewConfiguration } from 'alphautils';


const props = defineProps({
    contextid: {
        type: Number,
        required: true
    }
})
const emits = defineEmits(['updateElement'])

const styleManager = inject('styleManager_'+ props.contextid) as StyleManagerViewModel
const overflowIsVisibility = ref(false)
const overflowIsVisibilityOff = ref(false)
const overflowIsLineSpacing = ref(false)
const overflowIsAuto = ref(false)

const styles = reactive({
    width: '',
    height: '',
    minWidth: '',
    minHeight: '',
    maxWidth: '',
    maxHeight: '',
    widthUnit: '-',
    heightUnit: '-',
    minWidthUnit: '-',
    minHeightUnit: '-',
    maxWidthUnit: '-',
    maxHeightUnit: '-',
    objectFit: '',
    overflow: ''
})

function setStylesFromElement(view: ViewConfiguration){

    if(view == undefined){
        return;
    }
    
    styles.width = view?.style?.width?.match(/\d+/) != undefined ? view?.style?.width?.match(/\d+/)[0] : ''
    styles.height = view?.style?.height?.match(/\d+/) != undefined? view?.style?.height?.match(/\d+/)[0] : ''
    styles.minWidth = view?.style?.minWidth?.match(/\d+/) != undefined ? view?.style?.minWidth?.match(/\d+/)[0] : ''
    styles.minHeight = view?.style?.minHeight?.match(/\d+/) != undefined? view?.style?.minHeight?.match(/\d+/)[0] : ''
    styles.maxWidth = view?.style?.maxWidth?.match(/\d+/)  != undefined? view?.style?.maxWidth?.match(/\d+/)[0] : ''
    styles.maxHeight = view?.style?.maxHeight?.match(/\d+/) != undefined? view?.style?.maxHeight?.match(/\d+/)[0] : ''
    styles.widthUnit = view?.style?.width != undefined? view?.style?.width?.replace(/[0-9]/g, "") : ''  
    styles.heightUnit = view?.style?.height  != undefined ? view?.style?.height?.replace(/[0-9]/g, "") : ''
    styles.minWidthUnit = view?.style?.minWidth != undefined? view?.style?.minWidth?.replace(/[0-9]/g, "") : ''
    styles.minHeightUnit = view?.style?.minHeight != undefined? view?.style?.minHeight?.replace(/[0-9]/g, "") : ''
    styles.maxWidthUnit = view?.style?.maxWidth != undefined? view?.style?.maxWidth?.replace(/[0-9]/g, "") : ''
    styles.maxHeightUnit = view?.style?.maxHeight != undefined? view?.style?.maxHeight?.replace(/[0-9]/g, "") : ''
    styles.objectFit = view?.style?.objectFit != undefined? view?.style?.objectFit : ''
    styles.overflow = view?.style?.overflow != undefined? view?.style?.overflow : ''
}
function changeOverflow(value: string){
    switch(value){
        case('visibel'):
            overflowIsVisibility.value = true
            overflowIsVisibilityOff.value = false
            overflowIsLineSpacing.value = false
            overflowIsAuto.value = false
            break;
        case('hidden'):
            overflowIsVisibility.value = false
            overflowIsVisibilityOff.value = true
            overflowIsLineSpacing.value = false
            overflowIsAuto.value = false
            break;
        case('scroll'):
            overflowIsVisibility.value = false
            overflowIsVisibilityOff.value = false
            overflowIsLineSpacing.value = true
            overflowIsAuto.value = false
            break;
        case('auto'):
            overflowIsVisibility.value = false
            overflowIsVisibilityOff.value = false
            overflowIsLineSpacing.value = false
            overflowIsAuto.value = true
            break;
        case(''):
            overflowIsVisibility.value = false
            overflowIsVisibilityOff.value = false
            overflowIsLineSpacing.value = false
            overflowIsAuto.value = false
            break;
    }

    emits('updateElement', [{key:'style.overflow', value: value}])
    styles.overflow = value
}

defineExpose({
    setStylesFromElement
})

function UpdateStyle(key: string, value: string){
    emits('updateElement', [{key: key, value: value}])
}

</script>

<style scoped lang="scss">
 .sdec{
     background-color: $brightgrey;
     .spec-input{
        width: 90px;
        background-color: $darkgrey;
     }
     .sp{
         width: min-content;
     }
 }
</style>
<template>
    <div>

        <q-list dense ref="listRef">
            <q-item dense>
                <q-item-label>
                    Validation Rules
                </q-item-label>
               
                <q-btn dense icon='add' @click='addRule()'></q-btn>

            </q-item>
            <q-item dense
            v-for="rule in rules" :key="rule.rule">
                <q-item-section>
                    {{  rule.name }}
                </q-item-section>

                <q-item-section side>
                    <q-btn dense icon='delete' @click='deleteRule(rule)'></q-btn>
                    <q-btn dense icon='edit' @click='openEditor(rule)'></q-btn>
                </q-item-section>

            </q-item>
        </q-list>
        <EditValidationRuleComponent v-if="showEditor"  @close="showEditor = false" 
        @update-element="handleUpdate"
        :contextid="currentElement.contextid" :rule="model">

        </EditValidationRuleComponent>
 
    </div>
</template>


<script setup lang="ts">
import { IValueValidationViewConfiguration } from 'alphautils'
import { computed, ref, toValue } from 'vue';
import EditValidationRuleComponent from './EditValidationRuleComponent.vue';


const props = defineProps({
    currentElement:{
        type: Object as () => IValueValidationViewConfiguration,
        required: true
    }
})

const emits = defineEmits(['updateElement'])

const showEditor = ref(false)
const model = ref({})
const oldRuleValue = ref({})
const listRef = ref(null)
const rules = computed(() => {
    return props.currentElement?.properties?.rules
})

function addRule(){
    emits('updateElement', [{key: 'properties.rules', value: [...toValue(rules.value), {rule: '', name: '', errorMessage: ''}]}])
}
function handleUpdate(update: object){
    console.log(update)
    if( update.key =='rule'){
        updateElement(update.value, update.rule)
    }else if(update.key == 'name'){
        updateName(update.value, update.rule)
    }else if(update.key == 'errorMessage'){
        updateErrorMessage(update.value, update.rule)
    }
     }
    

function updateElement(rule){
    const oldElement = rules.value.findIndex((r) => r.name == oldRuleValue.value.name && r.rule == oldRuleValue.value.rule)

    const copy = JSON.parse(JSON.stringify(toValue(rules.value))) as Array<object>
        
    copy.splice(oldElement, 1, {rule: rule, name: oldRuleValue.value.name, errorMessage: oldRuleValue.value.updateErrorMessage} )
    emits('updateElement', [{key: 'properties.rules', value: copy}])

    model.value.rule = rule
    oldRuleValue.value.rule = rule
}
function updateErrorMessage(val){
    const oldElement = rules.value.findIndex((r) => r.name == oldRuleValue.value.name && r.rule == oldRuleValue.value.rule)

    if(oldElement == -1) {
        throw new Error('Element not found')
    }

    const copy = JSON.parse(JSON.stringify(toValue(rules.value))) as Array<object>
        
    copy.splice(oldElement, 1, {rule: oldRuleValue.value.rule, name: oldRuleValue.value.name, errorMessage: val} )
    emits('updateElement', [{key: 'properties.rules', value: copy}])
    model.value.errorMessage = val
    oldRuleValue.value.errorMessage = val

}
function openEditor(value){
    oldRuleValue.value = JSON.parse(JSON.stringify(value))
    showEditor.value = true
    model.value = JSON.parse(JSON.stringify(value))
}
function updateName(val){
    const oldElement = rules.value.findIndex((r) => r.name == oldRuleValue.value.name && r.rule == oldRuleValue.value.rule)

    if(oldElement == -1) {
        throw new Error('Element not found')
    }

    const copy = JSON.parse(JSON.stringify(toValue(rules.value))) as Array<object>
        
    copy.splice(oldElement, 1, {rule: oldRuleValue.value.rule, name: val, errorMessage: oldRuleValue.value.errorMessage} )
    emits('updateElement', [{key: 'properties.rules', value: copy}])
    model.value.name = val
    oldRuleValue.value.name = val
}
function deleteRule(value){
    const copy = JSON.parse(JSON.stringify(toValue(rules.value))) as Array<object>
    const index = rules.value.findIndex((r) => r == value)

    if(index == -1) {
        throw new Error('Element not found')
    }
    copy.splice(index, 1)
    emits('updateElement', [{key: 'properties.rules', value: copy}])
    showEditor.value = false
    model.value = {}
    oldRuleValue.value = {}
}
</script>
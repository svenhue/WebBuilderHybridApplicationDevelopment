<template>
    <div>
        <q-checkbox
        label="Unelevated"
        @update:model-value="(val) => $emit('updateElement', [{key: 'appearence.unelevated', value: val}])"
        :model-value="currentElement?.appearence?.unelevated">

        </q-checkbox>
        <q-checkbox
        label="Round"
        @update:model-value="(val) => $emit('updateElement', [{key: 'appearence.round', value: val}])"
        :model-value="currentElement?.appearence?.round">
        </q-checkbox>

    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    currentElement: {
        type: Object as () => IViewConfiguration,
        required: true
    }
})

defineEmits(['updateElement'])

</script>`;
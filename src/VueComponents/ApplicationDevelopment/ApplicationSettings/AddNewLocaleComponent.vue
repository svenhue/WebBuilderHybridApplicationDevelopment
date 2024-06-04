<template>
    <div :style="{zIndex: 9999}">
        <q-btn dense icon="add" @click="show = !show">

        </q-btn>

       
            <q-card v-show="show" :style="{zIndex: 9999}">
                <q-card-section>
                    <q-select  :style="{zIndex: 99999}" v-model="newLocale" label="Locale" :options="locales"></q-select>
                </q-card-section>
                <q-card-actions>
                    <q-btn label="Cancel" :style="{color: 'black'}" @click="show = false"></q-btn>
                    <q-btn label="Add" @click="addLocale" :style="{color: 'black'}"></q-btn>
                </q-card-actions>
            </q-card>
      
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';


const show = ref(false)

const newLocale = ref('')

const emits = defineEmits(['addLocale'])
function addLocale() {
    emits('addLocale', newLocale.value)
    show.value = false
}

const locales = [
    {
        label: 'English',
        value: 'en'
    },
    {
        label: 'Spanish',
        value: 'es'
    },
    {
        label: 'French',
        value: 'fr'
    }
]

</script>

<style lang="scss">

.XXXXXX * {
    z-index: 9999;

}

</style>

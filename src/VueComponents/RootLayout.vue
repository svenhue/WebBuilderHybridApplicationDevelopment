<template>
    <q-layout  :style="{
        minHeight: '100px',

    }">
        <q-header elevated :style="{zIndex: 999, position: 'absolute'}">
            <q-toolbar>
                <q-btn
                flat
                dense
                round
                icon="menu"
                aria-label="Menu"
                @click="toggleLeftDrawer"
                />

                <q-toolbar-title> Web Builder 0.1 </q-toolbar-title>
            </q-toolbar>

            <div :style="{zIndex:'99999', backgroundColor: 'white', color: 'black' }">
                    <q-tabs dense :model-value="tabService.ActiveTab.value.title"  align="left" active-color="primary"
                    
                    @update:model-value="HandleTabChange"
                    indicator-color="primary"          
                narrow-indicator>
                        <q-tab

                        v-for="tab in tabService.GetTabs().value" :key="tab.title"
                        clickable
                        :name="tab.title"
                        :label="tab.title"
                        />
                    </q-tabs>
                </div>

        <CommandPaletteSearchBarComponent
        >

        </CommandPaletteSearchBarComponent>
        </q-header>
       
        
    <q-drawer class="main-drawer" v-model="leftDrawerOpen" bordered overlay>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          @navigate="navigateTo(link)"
        />
      </q-list>
    </q-drawer>
    <q-page-container>
        <q-page :style="{}">  
            <NuxtPage  :contextid="contextid" :keepalive="true"></NuxtPage>
            
        </q-page>
   
    </q-page-container>
   
    </q-layout>
</template>


<script setup lang="ts">
import { BaseServiceProvider, TabService } from 'alphautils';
import '../css/app.scss'
import { ref } from 'vue';
import EssentialLink from './EssentialLink.vue';
import CommandPaletteSearchBarComponent from '../utils/CommandPalette/VueComponents/CommandPaletteSearchBarComponent.vue';

let tabService: TabService;

const props = defineProps({
    contextid: {
        type: Number,
        required:true
    }
})


if(typeof process == 'undefined'){
        tabService = BaseServiceProvider.ServiceWithContext<TabService>('TabService', 1)
       
}else if(process.server == false){
    tabService =BaseServiceProvider.ServiceWithContext<TabService>('TabService', 1)
       
}


async function HandleTabChange(tab){
    if(tab != tabService.ActiveTab.value.title){
        const tabV = tabService.GetTabs().value.find(t => t.title == tab)
        tabService.OpenTab(tabV)
    }
    
}


const leftDrawerOpen = ref(false)

function toggleLeftDrawer(){
    leftDrawerOpen.value = !leftDrawerOpen.value

}

const essentialLinks = [
    {
        title: 'Home',
        icon: 'home',
        to: '/'
    },
    {
        title: 'create Website',
        icon: 'info',
        to: '/createApp'
    },
    {
        title: 'Marketplace',
        icon: 'info',
        to: '/marketplace'
    }
]
</script>
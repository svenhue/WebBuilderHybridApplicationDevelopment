<template>

    <div>
        <q-checkbox :label="'Show Dotted Element Borders'" v-model="service.showDevBorders.value" @update:model-value="(val) => service.ChangeDevBorderSetting(val)">

        </q-checkbox>
    </div>
</template>

<script setup lang="ts">
import { ApplicationDevelopmentSettingsService } from './ApplicationDevelopmentSettingsService';
import { BaseServiceProvider } from 'alphautils';

const service = BaseServiceProvider.ServiceWithContext<ApplicationDevelopmentSettingsService>('ApplicationDevelopmentSettingsService', 0) as ApplicationDevelopmentSettingsService;
</script>
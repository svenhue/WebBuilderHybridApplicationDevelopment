<template>
    <q-btn rounded label="Build" :style="{backgroundColor: 'white'}" unelevated >
        <q-menu>
            <q-card>
                <q-card-section>
                    Staging
                </q-card-section>

                <q-card-actions>
                    <q-btn label="Publish" @click="() => service.Build()">

                    </q-btn>

                    <q-btn label="Download bundle" @click="() => service.Build()">

                    </q-btn>
                </q-card-actions>
            </q-card>
        </q-menu>
    </q-btn>
    

</template>

<script setup lang="ts">
import { ApplicationBuildService } from '../ApplicationBuildService';

const service = new ApplicationBuildService();


</script>
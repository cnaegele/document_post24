<style scoped>
.custom-item {
  font-size: 15px;
}
</style>

<template>
    <v-app-bar
        color="primary"
        prominent
        density="compact"
        app
    >
        <v-toolbar-title>Document indexation</v-toolbar-title>
    

        <v-tooltip text="indexer le document" v-if="lesDatas.file !== null">
            <template v-slot:activator="{ props }">
                <v-btn
                    v-bind="props"
                    icon="mdi-database-arrow-left-outline"
                    @click="demandeSauveData()"
                />
            </template>        
        </v-tooltip>

    
        <v-spacer></v-spacer>
        <div style="position: absolute; right: 16px;">
            <Suspense><UserInformation></UserInformation></Suspense>
        </div>
    </v-app-bar>

</template>

<script setup>
import { data } from '@/stores/data.js'
import { demandeSauveData } from '@/sauve.js'
const lesDatas = data()
</script>
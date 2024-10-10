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
    
        <v-spacer></v-spacer>
        <div style="position: absolute; right: 16px;">
            <Suspense><UserInformation></UserInformation></Suspense>
        </div>
    </v-app-bar>

</template>

<script setup>

</script>
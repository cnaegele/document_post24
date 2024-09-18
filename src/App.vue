<template>
  <v-app>
    <v-main>
      <AppToper />
      <Suspense>
        <DocumentPost
          :sizemax="5000000"
          titre=""
          sujet="" 
        ></DocumentPost>
    </Suspense>
    </v-main>
  </v-app>
</template>

<script setup>
</script>

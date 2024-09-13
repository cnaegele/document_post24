<template>
  <v-app>
    <v-main>
      <Suspense>
        <DocumentPost
          :sizemax="5000000" 
          sujet="le sujet" 
        ></DocumentPost>
    </Suspense>
    </v-main>
  </v-app>
</template>

<script setup>
</script>

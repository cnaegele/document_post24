<template>
    <v-footer height="40" app>
      <div class="text-caption text-disabled">
        Indexation document {{ version }} - {{ dateversion }}
      </div>
  
      <div
        class="text-caption text-disabled"
        style="position: absolute; right: 16px;"
      >
        &copy; 2000-{{ (new Date()).getFullYear() }} <span class="d-none d-sm-inline-block">Goéland</span>
      </div>
    </v-footer>
  </template>
  
  <script setup>
    import { storedatadoc } from '@/stores/data.js'
    const lesDatas = storedatadoc()
    const version = lesDatas.env.version
    const dateversion = lesDatas.env.dateversion
  </script>
  
  <style scoped lang="sass">
    .social-link :deep(.v-icon)
      color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
      text-decoration: none
      transition: .2s ease-in-out
  
      &:hover
        color: rgba(25, 118, 210, 1)
  </style>
 
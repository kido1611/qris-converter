<script setup lang="ts">
useHead({
  htmlAttrs: {
    class: "dark scroll-smooth",
  },
  bodyAttrs: {
    class: "font-plus-jakarta-sans",
  },
});
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

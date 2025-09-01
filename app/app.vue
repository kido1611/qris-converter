<script setup lang="ts">
useHead({
  htmlAttrs: {
    class: "dark scroll-smooth",
    lang: "id",
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

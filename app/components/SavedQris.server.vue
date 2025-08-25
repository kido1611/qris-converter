<script setup lang="ts">
const [DefineSkeletonTemplate, ReuseSkeletonTemplate] =
  createReusableTemplate();
</script>

<template>
  <DefineSkeletonTemplate>
    <div class="ring ring-default p-4 rounded-md">
      <div class="flex flex-row space-x-3">
        <USkeleton class="size-18 lg:size-24 rounded-lg flex-none" />
        <div class="flex flex-col w-full">
          <USkeleton class="h-6" />
          <USkeleton class="h-5 mt-1" />

          <USkeleton class="h-9 w-24 mt-3" />
        </div>
      </div>
    </div>
  </DefineSkeletonTemplate>

  <CardSection title="Riwayat">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ReuseSkeletonTemplate />
      <ReuseSkeletonTemplate />
      <ReuseSkeletonTemplate />
      <ReuseSkeletonTemplate />
    </div>
  </CardSection>
</template>

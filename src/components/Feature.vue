<template>
  <div
    class="flex flex-col h-full p-8 rounded-lg items bg-gray-700"
  >
    <Heading2>
      {{ title }}
    </Heading2>

    <div class="flex flex-col flex-grow">
      <p class="flex-grow text-base leading-relaxed text-gray-300">
        {{ text }}
      </p>
      <a
        :href="url"
        target="_blank"
        class="inline-flex items-center mt-3 text-green-500"
      >
        Learn More
        <MdiArrowRight class="ml-1" />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Feature",
  props: {
    title: { type: String, required: true },
    text: { type: String, required: true },
    url: { type: String, required: true },
  },
});
</script>

<template>
  <span
    class="
      inline-flex
      items-center
      px-3
      py-0.5
      rounded-full
      text-sm
      font-medium
      capitalize
      mx-2
      my-1
    "
    :class="`bg-${tag.color}-100 text-${tag.color}-800`"
  >
    {{ tag.name }}
    <span
      v-if="showOccurrence"
      class="
        text-xs
        h-4
        w-auto
        ml-2
        rounded-full
        p-1
        flex
        items-center
        justify-center
      "
      :class="`bg-${tag.color}-300 text-${tag.color}-900`"
      >{{ tag.occurrence }}</span
    >
  </span>
</template>

<script>
export default {
  props: {
    tag: { type: Object, default: () => {} },
    showOccurrence: { type: Boolean, default: false },
  },
};
</script>

<style></style>

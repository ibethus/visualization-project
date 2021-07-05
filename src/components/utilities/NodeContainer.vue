<template>
  <div
    class="
      bg-white
      h-full
      overflow-hidden
      shadow-md
      rounded-lg
      divide-y divide-gray-200
    "
  >
    <div class="py-5">
      <div class="font-extrabold text-xl">{{ node.name }}</div>
      <div class="font-extrabold text-sm">
        Index: {{ node.index + 1 }} | Depth: {{ node.depth + 2 }}
      </div>
    </div>
    <div class="px-4 py-5 sm:p-6">
      <!-- Content goes here -->
      <Paginator
        :data="node.data"
        :node-coord="{ index: node.id, depth: node.depth, card: card }"
      />
    </div>
  </div>
</template>

<script>
import Paginator from "@/components/utilities/Paginator";

export default {
  props: {
    node: { type: Object, default: () => {} },
    card: { type: Number, default: 0 },
  },
  components: {
    Paginator,
  },
};
</script>

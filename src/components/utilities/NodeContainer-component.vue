<template>
  <div
    class="
      bg-white
      h-auto
      overflow-hidden
      shadow-md
      rounded-lg
      divide-y divide-gray-200
    "
  >
    <div class="py-5">
      <div class="font-extrabold text-xl mb-2">
        <!-- <input type="number" v-model="tagsLimit" /> -->
        <div>{{ node.name }}</div>        
      </div>
      <div class="font-extrabold text-sm">
        Index: {{ node.index + 1 }} | Depth: {{ node.depth + 2 }}
      </div>
    </div>
    <div class="px-4 py-5 sm:p-6">
      <Paginator
        v-if="node"
        :data="getChildrenData(node)"
        :node-coord="{ index: node.id, depth: node.depth, card: card }"
      />
    </div>
  </div>
</template>

<script>
import Paginator from "@/components/utilities/Paginator-component";
import reorder from "@/mixins/reorder.mixin";

export default {
  props: {
    node: { type: Object, default: () => {} },
    card: { type: Number, default: 0 },
  },
  data() {
    return {
      showTags: false,
      tagsLimit: 12,
    };
  },
  mixins: [reorder],
  components: {
    Paginator,
  },
  methods: {
    getChildrenData(node) {
      const data = [];
      if (node.children) {
        node.children.forEach((child) => {
          data.push(...this.getChildrenData(child));
        });
      }
      if (node?.children.length === 0) {
        // console.log(node.data);
        data.unshift(...node.data);
      }
      return data;
    },
  },
  computed: {
    btn() {
      return "inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-gray-700 hover:bg-gray-900 mb-2";
    },
  },
};
</script>

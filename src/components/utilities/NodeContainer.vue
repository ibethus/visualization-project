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
        <button
          type="button"
          v-if="tags.length > tagsLimit"
          @click="showTags = !showTags"
          :class="btn"
          class="mr-4"
        >
          {{ showTags ? "Voir moins de tags" : "Voir tous les tags" }}
        </button>
        <div class="flex flex-shrink-0 flex-wrap justify-evenly">
          <Tag
            v-for="(tag, id) in limitedTags"
            :key="id"
            :tag="tag"
            class="w-auto"
            show-occurrence
          />
        </div>
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
import Paginator from "@/components/utilities/Paginator";
import Tag from "@/components/utilities/Tag";
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
    Tag,
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
    tags() {
      return [
        ...new Set(
          this.getChildrenData(this.node)
            .flatMap((data) => data.tags)
            .map((tag) => {
              return JSON.stringify(tag);
            })
        ),
      ]
        .map((tag) => JSON.parse(tag))
        .sort((a, b) => a.occurrence < b.occurrence);
    },
    limitedTags() {
      return this.tags.slice(
        0,
        this.showTags ? this.tags.length : this.tagsLimit
      );
    },
    btn() {
      return "inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-gray-700 hover:bg-gray-900 mb-2";
    },
  },
};
</script>

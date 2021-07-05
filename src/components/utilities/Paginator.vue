<template>
  <div>
    <div>
      <ul v-if="data.length" class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <draggable
          v-model="data.data"
          group="nodes"
          @start="startDrag($event)"
          @end="endDrag($event)"
        >
          <li v-for="(item, index) in paginated" :key="index">
            <a :href="`images${item.Path}`" target="item.Path">
              <img
                class="object-cover h-32 w-full"
                :src="`images${item.Path}`"
                :alt="item.caption"
                :title="item.caption"
                loading="lazy"
              />
            </a>
          </li>
        </draggable>
      </ul>
    </div>

    <div class="mt-5" v-if="maxpage">
      <span @click="previous" class="cursor-pointer">Prev</span>
      <span v-for="(item, index) in maxpage" :key="index">
        <span
          @click="goto(index + 1)"
          class="mx-2"
          :class="linkClass(index + 1)"
        >
          {{ index + 1 }}
        </span>
      </span>
      <span @click="next" class="cursor-pointer">Next</span>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { EventBus } from "@/helpers/event-bus";
export default {
  components: {
    draggable,
  },
  data() {
    return { current_page: 1, items_per_page: 12, nodeData: [], drag: false };
  },
  props: {
    data: { type: Array, default: () => {} },
    nodeCoord: { type: Object, default: () => {} },
  },
  computed: {
    paginated() {
      return this.data.slice(this.start, this.end);
    },
    start() {
      return (this.current_page - 1) * this.items_per_page;
    },
    end() {
      return this.start + this.items_per_page;
    },
    maxpage() {
      return this.data.length % this.items_per_page;
    },
    linkClass() {
      return (index) => {
        return index === this.current_page
          ? "text-indigo-600 font-bold pointer-event-none cursor-default"
          : "cursor-pointer hover:underline";
      };
    },
  },
  methods: {
    previous() {
      if (this.current_page > 1) this.current_page--;
    },
    next() {
      if (this.current_page < this.maxpage) this.current_page++;
    },
    goto(index) {
      this.current_page = index;
    },
    startDrag() {
      this.drag = true;
      //   EventBus.$emit("start-drag", {
      //     target: from,
      //     newIndex,
      //     oldIndex,
      //     card: this.nodeCoord.card,
      //   });
    },
    endDrag({ oldIndex, newIndex }) {
      this.drag = false;
      EventBus.$emit("end-drag", {
        newIndex,
        oldIndex,
        card: this.nodeCoord.card,
      });
    },
  },
};
</script>

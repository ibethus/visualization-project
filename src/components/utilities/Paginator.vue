<template>
  <div>
    <div>
      <ul>
        <draggable v-model="data.data" group="nodes" @start="startDrag($event)" @end="endDrag($event)"
          class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <li v-for="(item, index) in paginated" :key="index">
            <a :href="`images${item.Path}`" target="item.Path">
              <img class="object-cover h-32 w-full" :src="`images${item.Path}`" :alt="item.caption"
                :title="item.caption" loading="lazy" />
            </a>
          </li>
        </draggable>
      </ul>
    </div>

    <div class="mt-5 flex justify-center items-center" v-if="maxpage > 1">

      <span @click="goto(1)" class="
          text-indigo-600
          hover:text-indigo-400
          cursor-pointer
          flex
          mr-2
          items-center
        "><span><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd" />
          </svg></span>
      </span>
      <span @click="previous" class="
          text-indigo-600
          hover:text-indigo-400
          cursor-pointer
          flex
          mr-2
          items-center
        "><span><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd" /></svg></span>
        Prev
      </span>
      <span v-for="page in pages" :key="page.name" @click="goto(page.name + 1)">
        <span class="mx-2 hover:underline" :class="linkClass(page.name  + 1)">{{ page.name + 1 }}
        </span></span>
      <span @click="next" class="
          text-indigo-600
          hover:text-indigo-400
          cursor-pointer
          flex
          ml-2
          items-center
        ">
        Next
        <span><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd" /></svg></span></span>
      <span @click="goto(maxpage)" class="
          text-indigo-600
          hover:text-indigo-400
          cursor-pointer
          flex
          mr-2
          items-center
        "><span><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clip-rule="evenodd" />
            <path fill-rule="evenodd"
              d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clip-rule="evenodd" />
          </svg></span>
      </span>
    </div>
  </div>
</template>

<script>
  import draggable from "vuedraggable";
  import {
    EventBus
  } from "@/helpers/event-bus";
  export default {
    components: {
      draggable,
    },
    data() {
      return {
        current_page: 1,
        items_per_page: 12,
        nodeData: [],
        drag: false,
        maxVisibleButtons: 5
      };
    },
    props: {
      data: {
        type: Array,
        default: () => {}
      },
      nodeCoord: {
        type: Object,
        default: () => {}
      },
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
        return Math.round(this.data.length / this.items_per_page);
      },
      startPage() {
        // When on the first page
        if (this.current_page === 1 || this.current_page === 2 || this.maxpage <= this.maxVisibleButtons) {
          return 1;
        }
        // When on the last page
        if (this.current_page === this.maxpage) {
          return (this.maxpage-this.maxVisibleButtons <= 0) ? 1 : this.maxpage - this.maxVisibleButtons;
        }
        // When in between
        return (this.current_page-2);
      },
      pages() {
        const range = [];

        for (let i = this.startPage - 1; i <= Math.min(this.startPage + this.maxVisibleButtons - 1, this.maxpage -
            1); i++) {
          range.push({
            name: i,
            isDisabled: i === this.current_page
          });
        }

        return range;
      },
      linkClass() {
        return (index) => {
          return index === this.current_page ?
            "text-indigo-600 font-bold pointer-event-none cursor-default" :
            "cursor-pointer hover:underline";
        };
      }
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
      endDrag({
        oldIndex,
        newIndex
      }) {
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
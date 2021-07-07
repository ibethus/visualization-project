<template>
  <div>
    <a :href="`images${item.Path}`" target="item.Path">
      <img
        class="object-cover h-16 w-16"
        ref="photo"
        :id="index"
        :src="`images${item.Path}`"
        :title="item.caption"
      />
    </a>
    <ModalPhoto :is-open="modal">
      <div class="h-full flex flex-col">
        <div class="h-4/6">
          <img
            class="object-cover h-full w-full"
            :src="`images${modalData.Path}`"
            :alt="modalData.caption"
            :title="modalData.caption"
          />
        </div>
        <div class="h-2/6 mt-6">
          <div class="flex justify-center">
            {{ modalData.caption }}
          </div>
          <div class="flex justify-evenly mt-4 max-w-full">
            <span
              v-for="(tag, id) in modalData.tags"
              :key="id"
              class="
                inline-flex
                items-center
                px-3
                py-0.5
                rounded-full
                text-sm
                font-medium
                capitalize
              "
              :class="`bg-${tag.color}-100 text-${tag.color}-800`"
            >
              {{ tag.name }}
            </span>
          </div>
        </div>
      </div>
    </ModalPhoto>
  </div>
</template>

<script>
import ModalPhoto from "@/components/utilities/ModalPhoto";
export default {
  components: { ModalPhoto },
  props: {
    item: { type: Object, default: () => {} },
    currentPage: { type: Number, default: 1 },
    pageContent: { type: Array, default: () => [] },
    index: { type: Number, default: 0 },
  },
  data() {
    return {
      modal: false,
      modalData: {},
      photo: null,
    };
  },
  methods: {
    createEvents() {
      this.photo?.removeEventListener("mouseenter", () => {}), true;
      this.photo?.removeEventListener("mouseout", () => {}, true);
      this.photo = this.$refs["photo"];
      this.photo.addEventListener("mouseenter", (e) => {
        this.modalData = this.pageContent[e.target.id];
        this.open();
      });
      this.photo.addEventListener("mouseout", () => {
        this.close();
      });
    },
    close() {
      this.modal = false;
    },
    open() {
      this.modal = true;
    },
  },
  watch: {
    currentPage: {
      handler() {
        this.createEvents();
      },
    },
  },
  mounted() {
    this.photo = this.$refs["photo"];
    this.createEvents();
  },
};
</script>

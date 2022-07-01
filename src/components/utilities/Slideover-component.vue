<template>
  <div
    class=" w-full h-full z-50 transform"
    :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="absolute w-full h-full overflow-hidden">
      <transition
        enter-active-class="ease-in-out duration-500"
        enter-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in-out duration-500"
        leave-class="opacity-100"
        leave-to-class="opacity-0"
      >
      </transition>

      <section class="absolute inset-y-0 right-0 w-full flex shadow-xl">
        <transition
          enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
          enter-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
          leave-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div v-show="isOpen" class="w-screen max-w-4xl">
            <div
              class="
                h-full
                flex flex-col
                bg-white
                shadow-xl
                overflow-y-auto
                thin-scrollbar
              "
            >
              <div class="flex-1">
                <!-- Header -->
                

                <div
                  class="
                    py-6
                    space-y-6
                    px-4
                    sm:space-y-0 sm:px-6 sm:py-5 sm:divide-y sm:divide-gray-200
                  "
                >
                  <slot />
                </div>
              </div>
            </div>
          </div>
        </transition>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: Boolean,
    title: String,
  },
};
</script>

<template>
  <div
    class="fixed top-0 right-0 w-4/12 h-full z-50 transform"
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
        <div
          v-show="isOpen"
          class="absolute inset-0 bg-transparent transition-opacity"
          @click="$emit('close-slideover')"
        />
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
                <header
                  class="px-4 py-6 bg-gray-50 border-b border-gray-200 sm:px-6"
                >
                  <div class="flex items-start justify-between space-x-3">
                    <div class="flex items-center">
                      <button
                        aria-label="Revenir en arrière"
                        class="
                          transition
                          ease-in-out
                          duration-150
                          inline-flex
                          items-center
                          px-2.5
                          py-1.5
                          border border-transparent
                          text-sm
                          uppercase
                          font-medium
                          rounded
                          text-white
                          bg-gray-700
                          hover:bg-gray-900
                          mb-2
                        "
                        @click="$emit('close-slideover')"
                      >
                        Close
                      </button>
                      <h2
                        class="
                          text-lg
                          leading-7
                          font-archivo-black
                          text-gray-900
                        "
                      >
                        {{ title }}
                      </h2>
                    </div>
                    <div class="h-7 flex items-center">
                      <button
                        aria-label="Fermer le panneau"
                        class="
                          text-gray-400
                          hover:text-gray-500
                          transition
                          ease-in-out
                          duration-150
                        "
                        @click="$emit('close-slideover')"
                      ></button>
                    </div>
                  </div>
                </header>

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
  name: "Slideover",

  props: {
    isOpen: Boolean,
    title: String,
  },
};
</script>

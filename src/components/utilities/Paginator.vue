<template>
    <div>
        <div>
            <ul class="grid grid-cols-1 md:grid-cols-4 gap-3">
                <li v-for="(item, index) in paginated" :key="index">
                    <a :href="'images' + item.Path" target="item.Path">
                        <img
                            class="object-cover h-32 w-full"
                            :src="'/images' + item.Path"
                            :alt="item.caption"
                            :title="item.caption"
                            loading="lazy"
                        />
                    </a>
                </li>
            </ul>
        </div>

        <div class="mt-5" v-if="maxpage">
            <span @click="previous" class="cursor-pointer">Prev </span>
            <span v-for="(item, index) in maxpage" :key="index"
                ><span
                    @click="goto(index + 1)"
                    class="mx-2 hover:underline"
                    :class="
                        index + 1 === current_page
                            ? 'text-indigo-600 font-bold pointer-event-none'
                            : 'cursor-pointer'
                    "
                    >{{ index + 1 }}
                </span></span
            >
            <span @click="next" class="cursor-pointer"> Next</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return { current_page: 1, items_per_page: 12 };
    },
    props: { data: { type: Array, default: () => {} } },
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
    },
};
</script>

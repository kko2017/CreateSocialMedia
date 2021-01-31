<template>
    <v-container>
        <div>
            <post-card v-for="p in mainPosts" :key="p.id" :post="p" />
        </div>
    </v-container>
    
</template>

<script>
import PostCard from "~/components/PostCard";
export default {
    components: {
        PostCard
    },
    data() {
        return {
            name: 'Nuxt.js',
        };
    },
    computed:  {
        me() {
            return this.$store.state.users.me;
        },
        mainPosts() {
            return this.$store.state.posts.mainPosts;
        },
        hasMorePosts() {
            return this.$store.state.posts.hasMorePosts;
        }
    },
    // fetch({ store }) {
    //     store.dispatch('posts/loadPosts');
    // },
    // fetch will be deprecated in the near future, so advise you to use middleware
    middleware({ store }) {
        store.dispatch('posts/loadPosts');
    },
    mounted() {
        // for your information, window cannot be used in created, but mounted
        window.addEventListener('scroll', this.onScroll);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.onScroll);
    },
    methods: {
        onScroll() {
            if (this.hasMorePosts && (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300)) {
                return this.$store.dispatch('posts/loadPosts');
            }
        }
    }
};
</script>

<style scoped>

</style>
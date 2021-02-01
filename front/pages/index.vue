<template>
    <v-container>
        <post-form v-if="me" />
        <div>
            <post-card v-for="p in mainPosts" :key="p.id" :post="p" />
        </div>
    </v-container>
    
</template>

<script>
import PostCard from "~/components/PostCard";
import PostForm from "~/components/PostForm";
export default {
    components: {
        PostCard,
        PostForm
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
    fetch({ store }) {
        // dispatch is promise so you should input return prior to it. If not, Nuxt is highly likely not to wait the result of the dispatch.
        return store.dispatch('posts/loadPosts', { reset: true });
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
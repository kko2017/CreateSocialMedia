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
                this.$store.dispatch('posts/loadPosts');
            }
        }
    }
};
</script>

<style scoped>

</style>
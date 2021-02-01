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
        PostCard,
    },
    data() {
        return {
            name: 'Nuxt.js',
        };
    },
    computed:  {
        mainPosts() {
            return this.$store.state.posts.mainPosts;
        },
    },
    fetch({store, params}) {
        return store.dispatch('posts/loadHashtagPosts', {
            hashtag: encodeURIComponent(params.id),
            reset: true,
        });
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
                return this.$store.dispatch('posts/loadUserPosts');
            }
        }
    }
};
</script>

<style scoped>

</style>
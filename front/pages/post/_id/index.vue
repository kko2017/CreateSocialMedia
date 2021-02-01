<template>
    <v-container v-if="post">
        <post-card :post="post" />
    </v-container>
    <div v-else>
        That post doesn't exist.
    </div>
</template>
<script>
import PostCard from '~/components/PostCard'

export default {
    components: {
        PostCard,
    },
    computed: {
        post() {
            return this.$store.state.posts.mainPosts.find(v => v.id === parseInt(this.$route.params.id, 10));
        }
    },
    fetch({ store, params }) {
        return store.dispatch('posts/loadPost', params.id);
    }
}
</script>
<style scoped>

</style>
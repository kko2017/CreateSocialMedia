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
    },
    head() {
        return {
            title: `${this.post.User.nickname} Post`,
            meta: [{
                hid: 'description', name: 'description', content: this.post.content,
            }, {
                hid: 'ogtitle', name: 'og:title', content: `${this.post.User.nickname} post`,            
            }, {
                hid: 'ogdesc', name: 'og:description', content: this.post.content,
            }, {
                hid: 'ogimg', property: 'og:image', content: this.post.Images[0] ? this.post.Images[0].src : '',
            }, {
                hid: 'ogurl', property: 'og:url', content: `https://localhost:3080/post/${this.post.id}`,
            }],
        }
    }
}
</script>
<style scoped>

</style>
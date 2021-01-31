<template>
    <div style="margin-bottom: 20px">
        <v-card >
            <post-images :images="post.Images || []" />
            <v-card-title>
                <h3>
                    <nuxt-link :to="'/user/' + post.id">{{ post.User.nickname }}</nuxt-link>
                </h3>
            </v-card-title>
            <v-card-text>
                <div>
                    <h3>{{ post.User.nickname }}</h3>
                    <div>{{ post.content }}</div>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn text color="orange">
                    <v-icon>mdi-twitter-retweet</v-icon>
                </v-btn>
                <v-btn text color="orange" @click="onClickHeart">
                    <v-icon>{{ heartIcon }}</v-icon>
                </v-btn>
                <v-btn text color="orange" @click="onToggleComment">
                    <v-icon>mdi-comment-outline</v-icon>
                </v-btn>
                <v-menu offset-y open-on-hover>
                    <template v-slot:activator="{ on }" >
                        <v-btn text color="orange" v-on="on" >
                            <v-icon>mdi-dots-horizontal</v-icon>
                        </v-btn>
                    </template>
                    <div style="background: white;">
                        <v-btn dark color="red" @click="onRemovePost">Delete</v-btn>
                        <v-btn dark color="orange" @click="onEditPost">Edit</v-btn>
                    </div>
                </v-menu>
            </v-card-actions>
        </v-card>
        <template v-if="commentOpened">
            <comment-form :post-id="post.id" />
            <v-list>
                <v-list-item v-for="c in post.Comments" :key="c.id" >
                    <v-list-item-avatar color="teal">
                        <span>{{ c.User.nickname[0] }}</span>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ c.User.nickname }}</v-list-item-title>
                        <v-list-item-subtitle>{{ c.content }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </template>
    </div>
</template>
<script>
import CommentForm from "~/components/CommentForm";
import PostImages from "~/components/PostImages";

export default {
    components: {
        CommentForm,
        PostImages
    },
    props: {
        post: {
            type: Object,
            required: true,

        }
    },
    data() {
        return {
            commentOpened: false,
        };
    },
    computed: {
        me() {
            return this.$store.state.users.me;
        },
        liked() {
            return !!(this.post.Likers || []).find(v => v.id === (this.me && this.me.id));
        },
        heartIcon() {
            console.log('liked', this.liked);
            return this.liked ? 'mdi-heart' : 'mdi-heart-outline';
        }
    },
    methods: {
        onRemovePost() {
            return this.$store.dispatch('posts/remove', {
                postId: this.post.id,
            });
        },
        onEditPost() {

        },
        onToggleComment() {
            if(!this.commentOpened) {
                this.$store.dispatch('posts/loadComments', {
                    postId: this.post.id,
                })
                .then(()=>{
                    this.commentOpened = !this.commentOpened;
                });
            } else {
                this.commentOpened = !this.commentOpened;
            }
        },
        onRetweet() {
            if (!this.me) {
                return alert('Sign In please');
            }
            return this.$store.dispatch('posts/retweet', {
                postId: this.post.id,
            });
        },
        onClickHeart() {
            if (!this.me) {
                return alert('Sign In please');
            }
            if (this.liked) {
                return this.$store.dispatch('posts/unlikePost', {
                    postId: this.post.id,

                });
            }
            return this.$store.dispatch('posts/likePost', {
                postId: this.post.id,

            });
        }
    }
}
</script>
<style scoped>
a {
    color: inherit;
    text-decoration: none;
}
</style>
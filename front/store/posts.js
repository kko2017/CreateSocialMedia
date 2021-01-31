import Vue from 'vue';
import throttle from 'lodash.throttle';

export const state = () => ({
    mainPosts: [],
    hasMorePosts: true,
    imagePaths: [],
});

const totalPosts = 51;
const limit = 10;

export const mutations = {
    addMainPost(state, payload) {
        // state.mainPosts.push(payload);
        state.mainPosts.unshift(payload);
        state.imagePaths = [];
    },
    removeMainPost(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        state.mainPosts.splice(index, 1);
    },
    addComment(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        state.mainPosts[index].Comments.unshift(payload);
    },
    loadComments(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        // state.mainPosts[index].Comments = payload;
        Vue.set(state.mainPosts[index], 'Comments', payload.data);
    },
    loadPosts(state, payload) {
        if (payload.reset) {
            state.mainPosts = payload.data;        
        } else {
            state.mainPosts = state.mainPosts.concat(payload.data);
        }
        state.hasMorePosts = payload.data.length === limit;
    },
    concatImagePaths(state, payload) {
        state.imagePaths = state.imagePaths.concat(payload);
    },
    removeImagePaths(state, payload) {
        state.imagePaths.splice(payload, 1);
    },
    unlikePost(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        const likerIndex = state.mainPosts[index].Likers.findIndex(v => v.id === payload.userId);
        state.mainPosts[index].Likers.splice(likerIndex, 1);
    },
    likePost(state, payload) {
        console.log('state mainPost', state.ma)
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        state.mainPosts[index].Likers.push({
            id: payload.userId,
        });
    }
};

export const actions = {
    add({ commit, state }, payload) {
        this.$axios.post('/post', {
            content: payload.content,
            image: state.imagePaths,
        }, {
            withCredentials: true,
        })
            .then((res) => {
                console.log(res.data);
                commit('addMainPost', res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    },
    remove({ commit }, payload) {
        this.$axios.delete(`/post/${payload.postId}`, { //delete method doesn't have body. Only two params exist
            withCredentials: true,
        })
            .then(() => {
                commit('removeMainPost', payload);
            })
            .catch((err) => {
                console.error(err);
            });
    },
    addComment({ commit }, payload) {
        this.$axios.post(`/post/${payload.postId}/comment`, {
            content: payload.content,
        }, {
            withCredentials: true,
        })
            .then((res) => {
                console.log(res.data);
                commit('addComment', res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    },
    loadComments({ commit }, payload) {
        this.$axios.get(`/post/${payload.postId}/comments`)
            .then((res) => {
                console.log(res.data);
                commit('loadComments', res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    },
    loadPosts: throttle(async function({ commit, state }, payload) {
        try {
            if (payload && payload.reset) {
                const res = await this.$axios.get(`/posts?limit=${limit}`);
                commit('loadPosts', {
                data: res.data,
                reset: true,
                });
                return;
            }
            if (state.hasMorePosts) {
                const lastPost = state.mainPosts[state.mainPosts.length - 1];
                const res = await this.$axios.get(`/posts?lastId=${lastPost && lastPost.id}&limit=${limit}`)
                console.log(res.data);
                commit('loadPosts', {
                    data: res.data
                });
                return;
            }
        } catch (err) {
            console.error(err);
        }
    }, 2000),
    uploadImages({ commit }, payload) {
        this.$axios.post('/post/images', payload, {
            withCredentials: true,
        })
            .then((res) => {
                console.log(res.data);
                commit('concatImagePaths', res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    },
    retweet({ commit }, payload) {
        this.$axios.post(`/post/${payload.postId}/retweet`, {}, {
            withCredentials: true,
        })
            .then((res) => {
                console.log(res.data);
                commit('addMainPost', res.data);
            })
            .catch((err) => {
                console.error(err);
                alert(err.response.data);
            });
    },
    likePost({ commit }, payload) {
        this.$axios.post(`/post/${payload.postId}/like`, {}, {
            withCredentials: true,
        })
            .then((res) => {
                console.log(res.data);
                commit('likePost', {
                    userId: res.data.userId,
                    postId: payload.postId
                });
            })
            .catch((err) => {
                console.error(err);
            });
    },
    unlikePost({ commit }, payload) {
        this.$axios.delete(`/post/${payload.postId}/like`, {
            withCredentials: true,
        })
            .then((res) => {
                console.log(res.data);
                commit('unlikePost', {
                    userId: res.data.userId,
                    postId: payload.postId
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }
};
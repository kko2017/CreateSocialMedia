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
        state.mainPosts[index].Comments = payload;
    },
    loadPosts(state, payload) {
        state.mainPosts = state.mainPosts.concat(payload);
        state.hasMorePosts = payload.length === limit;
    },
    concatImagePaths(state, payload) {
        state.imagePaths = state.imagePaths.concat(payload);
    },
    removeImagePaths(state, payload) {
        state.imagePaths.splice(payload, 1);
    }
};

export const actions = {
    add({ commit, state }, payload) {
        this.$axios.post('http://localhost:3085/post', {
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
                console.log(err);
            });
    },
    remove({ commit }, payload) {
        this.$axios.delete(`http://localhost:3085/post/${payload.postId}`, { //delete method doesn't have body. Only two params exist
            withCredentials: true,
        })
            .then(() => {
                commit('removeMainPost', payload);
            })
            .catch((err) => {
                console.log(err);
            });
    },
    addComment({ commit }, payload) {
        this.$axios.post(`http://localhost:3085/post/${payload.postId}/comment`, {
            content: payload.content,
        }, {
            withCredentials: true,
        })
            .then((res) => {
                console.log(res.data);
                commit('addComment', res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    },
    loadComments({ commit }, payload) {
        this.$axios.get(`http://localhost:3085/post/${payload.postId}/comments`)
            .then((res) => {
                console.log(res.data);
                commit('loadComments', res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    },
    loadPosts({ commit, state }, payload) {
        if (state.hasMorePosts) {
            this.$axios.get(`http://localhost:3085/posts?offset=${state.mainPosts.length}&limit=10`)
                .then((res) => {
                    console.log(res.data);
                    commit('loadPosts', res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    },
    uploadImages({ commit }, payload) {
        this.$axios.post('http://localhost:3085/post/images', payload, {
            withCredentials: true,
        })
            .then((res) => {
                console.log(res.data);
                commit('concatImagePaths', res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
};
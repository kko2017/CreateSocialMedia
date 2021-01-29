export const state = () => ({
    mainPosts: [],
    hasMorePosts: true,
});

const totalPosts = 51;
const limit = 10;

export const mutations = {
    addMainPost(state, payload) {
        // state.mainPosts.push(payload);
        state.mainPosts.unshift(payload);
    },
    removeMainPost(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.id);
        state.mainPosts.splice(index, 1);
    },
    addComment(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        state.mainPosts[index].Comments.unshift(payload);

    },
    loadPosts(state) {
        const diff = totalPosts - state.mainPosts.length;
        const fakePosts = Array(diff > limit ? limit : diff).fill().map(v => ({
            id: Math.random().toString(),
            User: {
                id: 1,
                nickname: 'FifthOh'
            },
            content: `Apply infinite scrolling - ${Math.random()}`,
            Comments: [],
            Images: []
        }));
        state.mainPosts = state.mainPosts.concat(fakePosts);
        state.hasMorePosts = fakePosts.length === limit;
    }
};

export const actions = {
    add({ commit }, payload) {
        // 서버에 게시글 등록 요청 보냄
        commit('addMainPost', payload);
    },
    remove({ commit }, payload) {
        commit('removeMainPost', payload);
    },
    addComment({ commit }, payload) {
        commit('addComment', payload);
    },
    loadPosts({ commit, state }, payload) {
        if (state.hasMorePosts) {
            commit('loadPosts');
        }
    }
};
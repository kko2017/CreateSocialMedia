export const state = () => ({
    me: null,
    followingList: [
        {
            id: 1,
            nickname: 'Hetika'
        },
        {
            id: 2,
            nickname: 'GilDong'
        },
        {
            id: 3,
            nickname: 'Amelia'
        },
    ],
    followerList: [
        {
            id: 1,
            nickname: 'Devin'
        },
        {
            id: 2,
            nickname: 'Frank'
        },
        {
            id: 3,
            nickname: 'Cam'
        },
    ]
});

// unable to use asyncronous processing in Mutations. Only use it for syncronous processing 
export const mutations = {
    setMe(state, payload) {
        state.me = payload;
    },
    changeNickname(state, payload) {
        state.me.nickname = payload.nickname;
    },
    addFollowing(state, payload) {
        state.followingList.push(payload);
    },
    addFollower(state, payload) {
        state.followerList.push(payload);
    },
    removeFollowing(state, payload) {
        const index = state.followingList.findIndex(v => v.id === payload.id);
        state.followingList.splice(index, 1);
    },
    removeFollower(state, payload) {
        const index = state.followerList.findIndex(v => v.id === payload.id);
        state.followerList.splice(index, 1);
    }
};

// able to use both syncronous and asyncronous processing in Actions
export const actions = {
    // Context is an object storing { commit, dispatch, state, rootState, getters, rootGetters }
    // commit comes from mutations, dispatch comes from actions...
    // signUp(context, payload) {
    //     commit('setMe', payload);
    // },
    // 가급적이면 스테이트를 여기서 바꾸는 것보다 뮤테이션을 이용해서 바꾸는게 낫다. 뮤테이션이 있다면...
    signUp({ commit, dispatch, state, rootState, getters, rootGetters }, payload) {
        commit('setMe', payload);
    },
    singIn({ commit }, payload) {
        commit('setMe', payload);
    },
    logOut({ commit }, payload) {
        commit('setMe', null);
    },
    changeNickname({ commit }, payload) {
        commit('changeNickname', payload);
    },
    addFollowing({ commit }, payload) {
        commit('addFollowing', payload);   
    },
    addFollower({ commit }, payload) {
        commit('addFollower', payload);
    },
    removeFollowing({ commit }, payload) {
        commit('removeFollowing', payload);
    },
    removeFollower({ commit }, payload) {
        commit('removeFollower', payload);
    }
};
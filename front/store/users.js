export const state = () => ({
    me: null,
    followingList: [],
    followerList: [],
    hasMoreFollowings: true,
    hasMoreFollowers: true
});

const totalFollowers = 8;
const totalFollowings = 6;
const limit = 3;
const nicknames = ['Amelia', 'Hetika', 'Joel', 'Isabella', 'Kevin', 'Devin', 'Hyun', 'Matt', 'Loura', 'Tony'];

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
    },
    loadFollowings(state) {
        const diff = totalFollowings - state.followingList.length;
        const fakeUsers = Array(diff > limit ? limit : diff).fill().map(v => ({
            id: Math.random().toString(),
            nickname: nicknames[Math.floor(Math.random() * 10)]
        }));
        state.followingList = state.followingList.concat(fakeUsers);
        state.hasMoreFollowings = fakeUsers.length === limit;
    },
    loadFollowers(state) {
        const diff = totalFollowers - state.followerList.length;
        const fakeUsers = Array(diff > limit ? limit : diff).fill().map(v => ({
            id: Math.random().toString(),
            nickname: nicknames[Math.floor(Math.random() * 10)]
        }));
        state.followerList = state.followerList.concat(fakeUsers);
        state.hasMoreFollowers = fakeUsers.length === limit;
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

    loadUser({ commit }) {
        this.$axios.get('http://localhost:3085/user', {}, {
            withCredentials: true,
        })
            .then((res) => {
                console.log(res.data);
                commit('setMe', res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    },
    signUp({ commit, dispatch, state, rootState, getters, rootGetters }, payload) {
        this.$axios.post('http://localhost:3085/user', {
            email: payload.email,
            nickname: payload.nickname,
            password: payload.password,
        }, {
            withCredentials: true,
        })
            .then((res) => {
                console.log(res.data);
                commit('setMe', res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    },
    singIn({ commit }, payload) {
        this.$axios.post('http://localhost:3085/user/signin', {
            email: payload.email,
            password: payload.password
        }, {
            withCredentials: true,
        })
            .then((res) => {
                console.log(res.data);
                commit('setMe', res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    },
    logOut({ commit }, payload) {
        this.$axios.post('http://localhost:3085/user/logout', {}, {
            withCredentials: true,
        })
            .then((res) => {
                console.log(res.data);
                commit('setMe', null);
            })
            .catch((err) => {
                console.error(err);
            });

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
    },
    loadFollowings({ commit, state }, payload) {
        if (state.hasMoreFollowings) {
            commit('loadFollowings');
        }
    },
    loadFollowers({ commit, state }, payload) {
        if (state.hasMoreFollowers) {
            commit('loadFollowers');
        }
    }
};
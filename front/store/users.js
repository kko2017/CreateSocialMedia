export const state = () => ({
    me: null,
    followingList: [],
    followerList: [],
    hasMoreFollowings: true,
    hasMoreFollowers: true
});

const limit = 3;

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
        let index = state.me.Followings.findIndex(v => v.id === payload.userId);
        state.me.Followings.splice(index, 1);
        index = state.followingList.findIndex(v => v.id === payload.userId);
        state.followingList.splice(index, 1);
    },
    removeFollower(state, payload) {
        let index = state.me.Followers.findIndex(v => v.id === payload.id);
        state.me.Followers.splice(index, 1);
        index = state.followerList.findIndex(v => v.id === payload.id);
        state.followerList.splice(index, 1);
    },
    loadFollowings(state, payload) {
        if (payload.reset) {
            state.followingList = payload.data;
        } else {
            state.followingList = state.followingList.concat(payload.data);
        }
        state.hasMoreFollowings = payload.data.length === limit;
    },
    loadFollowers(state, payload) {
        if (payload.reset) {
            state.followerList = payload.data;        
        } else {
            state.followerList = state.followerList.concat(payload.data);
        }
        state.hasMoreFollowers = payload.data.length === limit;
    },
    following(state, payload) {
        state.me.Followings.push({ id: payload.userId });
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

    async loadUser({ commit }) {
        try {
            const res = await this.$axios.get('/user', {
                withCredentials: true,
            });
            console.log(res.data);
            commit('setMe', res.data);
        } catch (err) {
            console.error(err);
        }
    },
    signUp({ commit, dispatch, state, rootState, getters, rootGetters }, payload) {
        this.$axios.post('/user', {
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
        this.$axios.post('/user/signin', {
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
        this.$axios.post('/user/logout', {}, {
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
        this.$axios.patch('user/nickname', {
            nickname: payload.nickname
        }, {
            withCredentials: true,
        })
            .then(() => {
            commit('changeNickname', payload);
            })
            .catch((err) => {
                console.error(err);
            });
    },
    addFollowing({ commit }, payload) {
        commit('addFollowing', payload);   
    },
    addFollower({ commit }, payload) {
        commit('addFollower', payload);
    },
    loadFollowings({ commit, state }, payload) {
        if (!(payload && payload.reset) && !state.hasMoreFollowings) {
            return;
        }

        let url = '';
        let lastId = '';
        let reset = false;
        if (payload && payload.reset) {
            url = `/user/${state.me.id}/followings?limit=${limit}`;
            reset = payload.reset;
        } else if (state.hasMoreFollowings) {
            lastId = state.followingList[state.followingList.length - 1];
            url = `/user/${state.me.id}/followings?limit=${limit}&lastId=${lastId && lastId.id}`;
        }
        return this.$axios.get(url, {
            withCredentials: true,
        })
            .then((res) => {
                console.log('res.data', res.data);
                commit('loadFollowings', {
                    data: res.data,
                    reset,
                });
            })
            .catch((err) => {
                console.error(err);
            });
    },
    loadFollowers({ commit, state }, payload) {
        if (!(payload && payload.reset) && !state.hasMoreFollowers) {
            return;
        }

        let url = '';
        let lastId = '';
        let reset = false;
        if (payload && payload.reset) {
            url = `/user/${state.me.id}/followers?limit=${limit}`;
            reset = payload.reset;
        } else if (state.hasMoreFollowers) {
            lastId = state.followerList[state.followerList.length - 1];
            url = `/user/${state.me.id}/followers?limit=${limit}&lastId=${lastId && lastId.id}`;
        }
        return this.$axios.get(url, {
            withCredentials: true,
        })
            .then((res) => {
                commit('loadFollowers', {
                    data: res.data,
                    reset,
                });
            })
            .catch((err) => {
                console.error(err);
            });
    },
    follow({ commit }, payload) {
        this.$axios.post(`/user/${payload.userId}/follow`, {}, {
            withCredentials: true
        })
            .then((res) =>  {
                commit('following', { userId: payload.userId });
            }).catch((err) => {
                console.error(err);
            });
    },
    unfollow({ commit }, payload) {
        this.$axios.delete(`/user/${payload.userId}/follow`, {
          withCredentials: true
        })
            .then((res) =>  {
                commit('removeFollowing', { userId: payload.userId });
            }).catch((err) => {
                console.error(err);
            });
    },
    removeFollower({ commit }, payload) {
        this.$axios.delete(`/user/${payload.userId}/follower`, {
          withCredentials: true
        })
            .then((res) =>  {
                commit('removeFollower', { userId: payload.userId });
            }).catch((err) => {
                console.error(err);
            });
    },
};
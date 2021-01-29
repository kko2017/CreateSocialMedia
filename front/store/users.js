export const state = () => ({
    me: null,
});

// unable to use asyncronous processing in Mutations. Only use it for syncronous processing 
export const mutations = {
    setMe(state, payload) {
        state.me = payload;
    },
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

};
export const state = () => ({});

export const mutations = {};

export const actions = {
    // Keep signing in even after refreshing a page
    nuxtServerInit({ commit, dispatch, state }, { req }) {
        // dispatch is promise so you should input return prior to it. If not, Nuxt is highly likely not to wait the result of the dispatch.
        return dispatch('users/loadUser');      
    }
};


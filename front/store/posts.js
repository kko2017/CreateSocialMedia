export const state = () => ({
    name: 'posts',
});

export const mutations = {
    bye(state) {
        state.name = 'good bye posts';
    }
};
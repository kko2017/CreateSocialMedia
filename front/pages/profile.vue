<template>
    <div>
        <v-container>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>My Profile</v-subheader>
                    <v-form ref="form" v-model="valid" @submit.prevent="onChangeNickname">
                        <v-text-field
                            v-model="nickname"
                            :rules="nicknameRules"
                            label="Nickname"
                            required
                        />
                        <v-btn dark color="blue" type="submit">Edit</v-btn>
                    </v-form>
                </v-container>
            </v-card>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>Following</v-subheader>
                    <follow-list :users="followingList" :remove="removeFollowing" />
                    <v-btn 
                        v-if="hasMoreFollowings" 
                        dark 
                        color="blue" 
                        style="width: 100%" 
                        @click="loadMoreFollowings"
                    >More followings</v-btn>
                </v-container>
            </v-card>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>Follower</v-subheader>
                    <follow-list :users="followerList" :remove="removeFollower" />
                    <v-btn 
                        v-if="hasMoreFollowers" 
                        dark 
                        color="blue" 
                        style="width: 100%" 
                        @click="loadMoreFollowers"
                    >More followers</v-btn>
                </v-container>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import FollowList from "~/components/FollowList";

export default {
    components: {
        FollowList,
    },
    data() {
        return {
            valid: false,
            nickname: '',
            nicknameRules: [
                v => !!v || 'Nickname is required'
            ]
        };
    },
    computed: {
        followingList() {
            return this.$store.state.users.followingList;
        },
        followerList() {
            return this.$store.state.users.followerList;
        },
        hasMoreFollowings() {
            return this.$store.state.users.hasMoreFollowings;
        },
        hasMoreFollowers() {
            return this.$store.state.users.hasMoreFollowers;
        }
    },
    fetch({ store }) {
        return Promise.all([
            store.dispatch('users/loadFollowings', { reset: true }),
            store.dispatch('users/loadFollowers', { reset: true }),
        ]); 
    },
    middleware: 'authenticated',
    methods:{
        onChangeNickname() {
            return this.$store.dispatch('users/changeNickname', {
                nickname: this.nickname
            });
        },
        removeFollowing(userId) {
            return this.$store.dispatch('users/unfollow', { userId });
        },
        removeFollower(userId) {
            return this.$store.dispatch('users/removeFollower', { userId });
        },
        loadMoreFollowings() {
            return this.$store.dispatch('users/loadFollowings');
        },
        loadMoreFollowers() {
            return this.$store.dispatch('users/loadFollowers');
        }
    },
    head() {
        return {
            title: 'Profile',
        };
    },    
};
</script>

<style scoped>

</style>
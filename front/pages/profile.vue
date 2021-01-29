<template>
    <div>
        <v-container>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>My Profile</v-subheader>
                    <v-form ref="form" v-model="valid" @submit.prevent="onChangeNickname">
                        <v-text-field
                            v-model='nickname'
                            :rules="nicknameRules"
                            label="Nickname"
                            required
                        />
                        <v-btn color="blue" type="submit">Edit</v-btn>
                    </v-form>
                </v-container>
            </v-card>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>Following</v-subheader>
                    <follow-list :users="followingList" :remove="removeFollowing" />
                </v-container>
            </v-card>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>Follower</v-subheader>
                    <follow-list :users="followerList" :remove="removeFollower" />
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
        }
    },
    methods:{
        onChangeNickname() {
            this.$store.dispatch('users/changeNickname', {
                nickname: this.nickname
            });
        },
        removeFollowing(id) {
            this.$store.dispatch('users/removeFollowing', { id });
        },
        removeFollower(id) {
            this.$store.dispatch('users/removeFollower', { id });
        },
    },
    head() {
        return {
            title: 'Profile',
        };
    },
    middleware: 'authenticated',    
};
</script>

<style scoped>

</style>
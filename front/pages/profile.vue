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
                    <follow-list />
                </v-container>
            </v-card>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>Follower</v-subheader>
                    <follow-list />
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
    methods:{
        onChangeNickname() {
            this.$store.dispatch('users/changeNickname', {
                nickname: this.nickname
            });
        }
    },
    head() {
        return {
            title: 'Profile',
        };
    }    
};
</script>

<style scoped>

</style>
<template>
    <v-container v-if="!me">
        <v-card>
            <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
                <v-container>
                    <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="Email"
                        type="email"
                        required 
                    />
                    <v-text-field
                        v-model="password"
                        :rules="passwordRules"
                        label="Password"
                        type="password"
                    />
                    <v-btn color="green" type="submit" :disabled="!valid">Sign In</v-btn>
                    <v-btn color="light-grey" nuxt to="/signup">Sign Up</v-btn>
                </v-container>
            </v-form>
        </v-card>
    </v-container>
    <v-container v-else>
        <v-card>
            Welcome, {{ me.nickname }}
            <v-btn @click="onLogOut">Logout</v-btn>
        </v-card>
    </v-container>
</template>
<script>
export default {
    data() {
        return {
            valid: false,
            email: '',
            password: '',
            emailRules: [
                v => !!v || 'Email is required.',
                v => /.+@.+/.test(v) || 'Email is not valid.',
            ],
            passwordRules: [
                v => !!v || "Password is required.",
            ]
        };
    },
    computed: {
        me() {
            return this.$store.state.users.me;
        },
    },
    methods: {
        onSubmitForm() {
            if(this.$refs.form.validate()){
                this.$store.dispatch('users/singIn', {
                    email: this.email,
                    nickname: 'Test'
                });
            }
        },
        onLogOut() {
            this.$store.dispatch('users/logOut');
        }
    }
}
</script>
<style>

</style>
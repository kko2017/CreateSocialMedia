<template>
    <div>
        <v-container>
            <v-card>
                <v-container>
                    <v-subheader>Sign Up</v-subheader>
                    <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
                        <v-text-field
                            v-model="email"
                            label="Email"
                            type="email"
                            :rules="emailRules"
                            required
                        />
                        <v-text-field
                            v-model="password" 
                            label="Password"
                            type="password"
                            :rules="passwordRules"
                            required
                        />
                        <v-text-field
                            v-model="passwordCheck" 
                            label="Confirm Password"
                            type="password"
                            :rules="passwordCheckRules"
                            required
                        />
                        <v-text-field
                            v-model="nickname" 
                            label="Nickname"
                            type="nickname"
                            :rules="nicknameRules"
                            required
                        />
                        <v-checkbox
                            v-model="terms"
                            :rules="termsRules"
                            label="I promise my loyalty to ChitChatSM"
                            required
                        />
                        <v-btn color="green" type="submit" :disabled="!valid">Sign In</v-btn>
                    </v-form>
                </v-container>
            </v-card>
        </v-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
            valid: false,
            email: '',
            password: '',
            passwordCheck: '',
            nickname: '',
            terms: false,
            emailRules: [
                v => !!v || 'Email is required.',
                v => /.+@.+/.test(v) || 'Email is not valid.',
            ],
            passwordRules: [
                v => !!v || 'Password is required.',
            ],
            passwordCheckRules: [
                v => !!v || 'Password check is required.',
                v => v === this.password || 'This is not same with Password.',
            ],
            nicknameRules: [
                v => !!v || 'Nickname is required.',
            ],
            termsRules: [
                v => !!v || 'You must agree this.',
            ],
        };
    },
    methods: {
        onSubmitForm(){
            this.$refs.form.validate();
            console.log(this.valid);
        }
    },
    head() {
        return {
            title: 'Sign Up',
        };
    }    
}
</script>

<style scoped>

</style>
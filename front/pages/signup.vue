<template>
    <div>
        <v-container>
            <v-card>
                <v-container>
                    <v-subheader>Sign Up</v-subheader>
                    <v-form>
                        <v-text-field 
                            label="Email"
                            type="email"
                            required
                        />
                        <v-text-field 
                            label="Password"
                            type="password"
                            required
                        />
                        <v-text-field 
                            label="Confirm Password"
                            type="password"
                            required
                        />
                        <v-text-field 
                            label="Nickname"
                            type="nickname"
                            required
                        />
                        <v-checkbox 
                            required
                            label="I promise my loyalty to ChitChatSM"
                        />
                        <v-btn color="green" type="submit">Sign In</v-btn>
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
            name: 'Nuxt.js',
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
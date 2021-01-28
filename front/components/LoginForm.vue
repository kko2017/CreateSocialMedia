<template>
    <v-container>
        <v-card>
            <v-form>
                <v-container>
                    <v-text-field
                        label="Email"
                        type="email"
                        required 
                    />
                    <v-text-field 
                        label="Password"
                        type="password"
                    />
                    <v-btn color="green" type="submit">Sign In</v-btn>
                    <v-btn color="light-grey" nuxt to="/signup">Sign Up</v-btn>
                </v-container>
            </v-form>
        </v-card>
    </v-container>
</template>
<script>
export default {
    
}
</script>
<style>

</style>
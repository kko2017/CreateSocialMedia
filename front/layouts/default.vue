<template>
    <v-app>
        <div>
            <v-toolbar dark color="green">
                <v-toolbar-title>
                    <nuxt-linke to="/">ChitChatSM</nuxt-linke>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-text-field label="Search" hide-details prepend-icon="mdi-magnify" :style="{ display: 'flex', alignItems: 'center'}" />
                    <v-btn text nuxt to="/profile">
                        <div>Profile</div>
                    </v-btn>
                    <v-btn text nuxt to="/signup">
                        <div>Sign Up</div>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
        </div>
    </v-app>
</template>

<script>
export default {
}
</script>

<style scoped>

</style>
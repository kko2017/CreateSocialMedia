<template>
    <v-app>
        <nav>
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
        </nav>
        <v-row>
            <v-col cols="12" md="4">
                login window
            </v-col>
            <v-col cols="12" md="8">
                <nuxt />
            </v-col>
        </v-row>
    </v-app>
</template>

<script>
export default {
}
</script>

<style scoped>

</style>
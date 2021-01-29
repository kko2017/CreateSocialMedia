<template>
    <v-card style="margin-bottom: 20px;">
        <v-container>
            <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
                <v-textarea
                    v-model="content"
                    outlined
                    auto-grow
                    clearable
                    label="Share your awesome moments!!"
                    :hide-details="hideDetails"
                    :success-messages="successMessages"
                    :success="success"
                    :rules="[v => !!v.trim() || 'Input your story.']"
                    @input="onChangeTextarea"
                />
                <v-btn type="submit" color="green" absolute right>ChitChat</v-btn>
                <v-btn>Image Upload</v-btn>
            </v-form>
        </v-container>
    </v-card>    

</template>
<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            valid: false,
            content: '',
            hideDetails: false,
            successMessages: '',
            success: false
        };
    },
    computed: {
        ...mapState('users', ['me']),
    },
    methods: {
        onChangeTextarea(value) {
            if (value) {
                this.hideDetails = true;
                this.success = false;
                this.successMessages = '';
            }
        },
        onSubmitForm() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('posts/add', {
                    content: this.content,
                    User: {
                        nickname: this.me.nickname
                    },
                    Comments: [],
                    Images: [],
                    id: Date.now(),
                    createdAt: Date.now()
                })
                .then(() => {
                    this.content = '';
                    this.hideDetails = false;
                    this.success = true;
                    this.successMessages = 'Post Success.';
                })
                .catch(() => {

                });
            }
        }
    }
}
</script>
<style scoped>

</style>
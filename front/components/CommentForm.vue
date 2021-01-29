<template>
    <v-form ref="form" v-model="valid" style="position: relative" @submit.prevent="onSubmitForm">
        <v-textarea 
            v-model="content"
            filled
            auto-grow
            label="Add comment"
            :hidden-details="hiddenDetails"
            :success="success"
            :success-messages="successMessages"
            @input="onChangeTextarea"
        />
        <v-btn color="green" dark absolute top right type="submit">comment</v-btn>
    </v-form>  
</template>
<script>
export default {
    props: {
        postId: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            valid: false,
            content:'',
            hiddenDetails: true,
            success: false,
            successMessages: ''
        }
    },
    computed: {
        me() {
            return this.$store.state.users.me; 
        },
    },
    methods: {
        onChangeTextarea(value) {
            if (value.length) {
                this.hiddenDetails = true;
                this.success = false;
                this.successMessages = '';
            }
        },
        onSubmitForm() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('posts/addComment', {
                    id: Date.now(),
                    postId: this.postId,
                    content: this.content,
                    User: {
                        nickname: this.me.nickname,
                    }
                })
                .then(() => {
                    this.content = '';
                    this.success = true;
                    this.successMessages = 'Comment Success';
                    this.hiddenDetails  = false;
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
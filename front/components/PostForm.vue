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
                <input ref="imageInput" type="file" multiple hidden @change="onChnageImages">
                <v-btn type="button" @click="onClickImageUpload">Image Upload</v-btn>
                <div>
                    <div v-for="(p, i) in imagePaths" :key="p" style="display: inline-block">
                        <img :src="`http://localhost:3085/${p}`" :alt="p" style="width: 200px">
                        <div>
                            <button type="button" @click="onRemoveImage(i)">remove</button>
                        </div>
                    </div>
                </div>
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
        ...mapState('posts', ['imagePaths'])
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
                })
                .then(() => {
                    this.content = '';
                    this.hideDetails = false;
                    this.success = true;
                    this.successMessages = 'Post Success.';
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        },
        onClickImageUpload() {
            this.$refs.imageInput.click();
        },
        onChnageImages(e) {
            console.log(e.target.files);
            const imageFormData= new FormData();
            [].forEach.call(e.target.files, (f) => {
                imageFormData.append('image', f); // {image: [file1, file2 ...]}
            });
            this.$store.dispatch('posts/uploadImages', imageFormData);
        },
        onRemoveImage(index) {
            this.$store.commit('posts/removeImagePaths', index);
        }
    }
}
</script>
<style scoped>

</style>
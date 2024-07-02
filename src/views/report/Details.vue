<template>
   <div class="mx-auto border border-gray-300 rounded-lg p-3" >
        <div class="d-flex justify-content-between">
            <button class="btn btn-sm text-center" title="Conversations" @click="showConversation()" :disabled="!details.length <= 0"><i class="fa-regular fa-envelope" style="font-size:25px"></i></button>
            <h4>Report</h4>
            <div>
                <button v-if="isNotResolved" class="btn btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-ellipsis" style="font-size:25px"></i></button>
                <ul class="dropdown-menu">
                    <li><button class="dropdown-item" type="button"  @click="updateStatus">Resolved</button></li>
                </ul>
            </div>
   
        </div>
        <div class="mb-2">
            <label for="type" class="form-label">Type </label>
            <Input type="text" readonly v-model="details.report_type"></Input>
        </div>
        <div class="mb-2" v-if="isAccountType">
            <label for="email" class="form-label">Email </label>
            <Input type="text" readonly v-model="details.email"></Input>
        </div>
        <div class="mb-2">
            <label for="title" class="form-label">Title </label>
            <Input type="text" readonly v-model="details.title"></Input>
        </div>
        <div class="mb-2">
          <label for="password" class="form-label">Description </label>
          <TextArea v-model="details.description" readonly></TextArea>
        </div>
        <div class="mb-2">  
            <label for="" class="me-2">Uploaded Images</label>
            <button type="button" v-if="images.length" class="btn btn-sm" @click="show" title="Preview Images"><CIcon :icon="cilMagnifyingGlass" /></button>
            <span v-else class="fw-bold">No Uploaded Images</span>
            <viewer :images="images" @inited="inited" class="viewer" ref="viewer" :options="viewerOptions">
              <template #default="scope">
                <img v-for="src in scope.images" :src="src" :key="src" style="display:none !important"/>
              </template>
            </viewer>
        </div>
        <reply :id="details.id"> </reply>
        <conversations   :replies="replies" :id="details.id"/>
    </div>
</template>

<script>
import { cilMagnifyingGlass, cilEnvelopeClosed } from '@coreui/icons';
import formatter  from '@/helpers/formatter/transform.js';
import Input from '@/components/Form/Input.vue'
import apiClient from '@/helpers/http/api-client.js';
import TextArea from '@/components/Form/TextArea.vue'
import { component as Viewer } from "v-viewer"
import { viewerOptions } from './viewerConfig.js';
import conversations from './components/conversations.vue';
import { checkValidity  } from '@/helpers/validation/vuelidate.js';
import { useVuelidate } from '@vuelidate/core'
import reply from './components/reply.vue';
import { sweetAlertNotification } from  '@/helpers/notification/sweetAlert.js';
    export default {
        setup () {
            return { v$: useVuelidate({ $autoDirty : true, $lazy: true}) }
        },
        components:{
            Input,
            TextArea,
            Viewer,
            conversations,
            reply
        },
        data(){
            return{
                cilMagnifyingGlass,cilEnvelopeClosed,
                viewerOptions:viewerOptions,
                images:[],
                details:{},
                replies:[]
            }
        },
        
        computed:{
            isAccountType() {
                return this.details.type && this.details.type.account;
            },
            isNotResolved() {
                return !this.details.resolved_at;
            },
        },

        async created(){
            await this.getData();
        },

        mounted() {
        },
        methods:{
            inited (viewer) {
                this.$viewer = viewer
            },

            show () {
                this.$viewer.show()
            },
            
            formatData(data){
                return {
                    ...data,
                    read_at: formatter.formatReadableDateTime(data.read_at),
                    resolved_at: formatter.formatReadableDateTime(data.resolved_at),
                    report_type: data.type.name,
                }
            },

            getAttachments(attachments){
                const images = attachments.map((attachment) => import.meta.env.VITE_APP_API_URL + attachment.url);
                this.images = images
            },

            checkInputValidity(parentProperty = null, dataProperty, validations = []) {
                return checkValidity(this.v$, parentProperty, dataProperty, validations);
            },

            async getData(){
                const response = await apiClient.get(`/api/reports/${this.$route.params.uuid}`)
                if(response.status == 200){
                    const { data } = response.data;
                    const formattedData = this.formatData(data);
                    if(formattedData.attachments.length > 0){
                        this.getAttachments(formattedData.attachments);
                    }
                    this.details = formattedData;
                }
            },

            async updateStatus(){
                try {
                    const response = await apiClient.put(`/api/reports/update-status/${this.details.id}`, null);
                    if(response.status == 200){
                        const formattedData = this.formatData(response.data.data);
                        if(formattedData.attachments.length > 0){
                            this.getAttachments(formattedData.attachments);
                        }
                        this.details = formattedData;
                        sweetAlertNotification("Report resolved", "", "success");
                    }
                } catch (error) {
                    console.error(error,'error')                    
                }
             
            },

            formatConversation(data){
                return {
                    ...data,
                    created_at: formatter.formatReadableDateTime(data.created_at)
                }
            },

            async getConversations(){
                try {
                    const response = await apiClient.get(`/api/reports/replies`, {params:{ reportId: this.details.id} })
                    if(response.status == 200){
                        const { replies } = response.data;
                        this.replies = replies.map(reply => this.formatConversation(reply));
                    }
                } catch (error) {
                    
                }
            },

            async showConversation(){
                const response = await this.getConversations();
                const modal_id = document.getElementById("report-conversation-modal");
                const modal = bootstrap.Modal.getOrCreateInstance(modal_id);
                modal.show();
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>
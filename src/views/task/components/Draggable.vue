<template>
  <div class="flex m-10">
    <div class="w-1/2">
      <draggable class="dragArea list-group" :list="list" :group="group">
        <div class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center" v-for="(element, index) in list" :key="element.id">
          <div class="d-flex justify-content-between">
            <p>{{ element.name }}</p>
              <div>
                <span class="btn btn-sm me-1"  @click="$emit('editItem', element, index, Itemkey)" title="Edit Task"><CIcon :icon="cilPen" /></span>
                <span class="btn btn-sm" @click="deleteTask(element.id)"> <CIcon :icon="cilTrash" /></span>
                <span class="btn btn-sm" v-if="Itemkey == 'ongoing'" @click="markAsCompleted(element.id)"  title="Mark as completed"><CIcon :icon="cilCheckCircle" /></span>
              </div>
          </div>
          <div class="d-flex justify-content-between">
            <span>Description : {{ element.description }}</span>
            <span>Due Date : {{ element.due_date }}</span>
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import { cilTrash, cilPen, cilCheckCircle } from '@coreui/icons';
import { defineComponent } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { sweetAlertNotification, sweetAlertConfirmation } from '@/helpers/notification/sweetAlert.js';
import axios from 'axios';
export default defineComponent({
  props:{
      list:{
          type:[Object, Array],
          required: true
      },
      Itemkey:String,
      group:String,
      withButtons:{
        type:Boolean,
        default:false
      },
      item_index:{
        type:Number,
      }
  },
  components: {
    draggable: VueDraggableNext,
  },
  data() {
    return {
      cilTrash,
      cilPen,
      cilCheckCircle,
      data:[]
    }
  },
  methods:{
    async deleteTask(id){
      if(this.Itemkey == 'ongoing'){
        const result = await sweetAlertConfirmation({
          allowOutsideClick:false,
          allowEscapeKey:false,
        })
        
        if (result.isConfirmed) {
          this.delete(id)
          sweetAlertNotification("Task Successfully Deleted", '', 'success', { timer:2000, toast:true, position: "bottom-end", timerProgressBar: true,})
        } else if (result.isDenied) {
          sweetAlertNotification("Changes are not saved", '', 'info')
        }
      }else{
        this.delete(id);    
        sweetAlertNotification("Task Successfully Deleted", '', 'success', { timer:2000, toast:true, position: "bottom-end", timerProgressBar: true,})
      }
      
    },
    
    async markAsCompleted(id){
      const result = await sweetAlertConfirmation({
        allowOutsideClick:false,
        allowEscapeKey:false,
      },"Mark this task as completed?");
      if (result.isConfirmed) {
        this.updateStatus(id)
        sweetAlertNotification("Task Successfully Completed", '', 'success', { timer:2000, toast:true, position: "bottom-end", timerProgressBar: true,})
      } else if (result.isDenied) {
        sweetAlertNotification("Changes are not saved", '', 'info')
      }
    },

    async delete(id){
      await axios.delete(`/api/tasks/${id}`).then((response) => {
          const index = this.data.findIndex(item => item.id === id);
          if (index !== -1) {
              this.data.splice(index, 1);
          }
        }).catch((error) =>{
        })
    },

    async updateStatus(id){
      await axios.post('/api/tasks/update-status',{id:id, status:2}).then((response) =>{
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
          const task = this.data.splice(index, 1);
          this.$emit('updateCompletedTasks', response.data.data)
        }
      }).catch((err) =>{
      });
    },

    async edit(id){
      await axios.put(`/api/tasks/${id}`).then((response) => {
          
        }).catch((error) =>{
        })
    }
  },
  watch: {
    list: {
      handler(tasks, oldValue) {
        this.data = tasks;
      },
    },
  }
})
</script>
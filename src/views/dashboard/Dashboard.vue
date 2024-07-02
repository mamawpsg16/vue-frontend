<template>
  <div>
    <CRow class="mb-4">
      <CCol :sm="6">
        <CWidgetStatsC
          :value="active_users"
          :progress="{ color: 'info', value:100}"
          title="Active Users"
          >
          <template #icon><i class="fa-solid fa-users" style="font-size:36px"></i></template>
          <!-- <template #title>Visitors</template> -->
        </CWidgetStatsC>
      </CCol>
      <CCol :sm="6">
        <CWidgetStatsC
        :value="banned_users"
        title="Banned Users"
        :progress="{ color: 'info', value:100}"
        >
          <template #icon><i class="fa-solid fa-user-lock" style="font-size:36px;"></i></template>
        </CWidgetStatsC>
      </CCol>
    </CRow>
    <div class="row mb-4">
      <div class="col-md-6 mb-4">
        <div class="card">
          <section class="d-flex justify-content-between align-items-center">
            <div class="flex-grow-1 d-flex justify-content-center my-2">
              <h4 class="text-uppercase fw-semibold text-body-secondary text-center">TASKS</h4>
            </div>
            <router-link :to="{name:'tasks'}" target="_blank" class="btn" title="View Tasks"><i class="fa-solid fa-eye"></i></router-link>
          </section>
          <div class="card-body">
            <template v-if="!isLoading && isTaskEmpty">
              <h1 class="text-center">No Tasks Found </h1>
            </template>
            <template v-else>
              <Doughnut v-if="!isLoading" :data="data" :options="options" style="width:400px; height:400px" />
            </template>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <section class="d-flex justify-content-between align-items-center my-2">
            <div class="flex-grow-1 d-flex justify-content-center">
              <h4 class="text-uppercase fw-semibold text-body-secondary text-center">REPORTS</h4>
            </div>
            <router-link :to="{name:'report'}" target="_blank" class="btn" title="View Reports"><i class="fa-solid fa-eye"></i></router-link>
          </section>
          <div class="card-body">
            <template v-if="!isLoading && isReportEmpty">
              <h1 class="text-center">No Reports Found </h1>
            </template>
            <template v-else>
              <Doughnut v-if="!isLoading" :data="reportData" :options="options" style="width:400px; height:400px" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import { CWidgetStatsC } from '@coreui/vue'
import apiClient  from '@/helpers/http/api-client.js';
ChartJS.register(ArcElement, Tooltip, Legend)
  export default {
    name: 'Dashboard',
    components: {
      Doughnut,
      CWidgetStatsC
    },

    data() {
      return {
        active_users: 0,
        banned_users: 0,
        data: {
          labels: ['Pending', 'Ongoing', 'Completed'],
          datasets: [
            {
              backgroundColor: ['#FE0230', '#00FFFF', '#7AE81F'],
              data: []
            }
          ]
        },
        reportData: {
          labels: ['Pending', 'Reviewing', 'Resolved'],
          datasets: [
            {
              backgroundColor: ['#FE0230', '#00FFFF', '#7AE81F'],
              data: []
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        },
        isLoading:false,
        defaultCount:[0, 1, 2]
      }
    },
    
    async created() {
      await this.getUsersReportDetails();
      await this.getReportMonitoringDetails();
      await this.getTaskCompletion();
    },

    computed:{
      isTaskEmpty() {
        return this.data.datasets[0].data.every((data) => data == 0);
      },

      isReportEmpty() {
        return this.reportData.datasets[0].data.every((data) => data == 0);
      }
    },

    methods:{
      transformData(data){
        const newData = this.defaultCount.reduce((obj, _, index) => {
          const status = index;
          obj[status] = data.find(details =>  details.status  === status) ?.count || 0;
          return obj;
        }, {});
        return Object.values(newData)
      },

      async getTaskCompletion(){
        this.isLoading = true;
        try {
          const response =    await apiClient.get('/api/tasks-status');
          if(response.status == 200){
            this.data.datasets[0].data = Object.values(response.data);
            this.isLoading = false;
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          
        }
      },
      
      async getUsersReportDetails(){
        this.isLoading = true;
        try {
          const response =    await apiClient.get('/api/get-dashboard-users');
          if(response.status == 200){
            const { active_users, banned_users }  = response.data;
            this.active_users = active_users;
            this.banned_users = banned_users;
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          
        }
      },

      async getReportMonitoringDetails(){
        this.isLoading = true;
        try {
          const response =    await apiClient.get('/api/get-dashboard-reports');
          if(response.status == 200){
            this.reportData.datasets[0].data = Object.values(response.data);
            
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          
        }
      }
    },
    mounted(){
    },
  }
  </script>

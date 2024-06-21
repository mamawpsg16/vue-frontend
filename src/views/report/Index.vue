<template>
  <div>
    <VueGoodTable :columns="columns" :tableActionHeader="true" :rows="data" ref="vueGoodTable" >
        <template #table-action-content>
            <div class="d-flex justify-content-center align-items-center border border-dark-subtle rounded" title="Actions">
                <button class="btn btn-sm" type="button" @click="getData(true)"><CIcon :icon="cilLoopCircular" /></button>
                <button class="btn btn-sm" type="button" @click="showFilter"><CIcon :icon="cilFilter" /></button>
            </div>
        </template>
        <template #content="{ row, column, index, formattedRow }">
        <span v-if="column.field == 'action'" class="d-flex justify-content-center">
            <router-link :to="{ name:'report-details', params:{uuid:row.uuid} }" @click="read(row.uuid, index)" :data='`report-${index}`' class="btn btn-sm" title="View Report"><i :class="`fa-solid ${!row.read_at ? 'fa-eye' : 'fa-eye-slash'} action`"></i></router-link>
          <button class="btn btn-sm" type="button" @click= "read(row.id, index)" :data='`report-${index}`'></button>
        </span>
        <span v-else>
            {{row[column.field]}}
        </span>
        </template>
    </VueGoodTable>
  </div>
  <filterModal @load-filtered-users="loadFilteredUsers" :isResetClicked="filterReset"/>
</template>

<script>
import { cilLoopCircular, cilFilter, cilCloudDownload } from '@coreui/icons';
import VueGoodTable from '@/components/VueGoodTable/index.vue';
import formatter  from '@/helpers/formatter/transform.js';
import apiClient from '@/helpers/http/api-client.js';
import { sweetAlertNotification, sweetAlertConfirmation, SwalDefault } from '@/helpers/notification/sweetAlert.js';
import filterModal from './components/filter.vue';
import exporter from '@/helpers/export/index.js';
import { customDeepClone } from '@/helpers/clone/index.js';
    export default {
        name:'Users Index',
        components: {
            VueGoodTable,
            filterModal
        },
        data() {
            return {
                cilLoopCircular,
                cilFilter,
                cilCloudDownload,
                columns: [
                    {
                        label: 'Action',
                        field: 'action',
                        width: '130px',
                    },
                    {
                        label: 'Type',
                        field: 'report_type',
                        width: '200px',
                    },
                    {
                        label: 'Email Address',
                        field: 'email',
                        width: '200px',
                    },
                    {
                        label: 'Subject',
                        field: 'title',
                        width: '200px',
                    },
                    {
                        label: 'Description',
                        field: 'description',
                        width: '200px',
                    },
                    {
                        label: 'Created At',
                        field: 'created_at',
                        width: '230px',
                    },
                    {
                        label: 'Last Updated',
                        field: 'updated_at',
                        width: '230px',
                    },
                ],
                data: [],
                filterReset:false
            }
        },
        created(){
            this.getData();  
        },
        methods:{
            calculateBanDetails(bannedAt, banDuration) {
                // Convert bannedAt to a Date object
                const start = new Date(bannedAt);

                // create a new date based in start variable
                const end = new Date(start);

                // set end date to start date + banDuration which is casts as integer 
                end.setDate(start.getDate() + parseInt(banDuration));
                // Get today's date
                const today = new Date();
               
                // Calculate the remaining days until the ban ends
                const remainingDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

                return {
                    banEndDate: end.toISOString().split('T')[0],
                    banEndDateToSql: end,
                    remainingDays: remainingDays > 0 ? remainingDays : 0,
                };
            },

            formatData(data){
                return {
                    ...data,
                    title: formatter.capitalizeFirstLetter(data.title), 
                    report_type: formatter.capitalizeFirstLetter(data.report_type), 
                    created_at: formatter.formatReadableDateTime(data.created_at), 
                    updated_at: formatter.formatReadableDateTime(data.updated_at), 
                }
            },  

            async getData(reset = false) {
                try {
                    const response = await apiClient.get('/api/reports');
                    if(response.status == 200){
                        if(reset){
                            this.filterReset = true;
                        }
                        const { data } = response?.data;
                        this.data = data.map(details => this.formatData(details));
                    }
                } catch (error) {
                    console.error(error);
                }
            },

            async banDetails(row, index){
               if(!row.banned_at){
                    this.banUser(row, index);
                    return
               }
               this.banConfirmation(row, index)
            },


            showFilter(){
                const element = document.querySelector('#user-filter-modal');
                const modal = bootstrap.Modal.getOrCreateInstance(element);
                modal.show();
            },

            loadFilteredUsers(data){
                this.filterReset = false;
                this.data = data.map(details => this.formatData(details));
            },

            exportSheet(data, headers){
                const fileName = `USERS_${formatter.formatNumericDateTime(new Date())}`;
                exporter.toCsv(data, headers, 'Users', fileName)
            },

            exportPdf(data, headers){
                exporter.toPdf(data, headers)
            },

            handleExport(type){
                if(!this.data.length){
                    sweetAlertNotification("No available data to export", "", "info");
                    return;
                }
                const columns = this.columns.filter(column => column.label !== 'Action');
                const clonedColumns = customDeepClone(columns);
                const headers = clonedColumns.map(column => column.label);
                const fields  = clonedColumns.map(column => column.field);
                const clonedData = customDeepClone(this.data);  
                const data = formatter.extractFieldsFromObjects(fields, clonedData)
                if(type == 'sheet'){
                    this.exportSheet(data, headers)
                }else{
                    this.exportPdf(data, headers);
                }
            },

            async read(uuid, index){
                const readIcon = 'fa-eye-slash';
                const unreadIcon = 'fa-eye';
                const iconElement  = document.querySelector(`a[data="report-${index}"] > i`);
                iconElement.classList.remove(unreadIcon)
                iconElement.classList.add(readIcon)
                await apiClient.put(`/api/reports/mark-as-read/${uuid}`);
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>
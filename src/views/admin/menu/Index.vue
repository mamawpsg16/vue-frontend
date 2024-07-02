<template>
  <div class="row">
    <div class="col-6">
      <NestedDraggable v-if="list.length" :list="list"/>
    </div>
  </div>
</template>

<script>
import NestedDraggable from './components/NestedDraggable.vue';
  export default {
    components:{
      NestedDraggable
    },
    data(){
      return{
        list: [
          { id: 1, name: 'Parent 1', children: [{ id: 11, name: 'Child 1-1', children:[] }, { id: 12, name: 'Child 1-2', children:[] }] },
          { id: 2, name: 'Parent 2', children: [{ id: 21, name: 'Child 2-1', children:[] }, { id: 22, name: 'Child 2-2', children:[] }] },
        ],
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

<template>
  <draggable class="dragArea" tag="ul" :list="list" :group="{ name: 'g1' }">
    <li v-for="el in list" :key="el.name">
      <p class="item-name">{{ el.name }}</p>
      <nested-draggable :list="el.children" />
    </li>
  </draggable>
</template>

<script>
import { VueDraggableNext } from 'vue-draggable-next'
export default {
  name: 'nested-draggable',
  components: {
    draggable: VueDraggableNext,
  },
  props: {
    list: {
      required: true,
      type: Array,
      default: []
    }
  },
}
</script>
<style scoped>
ul,
li {
  text-decoration: none;
  list-style-type: none;
}

.dragArea {
  /* min-height: 30px; */
  /* border: 1px solid black; */
  /* border-radius: 5px; */
  margin-top: 10px;
  /* color: var(--cui-list-group-color); */
}

.item-name {
  font-weight: bold;
  color: var(--cui-list-group-color);
  text-decoration: none;
  /* Remove text decoration */
  border: 1px solid black;
  margin-top: 10px;
  padding: 10px;
}

.drag-item:hover {
  background-color: #f1f1f1;
}

.nested-list {
  margin-top: 10px;
  padding-left: 20px;
}
</style>
export default {
  template: `
    <ul style="list-style-type: none;margin: 0;padding: 0;">
     <li v-for="item in items" :key="item.id" v-on:click="$emit('update:selected-item', item)" style="cursor:pointer">
      <slot name="itemtemplate" v-bind:item="item">{{item}}</slot>
     </li>
    </ul>
  `,
  props: {
    selectedItem: Object,
    items: Array
  }
}
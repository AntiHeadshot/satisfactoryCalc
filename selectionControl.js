export default {
    template: `
    <div>
    <div v-bind:style="{width:width+'px', display: 'flex', flexWrap: 'wrap', marginRight: '12px'}">
     <div v-for="item in items" :key="item.id" v-on:click="$emit('update:selected-item', item)" style="cursor:pointer;">
      <slot name="itemtemplate" v-bind:item="item">{{item}}</slot>
     </div>
    </div>
    </div>
  `,
    props: {
        selectedItem: Object,
        items: Array,
        width: Number
    }
}
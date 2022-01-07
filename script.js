import SelectionControl from './selectionControl.js';

Vue.component('SelectionControl', SelectionControl);

function getImage(name) { return "images/icons/" + name.replaceAll(' ', '_') + ".webp"; }

async function loadData() {
    var stations = {};
    var items = {};

    var response = await fetch('data.json');
    var data = await response.json();

    for (var station of data.stations) {
        station.image = getImage(station.name);
        stations[station.id] = station;
    }

    for (var item of data.items) {
        item.image = getImage(item.name);
        items[item.id] = item;
    }

    var recipeId = 0;
    for (var recipe of data.recipes) {
        recipe.id = recipeId++;
        recipe.station = stations[recipe.station];
        var resultsById = {};
        for (var result of recipe.results) {
            items[result.item].recipe = recipe;
            resultsById[result.item] = result.count;
        }
        recipe.results = resultsById;
        var componentsById = {};
        for (var component of recipe.components) {
            componentsById[component.item] = component.count;
        }
        recipe.components = componentsById;
    }

    var itemsSorted = [];

    for (var item of data.items)
        itemsSorted.push(item);
    items = itemsSorted;

    return items;
}

Vue.filter('round', (value, decimals) => {
    if (!value) {
        value = 0;
    }

    if (!decimals) {
        decimals = 0;
    }

    value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    return value;
});

Vue.component('satisfactory-item', {
    template: '#item-template',
    props: {
        items: Array,
        item: Object,
        count: Number,
        showRecipe: Boolean
    }
});

Vue.component('satisfactory-recipe', {
    template: '#recipe-template',
    props: {
        items: Array,
        recipe: Object,
        item: Object,
        count: Number
    }
});

Vue.component('satisfactory-recipe-sum', {
    template: '#recipe-sum-template',
    props: {
        item: Object,
        count: Number
    },
    data: function() {
        return {
            components: {}
        };
    },
    methods: {
        addComponents: (item, count, source) => {
            if (item.recipe)
                for (var i of item.recipe.components) {
                    source = source ? source : this;
                    if (!source.components[i.item.id]) {
                        source.components[i.item.id] = {
                            item: i.item,
                            count: 0
                        };
                    }
                    var cnt = i.count / item.recipe.count * count;
                    source.components[i.item.id].count += cnt;
                    source.addComponents(i.item, cnt, source);
                }
        }
    },
    watch: {
        item: {
            immediate: true,
            handler(newVal, oldVal) {
                this.components = {};
                this.addComponents(newVal, this.count, this);
            }
        }
    }
});

var main = new Vue({
    el: '#main',
    data: function() {

        loadData().then((items) => {
            main.loaded = true;
            main.items = items;
        });

        return {
            loaded: false,
            selectedItem: null,
            items: null,
            count: 1
        };
    }
});
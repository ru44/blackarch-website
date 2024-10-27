---
outline: deep
---

# Hacking Tools List

Every package of the BlackArch Linux repository is listed in the following table. If you don't find your needed tool in this list simply open an <a href="https://github.com/BlackArch/blackarch/issues/new">issue</a> or better do a <a href="https://github.com/BlackArch/blackarch/pulls">pull request</a> for the tool you want to be in our repository. We are fast at packaging and releasing tools.

<b>Tool count:</b> 2901

---

## hello: world

<script setup>
import { ref, computed } from 'vue'

const searchInput = ref('')
const list = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Orange' },
  { id: 4, name: 'Grape' },
  { id: 5, name: 'Pear' },
])

const filteredList = computed(() => {
  return list.value.filter(item => item.name.toLowerCase().includes(searchInput.value.toLowerCase()))
})

function search() {
  // Do something with the search input
}
</script>

## Markdown Content

The count is: {{ count }}

<button :class="$style.button" @click="count++">Increment</button>

<div>
    <input v-model="searchInput" type="text" placeholder="Search" />
    <button @click="search">Search</button>
    <ul>
      <li v-for="item in filteredList" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>

<style module>
.button {
  color: red;
  font-weight: bold;
}
</style>

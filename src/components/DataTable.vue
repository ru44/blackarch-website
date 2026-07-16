<script setup lang="ts">
defineProps<{
  title?: string;
  isLoading?: boolean;
  data: Array<any>;
  columns: Array<{ key: string; label: string; type?: "link" | "email" }>;
}>();
</script>

<template>
  <div>
    <h2 v-if="title">{{ title }}</h2>
    <p v-if="isLoading">Loading...</p>
    <table v-else>
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data" :key="row.name || index">
          <td v-for="col in columns" :key="col.key">
            <a
              v-if="col.type === 'email' && row[col.key]"
              :href="`mailto:${row[col.key]}`"
            >
              {{ row[col.key] }}
            </a>
            <a
              v-else-if="col.type === 'link' && row[col.key]"
              :href="row[col.key]"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ row[col.key] }}
            </a>
            <template v-else>
              {{ row[col.key] }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="!isLoading && data.length === 0">No data found.</p>
  </div>
</template>

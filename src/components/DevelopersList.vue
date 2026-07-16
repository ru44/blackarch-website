<script setup>
import { ref, onMounted } from "vue";
import developersJson from "../data/developers.json";
import DataTable from "./DataTable.vue";

const developers = ref([]);
const isLoading = ref(true);

onMounted(() => {
  developers.value = developersJson;
  isLoading.value = false;
});

const columns = [
  { key: "name", label: "Name" },
  { key: "nickname", label: "Nickname" },
  { key: "email", label: "Email", type: "email" },
  { key: "gpg_key", label: "GPG Key" },
  { key: "role", label: "Role" },
];
</script>

<template>
  <DataTable
    title="BlackArch Developers"
    :data="developers"
    :columns="columns"
    :isLoading="isLoading"
  />
</template>

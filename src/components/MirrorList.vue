<script setup>
import { ref } from 'vue'
import mirrors from '../data/mirrors.json'

const openStates = ref({})

const toggleDropdown = (country) => {
    openStates.value[country] = !openStates.value[country]
}
</script>

<template>
    <div>
        <h2 id="official-blackarch-linux-mirror-sites">Official BlackArch Linux Mirror Sites</h2>
        <div v-for="(urls, country) in mirrors" :key="country" class="dropdown-container">
            <button
                class="dropdown-button"
                type="button"
                :aria-expanded="!!openStates[country]"
                @click="toggleDropdown(country)"
            >
                <span>{{ country }}</span>
                <span class="mirror-count">{{ urls.length }} {{ urls.length === 1 ? 'mirror' : 'mirrors' }}
                    <svg :class="['icon', { 'rotated': openStates[country] }]" viewBox="0 0 10 6" fill="none"
                        xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </span>
            </button>
            <div v-show="openStates[country]" class="dropdown-menu">
                <ul>
                    <li v-for="url in urls" :key="url">
                        <a :href="url" target="_blank" rel="noopener noreferrer">{{ url }}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
.icon {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-left: 0.5rem;
    pointer-events: none;
    transition: transform 0.3s ease;
}

.icon.rotated {
    transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
    .icon {
        transition: none;
    }
}

.dropdown-container {
    margin-bottom: 0.5rem;
}

.dropdown-button {
    background-color: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid var(--vp-c-divider);
    border-radius: 0.5rem;
    cursor: pointer;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
}

.dropdown-button:hover {
    border-color: var(--vp-c-brand-1);
}

.dropdown-button[aria-expanded="true"] {
    border-color: var(--vp-c-brand-1);
}

.dropdown-button:focus-visible {
    outline: 2px solid var(--vp-c-brand-1);
    outline-offset: 2px;
}

.mirror-count {
    display: inline-flex;
    align-items: center;
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--vp-c-text-2);
    white-space: nowrap;
}

.dropdown-menu {
    background-color: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    border-radius: 0.5rem;
    margin-top: 0.25rem;
    padding: 0.25rem 0;
    width: 100%;
}

.dropdown-menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.dropdown-menu li a {
    display: block;
    padding: 0.4rem 1rem;
    color: var(--vp-c-text-2);
    text-decoration: none;
    font-size: 0.875rem;
    font-family: var(--vp-font-family-mono);
    word-break: break-all;
}

.dropdown-menu li a:hover {
    background-color: var(--vp-c-default-soft);
    color: var(--vp-c-brand-1);
}
</style>

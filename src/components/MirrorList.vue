<script setup>
import { ref, computed } from 'vue'
import mirrors from '../data/mirrors.json'

const openStates = ref({})
const searchQuery = ref('')

const filteredMirrors = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return mirrors

    const result = {}
    for (const [country, urls] of Object.entries(mirrors)) {
        if (country.toLowerCase().includes(query)) {
            result[country] = urls
            continue
        }
        const matching = urls.filter((url) => url.toLowerCase().includes(query))
        if (matching.length) result[country] = matching
    }
    return result
})

const isSearching = computed(() => searchQuery.value.trim() !== '')

const toggleDropdown = (country) => {
    openStates.value[country] = !openStates.value[country]
}

const clearSearch = () => {
    searchQuery.value = ''
}
</script>

<template>
    <div>
        <h2 id="official-blackarch-linux-mirror-sites">Official BlackArch Linux Mirror Sites</h2>

        <div class="mirror-search">
            <span class="search-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            </span>
            <input v-model="searchQuery" type="search" class="mirror-input"
                placeholder="Search by country or mirror URL…" aria-label="Search mirrors" />
            <button v-if="searchQuery" class="clear-btn" type="button" aria-label="Clear search" title="Clear"
                @click="clearSearch">
                ×
            </button>
        </div>

        <div v-for="(urls, country) in filteredMirrors" :key="country" class="dropdown-container">
            <button
                class="dropdown-button"
                type="button"
                :aria-expanded="isSearching || !!openStates[country]"
                @click="toggleDropdown(country)"
            >
                <span>{{ country }}</span>
                <span class="mirror-count">{{ urls.length }} {{ urls.length === 1 ? 'mirror' : 'mirrors' }}
                    <svg :class="['icon', { 'rotated': isSearching || openStates[country] }]" viewBox="0 0 10 6"
                        fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </span>
            </button>
            <div v-show="isSearching || openStates[country]" class="dropdown-menu">
                <ul>
                    <li v-for="url in urls" :key="url">
                        <a :href="url" target="_blank" rel="noopener noreferrer">{{ url }}</a>
                    </li>
                </ul>
            </div>
        </div>

        <p v-if="Object.keys(filteredMirrors).length === 0" class="empty-state">
            No mirrors match “{{ searchQuery }}”.
            <button class="empty-clear" type="button" @click="clearSearch">Clear search</button>
        </p>
    </div>
</template>

<style scoped>
.mirror-search {
    position: relative;
    display: flex;
    margin: 1rem 0;
}

.search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    color: var(--vp-c-text-3);
    pointer-events: none;
}

.search-icon svg {
    display: block;
    width: 100%;
    height: 100%;
}

.mirror-input {
    width: 100%;
    height: 2.5rem;
    font-size: 1rem;
    padding-left: 2.4rem;
    padding-right: 2rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 0.5rem;
    background-color: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
}

.mirror-input::placeholder {
    color: var(--vp-c-text-3);
}

.mirror-input::-webkit-search-cancel-button {
    display: none;
}

.mirror-input:focus {
    outline: none;
    border-color: var(--vp-c-brand-1);
    box-shadow: 0 0 0 1px var(--vp-c-brand-1);
}

.clear-btn {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    font-size: 1.25rem;
    line-height: 1;
    color: var(--vp-c-text-3);
    cursor: pointer;
    padding: 0.25rem;
}

.clear-btn:hover {
    color: var(--vp-c-brand-1);
}

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

.empty-state {
    color: var(--vp-c-text-2);
    padding: 1rem 0;
}

.empty-clear {
    margin-left: 0.5rem;
    padding: 0.3rem 0.75rem;
    font-size: 0.8rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 0.4rem;
    background: transparent;
    color: var(--vp-c-text-1);
    cursor: pointer;
}

.empty-clear:hover {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
}
</style>

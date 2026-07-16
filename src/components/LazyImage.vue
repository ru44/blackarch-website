<template>
    <div>
        <img :src="thumbnail" :alt="alt" :width="width" loading="lazy" class="thumb" tabindex="0" role="button"
            :aria-label="`View full-size screenshot: ${alt}`" @click="openModal" @keydown.enter="openModal" />

        <teleport to="body">
            <div v-if="showModal" class="modal-backdrop" role="dialog" aria-modal="true" :aria-label="alt"
                @click="closeModal">
                <img :src="full" :alt="alt" class="modal-image" @click.stop />
            </div>
        </teleport>
    </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
    thumbnail: String,
    full: String,
    alt: String,
    width: {
        type: [String, Number],
        default: '400'
    }
})

const showModal = ref(false)

function openModal() {
    showModal.value = true
}

function closeModal() {
    showModal.value = false
}

function onKeydown(e) {
    if (e.key === 'Escape') closeModal()
}

watch(showModal, (open) => {
    if (typeof document === 'undefined') return
    if (open) {
        document.addEventListener('keydown', onKeydown)
        document.body.style.overflow = 'hidden'
    } else {
        document.removeEventListener('keydown', onKeydown)
        document.body.style.overflow = ''
    }
})

onUnmounted(() => {
    if (typeof document === 'undefined') return
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
})
</script>

<style scoped>
.thumb {
    cursor: zoom-in;
    border-radius: 8px;
    transition: opacity 0.3s;
}

.thumb:hover {
    opacity: 0.85;
}

.thumb:focus-visible {
    outline: 2px solid var(--vp-c-brand-1);
    outline-offset: 2px;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    cursor: zoom-out;
}

.modal-image {
    max-width: 90vw;
    max-height: 90vh;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
    cursor: default;
}
</style>

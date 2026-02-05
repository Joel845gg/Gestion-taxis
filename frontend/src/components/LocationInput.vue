<template>
  <div class="location-input">
    <input 
      type="text" 
      :value="modelValue" 
      @input="onInput"
      :placeholder="placeholder"
      class="glass-input"
    >
    <ul v-if="suggestions.length > 0" class="suggestions-list">
      <li v-for="(item, index) in suggestions" :key="index" @click="select(item)">
        {{ item.display_name }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['modelValue', 'placeholder'],
  emits: ['update:modelValue'],
  data() {
    return {
      suggestions: [],
      timer: null
    };
  },
  methods: {
    onInput(e) {
      const val = e.target.value;
      this.$emit('update:modelValue', val);
      
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.fetchSuggestions(val);
      }, 500);
    },
    async fetchSuggestions(query) {
      if (query.length < 3) {
        this.suggestions = [];
        return;
      }
      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
        this.suggestions = res.data;
      } catch (err) {
        console.error(err);
      }
    },
    select(item) {
      this.$emit('update:modelValue', item.display_name);
      this.suggestions = [];
    }
  }
};
</script>

<style scoped>
.location-input { position: relative; width: 100%; margin-bottom: 15px; }
.glass-input {
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    color: white;
    font-size: 1rem;
    outline: none;
    transition: all 0.3s ease;
}
.glass-input::placeholder { color: rgba(255, 255, 255, 0.7); }
.glass-input:focus {
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}
.suggestions-list {
    position: absolute;
    width: 100%;
    background: rgba(40, 40, 45, 0.95);
    border-radius: 10px;
    list-style: none;
    padding: 0;
    margin-top: 5px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 100;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}
.suggestions-list li {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: #ddd;
    font-size: 0.9rem;
}
.suggestions-list li:hover { background: rgba(255, 255, 255, 0.1); }
</style>

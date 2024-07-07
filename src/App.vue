<!-- src/App.vue -->
<template>
  <div id="app">
    <h1>數獨</h1>
    <SudokuGrid />
  </div>
</template>

<script>
import SudokuGrid from './components/SudokuGrid.vue';

export default {
  name: 'App',
  components: {
    SudokuGrid
  }
};
</script>

<style>
#app {
  text-align: center;
}

.header {
  margin-bottom: 20px;
}
</style>

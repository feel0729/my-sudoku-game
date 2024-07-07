<!-- src/App.vue -->
<template>
  <div id="app">
    <h1>Sudoku Game</h1>
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

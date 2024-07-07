<template>
    <div>
      <div class="status-bar">
        通關次數: {{ passCount }}
      </div>
      <div class="sudoku-grid-container">
        <div class="sudoku-grid">
          <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="sudoku-row">
            <input
              v-for="(cell, cellIndex) in row"
              :key="cellIndex"
              type="text"
              inputmode="numeric"
              pattern="[1-9]*"
              class="sudoku-cell"
              v-model="grid[rowIndex][cellIndex]"
              :readonly="isReadOnly(rowIndex, cellIndex)"
              :class="{
                'initial-cell': initialGrid[rowIndex][cellIndex] !== '',
                'user-input': userInputs[rowIndex][cellIndex]
              }"
              @compositionstart="isComposing = true"
              @compositionend="handleCompositionEnd(rowIndex, cellIndex, $event)"
              @input="handleInput(rowIndex, cellIndex, $event)"
            />
          </div>
        </div>
      </div>
      <div v-if="isLevelCompleted" class="next-level">
        <div class="congrats-message">恭喜通關!</div>
        <button @click="nextLevel">下一關</button>
      </div>
    </div>
  </template>
  
  <script>
  import { computed, ref, watch } from 'vue';
  import { useStore } from 'vuex';
  import '@/assets/sudoku.css';  // 引用CSS文件
  
  export default {
    setup() {
      const store = useStore();
      const grid = computed(() => store.getters.grid);
      const initialGrid = computed(() => store.getters.initialGrid);
      const solutionGrid = computed(() => store.getters.solutionGrid);
      const userInputs = computed(() => store.getters.userInputs);
      const passCount = computed(() => store.getters.passCount);
      const isLevelCompleted = ref(false);
      const isComposing = ref(false);
  
      const isReadOnly = (row, col) => {
        return initialGrid.value[row][col] !== '';
      };
  
      const handleInput = (row, col, event) => {
        if (isComposing.value) {
          isLevelCompleted.value = false;
          return;  // 如果处于组合输入状态，不处理输入事件
        }
        const value = event.target.value;
        if (/^[1-9]?$/.test(value)) {
          store.dispatch('setCell', { row, col, value });
          checkLevelCompletion();
        } else {
          store.dispatch('setCell', { row, col, value: '' });
        }
      };
  
      const handleCompositionStart = () => {
        isLevelCompleted.value = false;
        isComposing.value = true;
      };
  
      const handleCompositionEnd = (row, col, event) => {
        isLevelCompleted.value = false;
        isComposing.value = false;  // 组合输入结束
        handleInput(row, col, event);  // 在组合输入结束时处理输入事件
      };
  
      const checkLevelCompletion = () => {
        console.log('checkLevelCompletion');
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            const temp_grid_value = grid.value[row][col];
            const temp_solutionGrid_value = solutionGrid.value[row][col];
            if (temp_grid_value === '' || String(temp_grid_value) !== String(temp_solutionGrid_value)) {
              isLevelCompleted.value = false;
              console.log(`error grid.value[${row}][${col}]:${temp_grid_value}`);
              console.log(`should be solutionGrid.value[${row}][${col}]:${temp_solutionGrid_value}`);
              return;
            }
          }
        }
        isLevelCompleted.value = true;
      };
  
      const nextLevel = () => {
        store.dispatch('setNextLevel');
        isLevelCompleted.value = false; // 重置关卡完成状态
      };
  
      // 监听 grid 的变化，确保在每次输入后检查关卡完成状态
      watch(grid, checkLevelCompletion, { deep: true });
  
      return {
        grid,
        initialGrid,
        solutionGrid,
        userInputs,
        passCount,
        handleInput,
        handleCompositionStart,
        handleCompositionEnd,
        isReadOnly,
        isLevelCompleted,
        nextLevel,
        isComposing
      };
    }
  };
  </script>
  
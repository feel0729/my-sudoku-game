<template>
    <div>
        <div class="status-bar">
            通關次數: {{ passCount }}
        </div>
        <div class="sudoku-grid">
            <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="sudoku-row">
                <input v-for="(cell, cellIndex) in row" :key="cellIndex" type="text" inputmode="numeric"
                    pattern="[1-9]*" class="sudoku-cell" v-model="grid[rowIndex][cellIndex]"
                    :readonly="isReadOnly(rowIndex, cellIndex)" :class="{
                        'initial-cell': initialGrid[rowIndex][cellIndex] !== '',
                        'user-input': userInputs[rowIndex][cellIndex]
                    }" @compositionstart="handleCompositionStart()"
                    @compositionend="handleCompositionEnd(rowIndex, cellIndex, $event)"
                    @input="handleInput(rowIndex, cellIndex, $event)" />
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
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    // 如果用户输入的值是空白或者不匹配正确答案，关卡未完成
                    if (grid.value[row][col] === '' || grid.value[row][col] !== solutionGrid.value[row][col]) {
                        isLevelCompleted.value = false;
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

<style>
.sudoku-grid {
    display: grid;
    grid-template-rows: repeat(9, 40px);
    grid-template-columns: repeat(9, 40px);
    gap: 2px;
}

.sudoku-cell {
    width: 40px;
    height: 40px;
    text-align: center;
    background-color: #B5CAA0;
    font-size: 20px;
    -moz-appearance: textfield;
    /* Firefox */
}

.sudoku-cell::-webkit-outer-spin-button,
.sudoku-cell::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    /* Safari and Chrome */
}

.initial-cell {
    background-color: #91AD70;
}

.user-input {
    background-color: #B5CAA0;
}

.status-bar {
    margin-bottom: 20px;
    font-size: 20px;
}

.next-level {
    margin-top: 20px;
}

.congrats-message {
    font-size: 24px;
    color: green;
    margin-bottom: 10px;
}
</style>
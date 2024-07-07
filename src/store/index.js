// src/store/index.js
import { createStore } from 'vuex';
import { generateSudokuPuzzle, solveSudokuPuzzle } from '../utils/sudokuGenerator';

const generateInitialGrid = (level) => {
  return generateSudokuPuzzle(level);
};

const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const initialGrid = generateInitialGrid(1);
const solutionGrid = solveSudokuPuzzle(deepCopy(initialGrid));

export default createStore({
  state: {
    level: 1,
    passCount: 0,
    grid: deepCopy(initialGrid),
    initialGrid: deepCopy(initialGrid),
    solutionGrid: deepCopy(solutionGrid),
    userInputs: Array(9).fill().map(() => Array(9).fill(false))
  },
  mutations: {
    setNextLevel(state) {
      state.passCount += 1;
      state.level = state.passCount + 1;
      const newGrid = generateInitialGrid(state.level);
      state.grid = deepCopy(newGrid);
      state.initialGrid = deepCopy(newGrid);
      state.solutionGrid = deepCopy(solveSudokuPuzzle(deepCopy(newGrid)));
      state.userInputs = Array(9).fill().map(() => Array(9).fill(false));
    },
    updateCell(state, { row, col, value }) {
      state.grid[row][col] = value;
      state.userInputs[row][col] = value !== '';
    }
  },
  actions: {
    setNextLevel({ commit }) {
      commit('setNextLevel');
    },
    setCell({ commit }, payload) {
      commit('updateCell', payload);
    }
  },
  getters: {
    level: state => state.level,
    passCount: state => state.passCount,
    grid: state => state.grid,
    initialGrid: state => state.initialGrid,
    solutionGrid: state => state.solutionGrid,
    userInputs: state => state.userInputs
  }
});

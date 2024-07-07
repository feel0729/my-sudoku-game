import { createStore } from 'vuex';
import { generateSudokuPuzzle } from '../utils/sudokuGenerator';

const initializeState = (level) => {
  const { grid, initialGrid, solutionGrid } = generateSudokuPuzzle(level);
  return { grid, initialGrid, solutionGrid };
};

const initialState = initializeState(1);

export default createStore({
  state: {
    level: 1,
    grid: initialState.grid,
    initialGrid: initialState.initialGrid,
    solutionGrid: initialState.solutionGrid,
    userInputs: Array(9).fill().map(() => Array(9).fill(false)),
    passCount: 0
  },
  mutations: {
    setGrid(state, { grid, initialGrid, solutionGrid }) {
      state.grid = grid;
      state.initialGrid = initialGrid;
      state.solutionGrid = solutionGrid;
    },
    setCell(state, { row, col, value }) {
      state.grid[row][col] = value;
      state.userInputs[row][col] = true;
    },
    setNextLevel(state) {
      state.passCount++;
      state.level = state.passCount + 1;
      const { grid, initialGrid, solutionGrid } = generateSudokuPuzzle(state.level);
      state.grid = grid;
      state.initialGrid = initialGrid;
      state.solutionGrid = solutionGrid;
      state.userInputs = Array(9).fill().map(() => Array(9).fill(false));
    }
  },
  actions: {
    generateNewPuzzle({ commit }, level) {
      const { grid, initialGrid, solutionGrid } = generateSudokuPuzzle(level);
      commit('setGrid', { grid, initialGrid, solutionGrid });
    },
    setCell({ commit }, payload) {
      commit('setCell', payload);
    },
    setNextLevel({ commit }) {
      commit('setNextLevel');
    }
  },
  getters: {
    grid: state => state.grid,
    initialGrid: state => state.initialGrid,
    solutionGrid: state => state.solutionGrid,
    userInputs: state => state.userInputs,
    passCount: state => state.passCount
  }
});

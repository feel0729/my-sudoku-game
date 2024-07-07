// src/utils/sudokuGenerator.js

const isValidSudoku = (grid, row, col, num) => {
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num || grid[x][col] === num ||
            grid[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
            return false;
        }
    }
    return true;
};

const fillSudoku = (grid) => {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === '') {
                const shuffledNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                for (let num of shuffledNumbers) {
                    if (isValidSudoku(grid, row, col, num)) {
                        grid[row][col] = num;
                        if (fillSudoku(grid)) {
                            return true;
                        }
                        grid[row][col] = '';
                    }
                }
                return false;
            }
        }
    }
    return true;
};

const removeCells = (grid, cellsToRemove) => {
    while (cellsToRemove > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (grid[row][col] !== '') {
            grid[row][col] = '';
            cellsToRemove--;
        }
    }
};

export const generateSudokuPuzzle = (level) => {
    const grid = Array(9).fill().map(() => Array(9).fill(''));
    const solutionGrid = Array(9).fill().map(() => Array(9).fill(''));
    fillSudoku(grid);
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            solutionGrid[i][j] = grid[i][j];
        }
    }
    const difficults = Math.floor((level > 60 ? 60 : level) / 10);
    const cellsToRemove = (difficults == 0 ? 1 : difficults) * 9;
    removeCells(grid, cellsToRemove);
    const initialGrid = deepCopy(grid);
    return { grid, initialGrid, solutionGrid };
};

const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
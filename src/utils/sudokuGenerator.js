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
    fillSudoku(grid);
    const difficults = Math.floor((level > 60 ? 60 : level) / 10);
    const cellsToRemove = (difficults == 0 ? 1 : difficults) * 9;
    removeCells(grid, cellsToRemove);
    return grid;
};

export const solveSudokuPuzzle = (grid) => {
    const findEmpty = (grid) => {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (grid[r][c] === '') {
                    return [r, c];
                }
            }
        }
        return null;
    };

    const isValid = (grid, num, pos) => {
        const [r, c] = pos;

        for (let i = 0; i < 9; i++) {
            if (grid[r][i] == num && c !== i) {
                return false;
            }
        }

        for (let i = 0; i < 9; i++) {
            if (grid[i][c] == num && r !== i) {
                return false;
            }
        }

        const boxRow = Math.floor(r / 3) * 3;
        const boxCol = Math.floor(c / 3) * 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[boxRow + i][boxCol + j] == num && (boxRow + i) !== r && (boxCol + j) !== c) {
                    return false;
                }
            }
        }

        return true;
    };

    const solve = () => {
        const currPos = findEmpty(grid);
        if (!currPos) {
            return true;
        }

        for (let i = 1; i < 10; i++) {
            const currentNum = i.toString();
            const isValidPlacement = isValid(grid, currentNum, currPos);

            if (isValidPlacement) {
                const [x, y] = currPos;
                grid[x][y] = currentNum;

                if (solve()) {
                    return true;
                }

                grid[x][y] = '';
            }
        }

        return false;
    };

    const gridCopy = JSON.parse(JSON.stringify(grid));
    solve(gridCopy);
    return gridCopy;
};
/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import {COLORS} from "../constants";

const curry = require('lodash/fp/curry');
const curryRight = require('lodash/fp/curryRight');

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = ({star, square, triangle, circle}) => {
    return allPass([
        checkStarColor('red'),
        checkSquareColor('green'),
        checkTriangleColor('white'),
        checkCircleColor('white')
    ])(star, square, triangle, circle);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = ({star, square, triangle, circle}) => {
    return checkColorMoreN('green', 2)(star, square, triangle, circle);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = ({star, square, triangle, circle}) => {
    return getColorN('red')(star, square, triangle, circle) === getColorN('blue')(star, square, triangle, circle);
};

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = ({star, square, triangle, circle}) => {
    return allPass([
        checkStarColor('red'),
        checkSquareColor('orange'),
        checkCircleColor('blue')
    ])(star, square, triangle, circle);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = ({star, square, triangle, circle}) => {
    return anyPass(Object.keys(COLORS).map(c => c === 'WHITE' ? (star, square, triangle, circle) => false : checkColorMoreN(COLORS[c], 3)))(star, square, triangle, circle);
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = ({star, square, triangle, circle}) => {
    return allPass([
        checkColorN('green', 2),
        checkTriangleColor('green'),
        checkColorN('red', 1)
    ])(star, square, triangle, circle);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = ({star, square, triangle, circle}) => {
    return checkColorN('orange', 4)(star, square, triangle, circle);
};

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = ({star, square, triangle, circle}) => {
    return !anyPass([checkStarColor('red'), checkStarColor('white')])(star, square, triangle, circle);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = ({star, square, triangle, circle}) => {
    return checkColorN('green', 4)(star, square, triangle, circle);
};

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = ({star, square, triangle, circle}) => {
    return triangle === square && !checkTriangleColor('white')(star, square, triangle, circle);
};

export const allPass = (predicates) => (...args) => predicates.reduce((prev, predicate) => prev && predicate(...args), true);
export const anyPass = (predicates) => (...args) => predicates.reduce((prev, predicate) => prev || predicate(...args), false);

const checkColor = (figure, color) => figure === color;
const checkFigureColor = curry(checkColor);
const checkFigureColorRight = curryRight(checkColor);

const checkStarColor = color => (star, square, triangle, circle) => checkFigureColor(star)(color);
const checkSquareColor = color => (star, square, triangle, circle) => checkFigureColor(square)(color);
const checkTriangleColor = color => (star, square, triangle, circle) => checkFigureColor(triangle)(color);
const checkCircleColor = color => (star, square, triangle, circle) => checkFigureColor(circle)(color);

const getColorN = curry((color, star, square, triangle, circle) => [star, square, triangle, circle].filter(f => checkFigureColorRight(color)(f)).length);
const checkColorN = (color, n) => (star, square, triangle, circle) => getColorN(color)(star, square, triangle, circle) === n;
const checkColorMoreN = (color, n) => (star, square, triangle, circle) => getColorN(color)(star, square, triangle, circle) >= n;

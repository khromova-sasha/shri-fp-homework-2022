/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {allPass} from "./validators";

const api = new Api();

const validate = (value, handleError) => {
    if (!allPass([
            v => v.length > 2,
            v => v.length < 10,
            v => v[0] !== '-', v => v.match(/^[0-9]*\.?[0-9]*$/)
    ])(value)) {
        handleError('ValidationError');
        return null;
    }
    return value;
}

const toNumber = (value) => Math.round(Number(value));
const toBinary = async (value) => (await api.get('https://api.tech/numbers/base', {from: 10, to: 2, number: value})).result;
const getDigitsNumber = (value) => value.toString().length;
const square = (value) => value * value;
const mod3 = (value) => value % 3;
const getAnimal = async (id) =>  (await api.get(`https://animals.tech/${id}`, {})).result;
const fnWithLogs = (fn, logFn) => async (value) => {
    const res = await fn(value);
    logFn(res);
    return res;
};
const asyncCompose = (...asyncFn) => {
    return async (x) => await asyncFn.reduceRight(async (v, f) => f(await v), Promise.resolve(x));
}

const processSequence = async ({value, writeLog, handleSuccess, handleError}) => {
    writeLog(value);
    if (validate(value, handleError) !== null) {
        await asyncCompose(
            handleSuccess,
            getAnimal,
            fnWithLogs(mod3, writeLog),
            fnWithLogs(square, writeLog),
            fnWithLogs(getDigitsNumber, writeLog),
            fnWithLogs(toBinary, writeLog),
            fnWithLogs(toNumber, writeLog)
        )(value);
    }
}

export default processSequence;

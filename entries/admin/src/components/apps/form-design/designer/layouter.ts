
import { FormControl, DataItem, FormControlType } from "../typings";


export interface Layouter {

    /**
     * 显示空列
     * @param rowIndex 行索引
     * @param colIndex 列索引
     * @param newline 是否换行
     */
    showEmptyCol(rowIndex: number, colIndex: number, newline: boolean): void;

    /**
     * 隐藏空列
     */
    hideEmptyCol(): void;

    /**
     * 延时隐藏空列
     */
    setHideEmptyTask(): void;

    /**
     * 清除延时隐藏空列
     */
    clearHideEmptyTask(): void;

    /**
     * 延时显示空列
     * @param rowIndex 行索引
     * @param colIndex 列索引
     * @param newline 是否换行
     */
    setShowEmptyTask(rowIndex: number, colIndex: number, newline: boolean): void;

    /**
     * 替换空列
     * @param control 新的控件
     */
    replaceEmpty(control: FormControl): boolean;
}
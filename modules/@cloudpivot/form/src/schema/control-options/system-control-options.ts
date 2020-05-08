
import { StyleControlOptions } from './form-control-options';


export class SequenceNoOptions extends StyleControlOptions{

    /**
     * 流水号编码
     */
    prefix: string | null = null

    /**
     * 最大长度
     */
    maxLength: string = '6'

    /**
     * 重置策略时间 'none' | 'year' | 'month' | 'week' | 'day'
     */
    resetDate: string = 'YEAR'

    /**
     * 连接符 '-' | '#' | '、' | '_' |
     */
    delimiter: string = 'mark1'
}

/**
 * 创建时间
 */
export class CreatedTimeOptions extends StyleControlOptions{

    format : string = 'YYYY-MM-DD HH:mm:ss'

}

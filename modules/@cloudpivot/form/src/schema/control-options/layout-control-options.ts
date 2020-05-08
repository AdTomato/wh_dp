
import { FormControlOptions } from './form-control-options';

export class LayoutControlOptions implements FormControlOptions{

    /**
     * 控件名称
     */
    name = ''
    
    /**
     * 对齐
     */
     align: 'left' | 'center' | 'right' = 'left'
     
    /**
     * 控件样式
     */
    style : string | null = null

    /**
     * 显示条件
     */
    displayFormula = ''
    /**
     * tip提示
     */
    tips: string = ''
}

/**
 * 分组标题
 */
export class GroupTitleOptions extends LayoutControlOptions{

    /**
     * 默认展开
     */
    expand = true

}


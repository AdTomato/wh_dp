import { ParseOptions,ListOptions } from '../../core/schema';
import { ListParseMap } from './parser-validates';
import { ListGeneratorMap } from './generator-validates'
import { ListHtmlParser } from '../../core/class';

/**
 *
 * @param object 设计视图配置数据
 * @returns html  转换后的编辑器内容
 */
export async function objectToHtml(options:ListOptions) {
  try {
    const generator = ListGeneratorMap(options);
    if (generator) {
      await generator.generate();
    }
    // console.clear();
    // console.log(generator);
    return generator;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * @param html  编辑器的内容
 * @returns options  转换为AST树，再转为设计视图配置数据
 */
export async function htmlToObject(html: string, options: ListOptions) {
  try {
    const parser = ListParseMap(html, options);
    if (parser) {
      await parser.parse();
    }
    // console.log('outputing--> ', parser);
    return parser;
  } catch (error) {
    throw new Error(error);
  }
}

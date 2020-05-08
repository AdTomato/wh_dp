import Vue from 'vue';

export const msgMap = [
  {
    code: 403001,
    tip: '表达式不能为空',
    translate: 'noEmptyExpression',
  },
  {
    code: 403002,
    tip: '表达式连续多个符号',
    translate: 'noContinuousMultiSymbols',
  },
  {
    code: 403003,
    tip: '表达式缺失右括号“)”',
    translate: 'lostRightParenthesis',
  },
  {
    code: 403004,
    tip: '表达式缺失运算符',
    translate: 'lostOperator',
  },
  {
    code: 403005,
    tip: '运算符后缺少表达式',
    translate: 'lostExpressionBehindSymbol',
  },
  {
    code: 403006,
    tip: '未关闭的括号“(”',
    translate: 'unclosedParenthesis',
  },
  {
    code: 403007,
    tip: '表达式无意义',
    translate: 'expressionMeaningless',
  },
  {
    code: 403008,
    tip: '不能支持操作符“=”',
    translate: 'unsupportOperatorEquals',
  },
  {
    code: 403009,
    tip: '不能支持操作符“&”',
    translate: 'unsupportOperatorAnd',
  },
  {
    code: 403010,
    tip: '不能支持操作符“|”',
    translate: 'unsupportOperatorOr',
  },
  {
    code: 403011,
    tip: '不能支持操作符“!”',
    translate: 'unsupportOperatorNon',
  },
  {
    code: 403012,
    tip: '函数%s的参数应为%s个',
    translate: 'argumentsNumberError',
  },
  {
    code: 403013,
    tip: '未识别的表达式',
    translate: 'unrecognizedExpression',
  },
  {
    code: 403014,
    tip: '函数%s未关闭',
    translate: 'unclosedFormula',
  },
  {
    code: 403015,
    tip: '函数%s的第%s个参数为空',
    translate: 'hasEmptyArgument',
  },
  {
    code: 403016,
    tip: '引号“"”未关闭',
    translate: 'unclosedQuotation',
  },
  {
    code: 403017,
    tip: '变量符号“{”未关闭',
    translate: 'unclosedVariableSymbol',
  },
  {
    code: 403018,
    tip: '系统参数或数据项%s不存在',
    translate: 'unexistArgument',
  },
  {
    code: 403019,
    tip: '表达式%s不合法',
    translate: 'illegalExpression',
  },
  {
    code: 403020,
    tip: '表达式不能以运算符开始',
    translate: 'cannotStartWithSymbol',
  },
  {
    code: 403021,
    tip: '函数%s不存在',
    translate: 'unexistFormula',
  },
];

export const dealErrorCode = (res: Common.Data, vm: Vue) => {
  const item: any = msgMap.find((msg: any) => msg.code === res.errcode);
  let errorTip: any = item ? item.tip : '';
  if (errorTip && new RegExp('%s').test(errorTip)) {
    const errorReg: RegExp = new RegExp(errorTip.replace(/%s/g, '(.+?)'));
    const message: string = res.data.split('/r/n')[0];
    // console.log(message);
    const matchs = message.match(errorReg);
    if (Array.isArray(matchs) && matchs.length > 1) {
      const args = matchs.slice(1);
      errorTip = vm.$t(`languages.Apps.${item.translate}`, {
        first: args[0],
        second: args[1]
      });
    } else if (res.errmsg) {
      const msgMatch = res.errmsg.match(errorReg);
      if (Array.isArray(msgMatch) && msgMatch.length > 1) {
        const args = msgMatch.slice(1);
        errorTip = vm.$t(`languages.Apps.${item.translate}`, {
          first: args[0],
          second: args[1]
        });
      }
    }
  }
  const msg: string = errorTip || res.errmsg || '校验失败';
  vm.$message.error(msg);
};
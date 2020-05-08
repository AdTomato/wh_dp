export abstract class FormControlVerifyService {
  // 日期类型校验 校验规则在 control.options.verifyFormula字段上
  static verifyDate(rule: string, options: any, controlOptions: any) {
    if (!rule || rule.length === 0 || controlOptions.readonlyFormula) return;
    let ruleObj: any = {};
    if (this.isJSONString(rule)) {
      ruleObj = JSON.parse(rule);
    } else {
      let arr = rule.split("_");
      for (let r of arr) {
        let [key, val] = r.split(":");
        ruleObj[key] = val;
      }
    }
    if (+ruleObj.type === 1) {
      // 固定值模式
      if (ruleObj.rule === "~") {
        // 介于规则
        if (ruleObj.lDate && ruleObj.rDate) {
          controlOptions.minDate = ruleObj.lDate;
          controlOptions.maxDate = ruleObj.rDate;
          options.max = new Date(ruleObj.rDate.replace(/-/g, "/"));
          options.min = new Date(ruleObj.lDate.replace(/-/g, "/"));
        }
      } else {
        if (ruleObj.date) {
          switch (ruleObj.rule) {
            case "=":
              // controlOptions.minDate = ruleObj.date;
              // controlOptions.maxDate = ruleObj.date;
              options.max = new Date(
                ruleObj.date.replace(/-/g, "/") + " 23:59:59"
              );
              options.min = new Date(ruleObj.date.replace(/-/g, "/"));
              break;
            case ">":
              var d = new Date(
                new Date(ruleObj.date.replace(/-/g, "/")).getTime() + 86400000
              );
              // var t =
              //   d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
              options.min = d;
              break;
            case "<":
              var d = new Date(
                new Date(ruleObj.date.replace(/-/g, "/")).getTime() - 86400000
              );
              // var t =
              //   d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
              options.max = d;
              break;
            case ">=":
              options.min = new Date(ruleObj.date.replace(/-/g, "/"));
              break;
            case "<=":
              options.max = new Date(ruleObj.date.replace(/-/g, "/"));
              break;
          }
        }
      }
    } else {
      // 动态值模式
      if (+ruleObj.day === 1) {
        // 当天 类型
        var nowD = new Date();
        let tday: any = "";
        if (
          !~controlOptions.format.indexOf("HH:mm:ss") &&
          ~controlOptions.format.indexOf("HH")
        ) {
          tday = new Date(
            nowD.getFullYear() +
              "/" +
              (nowD.getMonth() + 1) +
              "/" +
              nowD.getDate() +
              " " +
              nowD.getHours() +
              ":" +
              nowD.getMinutes()
          ).getTime();
        } else if (~controlOptions.format.indexOf("HH:mm:ss")) {
          tday = nowD.getTime();
        } else {
          tday = new Date(
            nowD.getFullYear() +
              "/" +
              (nowD.getMonth() + 1) +
              "/" +
              nowD.getDate() +
              " 00:00:00"
          ).getTime();
        }
        if (ruleObj.rule === "~") {
          // 介于规则
          if (("" + ruleObj.lInput).length && ("" + ruleObj.rInput).length) {
            let min = Math.min(+ruleObj.lInput, +ruleObj.rInput);
            let max = Math.max(+ruleObj.lInput, +ruleObj.rInput);
            let minDay = new Date(tday + min * 86400000);
            let maxDay = new Date(tday + max * 86400000);
            if (
              ~controlOptions.format.indexOf("HH") &&
              !~controlOptions.format.indexOf("HH:mm:ss")
            ) {
              controlOptions.minDate =
                minDay.getFullYear() +
                "/" +
                (minDay.getMonth() + 1) +
                "/" +
                minDay.getDate() +
                " " +
                minDay.getHours() +
                ":" +
                minDay.getMinutes();
              controlOptions.maxDate =
                maxDay.getFullYear() +
                "/" +
                (maxDay.getMonth() + 1) +
                "/" +
                maxDay.getDate() +
                " " +
                maxDay.getHours() +
                ":" +
                maxDay.getMinutes();
            } else if (~controlOptions.format.indexOf("HH:mm:ss")) {
              controlOptions.minDate =
                minDay.getFullYear() +
                "/" +
                (minDay.getMonth() + 1) +
                "/" +
                minDay.getDate() +
                " " +
                minDay.getHours() +
                ":" +
                minDay.getMinutes() +
                ":" +
                minDay.getSeconds();
              controlOptions.maxDate =
                maxDay.getFullYear() +
                "/" +
                (maxDay.getMonth() + 1) +
                "/" +
                maxDay.getDate() +
                " " +
                maxDay.getHours() +
                ":" +
                maxDay.getMinutes() +
                ":" +
                maxDay.getSeconds();
            } else {
              controlOptions.minDate =
                minDay.getFullYear() +
                "/" +
                (minDay.getMonth() + 1) +
                "/" +
                minDay.getDate();
              controlOptions.maxDate =
                maxDay.getFullYear() +
                "/" +
                (maxDay.getMonth() + 1) +
                "/" +
                maxDay.getDate();
            }
            ruleObj.lInput = controlOptions.minDate;
            ruleObj.rInput = controlOptions.maxDate;
            options.min = minDay;
            options.max = maxDay;
            if (ruleObj.defaultPrompt) {
              ruleObj.defaultPrompt = `${ruleObj.defaultPrompt}${ruleObj.lInput}~${ruleObj.rInput}`;
            }
          }
        } else {
          if (("" + ruleObj.input).length) {
            var t = "";
            switch (ruleObj.rule) {
              case "=":
                var maxD: any = "";
                var minD: any = "";
                var d = new Date(tday + ruleObj.input * 86400000);
                if (~controlOptions.format.indexOf("HH")) {
                  if (~controlOptions.format.indexOf("HH:mm:ss")) {
                    t = this._getDateFormat(d, "second");
                    minD = maxD = new Date(t);
                  } else {
                    t = this._getDateFormat(d, "minute");
                    minD = new Date(t + ":00");
                    maxD = new Date(t + ":59");
                  }
                } else {
                  t = this._getDateFormat(d, "day");
                  minD = new Date(t + " 00:00:00");
                  maxD = new Date(t + " 23:59:59");
                }
                controlOptions.minDate = t;
                options.min = minD;
                controlOptions.maxDate = t;
                options.max = maxD;
                break;
              case ">":
                var d = new Date(
                  tday + ((+ruleObj.input + 1) * 86400000 + 1000)
                );
                if (~controlOptions.format.indexOf("HH")) {
                  if (~controlOptions.format.indexOf("HH:mm:ss")) {
                    t = this._getDateFormat(d, "second");
                  } else {
                    t = this._getDateFormat(d, "minute");
                  }
                } else {
                  t = this._getDateFormat(d, "day");
                }
                controlOptions.minDate = t;
                options.min = d;
                break;
              case "<":
                var d = new Date(
                  tday + ((+ruleObj.input - 1) * 86400000 - 1000)
                );
                if (~controlOptions.format.indexOf("HH")) {
                  if (~controlOptions.format.indexOf("HH:mm:ss")) {
                    t = this._getDateFormat(d, "second");
                  } else {
                    t = this._getDateFormat(d, "minute");
                  }
                } else {
                  t = this._getDateFormat(d, "day");
                }
                controlOptions.maxDate = t;
                options.max = d;
                break;
              case ">=":
                var d = new Date(tday + ruleObj.input * 86400000);
                if (~controlOptions.format.indexOf("HH")) {
                  if (~controlOptions.format.indexOf("HH:mm:ss")) {
                    t = this._getDateFormat(d, "second");
                  } else {
                    t = this._getDateFormat(d, "minute");
                  }
                } else {
                  t = this._getDateFormat(d, "day");
                }
                controlOptions.minDate = t;
                options.min = d;
                break;
              case "<=":
                var d = new Date(tday + ruleObj.input * 86400000);
                if (~controlOptions.format.indexOf("HH")) {
                  if (~controlOptions.format.indexOf("HH:mm:ss")) {
                    t = this._getDateFormat(d, "second");
                  } else {
                    t = this._getDateFormat(d, "minute");
                  }
                } else {
                  t = this._getDateFormat(d, "day");
                }
                controlOptions.maxDate = t;
                options.max = d;
                break;
            }
            ruleObj.input = t;
            if (ruleObj.defaultPrompt) {
              ruleObj.defaultPrompt = `${ruleObj.defaultPrompt}${ruleObj.input}`;
            }
          }
        }
      } else {
        if (ruleObj.rule === "~") {
          if (ruleObj.lSelect && ruleObj.rSelect) {
            options.min = `{${ruleObj.lSelect}}`;
            options.max = `{${ruleObj.rSelect}}`;
          }
        } else {
          if (ruleObj.select) {
            switch (ruleObj.rule) {
              case "=":
                var t = `{${ruleObj.select}}`;
                options.min = t;
                options.max = t;
                break;
              case ">":
                if (~controlOptions.format.indexOf("HH")) {
                  var t = `{${ruleObj.select}} === null ? null :  new Date({${ruleObj.select}}.getTime() + 1000)`;
                  options.min = t;
                } else {
                  var t = `{${ruleObj.select}} === null ? null :  new Date({${ruleObj.select}}.getTime() + 24*60*60*1000)`;
                  options.min = t;
                }
                break;
              case "<":
                if (~controlOptions.format.indexOf("HH")) {
                  var t = `{${ruleObj.select}} === null ? null :  new Date({${ruleObj.select}}.getTime() - 1000)`;
                  options.max = t;
                } else {
                  var t = `{${ruleObj.select}} === null ? null :  new Date({${ruleObj.select}}.getTime() - 24*60*60*1000)`;
                  options.max = t;
                }
                break;
              case ">=":
                var t = `{${ruleObj.select}}`;
                options.min = t;
                break;
              case "<=":
                var t = `{${ruleObj.select}}`;
                options.max = t;
                break;
            }
          }
        }
      }
    }
    controlOptions.verifyFormula = JSON.stringify(ruleObj);
  }

  private static _getDateFormat(d: Date, type: "minute" | "second" | "day") {
    let str =
      d.getFullYear() +
      "-" +
      (d.getMonth() + 1 >= 10 ? d.getMonth() + 1 : "0" + d.getMonth() + 1) +
      "-" +
      (d.getDate() >= 10 ? d.getDate() : "0" + d.getDate());
    switch (type) {
      case "minute":
        str =
          str +
          " " +
          (d.getHours() >= 10 ? d.getHours() : "0" + d.getHours()) +
          ":" +
          (d.getMinutes() >= 10 ? d.getMinutes() : "0" + d.getMinutes());
        break;
      case "second":
        str =
          str +
          " " +
          (d.getHours() >= 10 ? d.getHours() : "0" + d.getHours()) +
          ":" +
          (d.getMinutes() >= 10 ? d.getMinutes() : "0" + d.getMinutes()) +
          ":" +
          (d.getSeconds() >= 10 ? d.getSeconds() : "0" + d.getSeconds());
    }
    return str;
  }

  // 数值类型校验 校验规则在 control.options.verifyFormula字段上
  static verifyNum(rule: string, options: any, controlOptions: any) {
    if (!rule || rule.length === 0) return;
    let ruleObj: any = {};
    if (this.isJSONString(rule)) {
      ruleObj = JSON.parse(rule);
    } else {
      let arr = rule.split("_");
      for (let r of arr) {
        let [key, val] = r.split(":");
        ruleObj[key] = val;
      }
    }
    if (+ruleObj.type === 1) {
      if (ruleObj.rule === "~") {
        if (("" + ruleObj.rInput).length && "" + ruleObj.lInput) {
          let min = Math.min(+ruleObj.lInput, +ruleObj.rInput);
          let max = Math.max(+ruleObj.lInput, +ruleObj.rInput);
          options.max = max;
          options.min = min;
        }
      } else {
        if (("" + ruleObj.input).length) {
          switch (ruleObj.rule) {
            case "=":
              options.max = +ruleObj.input;
              options.min = +ruleObj.input;
              break;
            case ">":
              options.min = +ruleObj.input + 0.0001;
              break;
            case "<":
              options.max = +ruleObj.input - 0.0001;
              break;
            case ">=":
              options.min = +ruleObj.input;
              break;
            case "<=":
              options.max = +ruleObj.input;
              break;
          }
        }
      }
    } else {
      if (ruleObj.rule === "~") {
        if (ruleObj.lSelect && ruleObj.rSelect) {
          options.max = `{${ruleObj.rSelect}}`;
          options.min = `{${ruleObj.lSelect}}`;
        }
      } else {
        if (ruleObj.select) {
          switch (ruleObj.rule) {
            case "=":
              options.max = `{${ruleObj.select}}`;
              options.min = `{${ruleObj.select}}`;
              break;
            case ">":
              options.min = `{${ruleObj.select}} + 0.0001`;
              break;
            case "<":
              options.max = `{${ruleObj.select}} - 0.0001`;
              break;
            case ">=":
              options.min = `{${ruleObj.select}}`;
              break;
            case "<=":
              options.max = `{${ruleObj.select}}`;
              break;
          }
        }
      }
    }
  }
  // 图片数量 上传最大和最小判断
  static verifyImageNumber(rule: string, options: any, controlOptions: any) {
    let arr = rule.split("_");
    let type = arr.shift();
    if (type !== "batch") {
      return options;
    } else if (arr.length) {
      for (let item of arr) {
        let [key, val] = item.split(":");
        switch (key) {
          case "min":
            options.minCount = +val;
            break;
          case "max":
            options.maxCount = +val;
            break;
        }
      }
    }
  }

  static isJSONString(str: string) {
    try {
      if (typeof JSON.parse(str) == "object") {
        return true;
      }
    } catch (e) {}
    return false;
  }
}

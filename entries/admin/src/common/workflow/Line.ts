import { LINE } from '@/typings/line';
import { Activity } from '@/typings/workflow';
import { WorkflowElementType } from '@/typings/workflowElementType';
/**
 * @class Line
 * @description 两个节点之间的连线
 */
class Line {
  ID: number;
  text: string;
  name_i18n?: Object | string;
  textPosition: LINE.point;
  WorkflowElementType: WorkflowElementType;
  startActivity?: Activity;
  endActivity?: Activity;
  startPoint: LINE.point;
  endPoint: LINE.point | undefined;
  startDirection: LINE.ArrowDirection;
  endDirection: LINE.ArrowDirection;
  crossPoints: Array<LINE.crossPoint>;
  points: Array<LINE.point>;
  offsetToStartActivity: LINE.point;
  offsetToEndActivity: LINE.point;
  Path: string;
  Arrow: string;
  isSelected: boolean;
  needRedraw: boolean;
  handlerPoints: Array<LINE.handlerPoint>;
  // fixedPoint: boolean;
  /* 线段右侧属性 */
  code?: string;
  formula?: string;
  utilizeElse?: boolean;
  popupType?: LINE.popupTypes; // 弹窗类型： 表达式1 函数2

  constructor(lineConfig: LINE.config) {
    // ID
    this.ID = 0;
    // 元素类型
    this.WorkflowElementType = WorkflowElementType.Line;
    // 起点活动节点
    this.startActivity = undefined;
    // 结束活动节点
    this.endActivity = undefined;
    // 连接点位于起点活动的边的方向
    this.startDirection = 0;
    // 连接点位于结束活动的边的方向
    this.endDirection = 0;
    // 起点相对于开始活动的偏移
    this.offsetToStartActivity = { x: 0, y: 0 };
    // 终点相对于结束活动的偏移
    this.offsetToEndActivity = { x: 0, y: 0 };
    // 折线点集，不包含箭头
    this.points = [];
    // 起点
    this.startPoint = { x: 0, y: 0 };
    // 终点
    this.endPoint = undefined;
    // 标签文字
    this.text = '';
    // 标签文字国际化
    this.name_i18n = {};
    // 标签位置
    this.textPosition = { x: 0, y: 0 };
    // 连线间的交点
    this.crossPoints = [];
    // 是否固定点
    // this.fixedPoint = false;
    // // 绘制路径对象
    this.Path = '';
    // // 绘制箭头对象
    this.Arrow = '';
    // // 当前是否被选中
    this.isSelected = false;
    // // 当前是否需要重新绘线
    this.needRedraw = false;
    // 所有控制点的坐标
    this.handlerPoints = [];
    /* ///////////////// */
    // 线段编码
    this.code = '';
    // 线段函数
    this.formula = '';
    // 线段条件是否为Else
    this.utilizeElse = false;
    // 默认条件视图
    this.popupType = LINE.popupTypes.expression;

    // 初始化
    this.init(lineConfig);
  }

  /* 静态变量 */
  static settings = {
    // 最小线段长
    MinSegementLength: 20,
    // 箭头长
    ArrowLength: 10,
    // 箭头宽
    ArrowWidth: 6,
    // 线条圆角半径
    CornerRadius: 3,
    // 交点半径
    CrossRadius: 5,
    // 寻找最近活动时，垂直距离的权重加成
    VerticalPerceage: 1.1,
    // 接近时停靠到活动的距离
    DockDistanceToEdge: 20,
    // 接近活动边的中点时自动停靠的距离
    DockDisntaceToEdgeCenter: 10,
    // 标签文字字号
    FontSize: 14
  }

  /* 静态方法 */
  /* ////////////////////////////////////////////////////////////////////////////////////////////// */
  /**
   * @description 计算单个点相对节点原点的偏移，返回一对偏移率
   * @param point ：Point 单点的坐标
   * @param activity : activity 节点
   * @return offset: Point 相对偏移率
   */
  static offsetToActivity(point: LINE.point, activity: Activity) {
    return {
      x: (point.x - activity.left) / activity.width,
      y: (point.y - activity.top) / activity.height,
    };
  }

  /**
   * @description 获取与原始方向相反的方向并返回
   * @param direction 原始的方向
   * @returns opDirection: LINE.ArrowDirection
   */
  static Opposite(direction: LINE.ArrowDirection) {
    let opDirection: LINE.ArrowDirection = LINE.ArrowDirection.Unspecified;
    switch (direction) {
      case LINE.ArrowDirection.up:
        opDirection = LINE.ArrowDirection.down;
        break;
      case LINE.ArrowDirection.down:
        opDirection = LINE.ArrowDirection.up;
        break;
      case LINE.ArrowDirection.left:
        opDirection = LINE.ArrowDirection.right;
        break;
      case LINE.ArrowDirection.right:
        opDirection = LINE.ArrowDirection.left;
        break;
    }
    return opDirection;
  }

  /**
   * @description 根据偏移和节点计算出起始点或终点的具体坐标
   * @param activity 节点
   * @param offset 相对偏移率
   * @returns point 返回具体坐标
   */
  static calcPoint(activity: Activity, offset: LINE.point) {
    const {
      left, top, width, height
    } = activity;
    return {
      x: left + offset.x * width,
      y: top + offset.y * height
    };
  }

  /**
   * @description 计算点在节点上时，连接的箭头方向
   * @param activity 节点
   * @param point 点的坐标
   * @returns direction 方向
   */
  static calcDirection(activity: Activity, point: LINE.point) {
    const {
      left, top, bottom, right
    } = activity;
    const { x, y } = point;
    let _arrowDirection;
    const _minY = Math.min(bottom, top);
    const _maxY = Math.max(bottom, top);
    if (x === left && y < _maxY && y > _minY) {
      _arrowDirection = LINE.ArrowDirection.left;
    } else if (y === top && x > left && x < right) {
      _arrowDirection = LINE.ArrowDirection.up;
    } else if (x === right && y < _maxY && y > _minY) {
      _arrowDirection = LINE.ArrowDirection.right;
    } else if (y === bottom && x > left && x < right) {
      _arrowDirection = LINE.ArrowDirection.down;
    } else {
      _arrowDirection = LINE.ArrowDirection.Unspecified;
    }
    return _arrowDirection;
  }

  /**
   * @description 根据已知点及其箭头方向，计算另一个点的箭头方向
   * @param _startPoint
   * @param _startDirection
   * @param _endPoint
   */
  static getEndDirection(_startPoint: LINE.point, _startDirection: LINE.ArrowDirection, _endPoint: LINE.point) {
    const { MinSegementLength } = this.settings;
    const { x: originX, y: originY } = _startPoint;
    const { x: targetX, y: targetY } = _endPoint;
    let _endDirection = LINE.ArrowDirection.Unspecified;
    switch (_startDirection) {
      case LINE.ArrowDirection.up:
        if (targetY < originY - MinSegementLength) {
          _endDirection = LINE.ArrowDirection.down;
        } else {
          _endDirection = LINE.ArrowDirection.up;
        }
        break;
      case LINE.ArrowDirection.down:
        if (targetY > originY + MinSegementLength) {
          _endDirection = LINE.ArrowDirection.up;
        } else {
          _endDirection = LINE.ArrowDirection.down;
        }
        break;
      case LINE.ArrowDirection.left:
        if (targetX < originX - MinSegementLength) {
          _endDirection = LINE.ArrowDirection.right;
        } else {
          _endDirection = LINE.ArrowDirection.left;
        }
        break;
      case LINE.ArrowDirection.right:
        if (targetX > originX + MinSegementLength) {
          _endDirection = LINE.ArrowDirection.left;
        } else {
          _endDirection = LINE.ArrowDirection.right;
        }
        break;
    }
    return _endDirection;
  }

  /**
   * @description 根据起始点及其箭头方向，计算出绘制连接线途径的折点集合
   * @param _startPoint
   * @param _startDirection
   * @param _endPoint
   * @param _endDirection
   * @returns _points 折点集合（包括起始点）
   */
  static calculatePoints(_startPoint: LINE.point, _startDirection: LINE.ArrowDirection, _endPoint: LINE.point, _endDirection: LINE.ArrowDirection) {
    const { MinSegementLength, ArrowLength } = this.settings;
    const { x: originX, y: originY } = _startPoint;
    const { x: targetX, y: targetY } = _endPoint;
    const _points : any[] = [];
    _points.push(_startPoint);

    if (originX === targetX && originY === targetY && _startDirection === _endDirection) {
      switch (_startDirection) {
        case LINE.ArrowDirection.left:
          _points.push({
            x: _startPoint.x - MinSegementLength,
            y: _startPoint.y
          });
          break;
        case LINE.ArrowDirection.right:
          _points.push({
            x: _startPoint.x + MinSegementLength,
            y: _startPoint.y
          });
          break;
        case LINE.ArrowDirection.up:
          _points.push({
            x: _startPoint.x,
            y: _startPoint.y - MinSegementLength
          });
          break;
        case LINE.ArrowDirection.down:
          _points.push({
            x: _startPoint.x,
            y: _startPoint.y + MinSegementLength
          });
          break;
      }
      _points.push(_endPoint);

      return _points;
    }

    switch (_startDirection) {
      case LINE.ArrowDirection.up:
        {
          switch (_endDirection) {
            case LINE.ArrowDirection.left:
              {
                // 第一象限
                if (targetY < originY && targetX > originX) { _points.push({ x: originX, y: targetY }); }
                // 第二象限
                else if (targetY < originY && targetX <= originX) {
                  _points.push({ x: originX, y: originY / 2 + targetY / 2 });
                  _points.push({ x: targetX - MinSegementLength, y: originY / 2 + targetY / 2 });
                  _points.push({ x: targetX - MinSegementLength, y: targetY });
                }
                // 第三象限
                else if (targetY >= originY && targetX <= originX) {
                  _points.push({ x: originX, y: (originY - MinSegementLength) });
                  _points.push({ x: (targetX - MinSegementLength), y: (originY - MinSegementLength) });
                  _points.push({ x: (targetX - MinSegementLength), y: targetY });
                }
                // 第四象限
                else {
                  _points.push({ x: originX, y: (originY - MinSegementLength) });
                  _points.push({ x: (originX / 2 + targetX / 2), y: (originY - MinSegementLength) });
                  _points.push({ x: (originX / 2 + targetX / 2), y: targetY });
                }
              }
              break;
            case LINE.ArrowDirection.down:
              // 第一二象限
              if (targetY < originY - MinSegementLength) {
                _points.push({ x: originX, y: (originY / 2 + targetY / 2) });
                _points.push({ x: targetX, y: (originY / 2 + targetY / 2) });
              }
              // 直线
              else if (targetX == originX && targetY < originY) {
              }
              // 第三四象限
              else {
                _points.push({ x: originX, y: (originY - MinSegementLength) });
                _points.push({ x: (originX / 2 + targetX / 2), y: (originY - MinSegementLength) });
                _points.push({ x: (originX / 2 + targetX / 2), y: (targetY + MinSegementLength) });
                _points.push({ x: targetX, y: (targetY + MinSegementLength) });
              }
              break;
            case LINE.ArrowDirection.right:
              {
                // 第一象限
                if (targetY < originY && targetX > originX) {
                  _points.push({ x: originX, y: (originY / 2 + targetY / 2) });
                  _points.push({ x: (targetX + MinSegementLength), y: (originY / 2 + targetY / 2) });
                  _points.push({ x: (targetX + MinSegementLength), y: targetY });
                }
                // 第二象限
                else if (targetY < originY && targetX <= originX) {
                  _points.push({ x: originX, y: targetY });
                }
                // 第三象限
                else if (targetY >= originY && targetX <= originX) {
                  _points.push({ x: originX, y: (originY - MinSegementLength) });
                  _points.push({ x: (originX / 2 + targetX / 2), y: (originY - MinSegementLength) });
                  _points.push({ x: (originX / 2 + targetX / 2), y: targetY });
                }
                // 第四象限
                else {
                  _points.push({ x: originX, y: (originY - MinSegementLength) });
                  _points.push({ x: (targetX + MinSegementLength), y: (originY - MinSegementLength) });
                  _points.push({ x: (targetX + MinSegementLength), y: targetY });
                  _points.push({ x: (targetX + ArrowLength), y: targetY });
                }
              }
              break;
            case LINE.ArrowDirection.up:
              {
                // 第一二象限
                if (targetY < originY) {
                  _points.push({ x: originX, y: (targetY - MinSegementLength) });
                  _points.push({ x: (targetX), y: (targetY - MinSegementLength) });
                }
                // 第三/四象限
                else {
                  _points.push({ x: originX, y: (originY - MinSegementLength) });
                  _points.push({ x: targetX, y: (originY - MinSegementLength) });
                }
              }
              break;
          }
          break;
        }
      case LINE.ArrowDirection.down:
        {
          switch (_endDirection) {
            case LINE.ArrowDirection.left:
              // 第二象限
              if (targetX < originX && targetY < originY) {
                _points.push({ x: originX, y: (originY + MinSegementLength) });
                _points.push({ x: (targetX - MinSegementLength), y: (originY + MinSegementLength) });
                _points.push({ x: (targetX - MinSegementLength), y: targetY });
              }
              // 第三象限
              else if (targetX < originX && targetY > originY) {
                _points.push({ x: originX, y: (originY / 2 + targetY / 2) });
                _points.push({ x: (targetX - MinSegementLength), y: (originY / 2 + targetY / 2) });
                _points.push({ x: (targetX - MinSegementLength), y: targetY });
              }
              // 第一象限
              else if (targetX >= originX && targetY <= originY) {
                _points.push({ x: originX, y: (originY + MinSegementLength) });
                _points.push({ x: (originX / 2 + targetX / 2), y: (originY + MinSegementLength) });
                _points.push({ x: (originX / 2 + targetX / 2), y: targetY });
              }
              // 第四象限
              else {
                _points.push({ x: originX, y: targetY });
              }
              break;
            case LINE.ArrowDirection.down:
              // 第一二象限
              if (targetY < originY) {
                _points.push({ x: originX, y: (originY + MinSegementLength) });
                _points.push({ x: targetX, y: (originY + MinSegementLength) });
              }
              // 第三四象限
              else {
                _points.push({ x: originX, y: (targetY + MinSegementLength) });
                _points.push({ x: targetX, y: (targetY + MinSegementLength) });
              }
              break;
            case LINE.ArrowDirection.right:
              // 第二象限
              if (targetX < originX && targetY < originY) {
                _points.push({ x: originX, y: (originY + MinSegementLength) });
                _points.push({ x: (originX / 2 + targetX / 2), y: (originY + MinSegementLength) });
                _points.push({ x: (originX / 2 + targetX / 2), y: targetY });
              }
              // 第三象限
              else if (targetX < originX && targetY > originY) {
                _points.push({ x: originX, y: targetY });
              }
              // 第一象限
              else if (targetX >= originX && targetY <= originY) {
                _points.push({ x: originX, y: (originY + MinSegementLength) });
                _points.push({ x: (targetX + MinSegementLength), y: (originY + MinSegementLength) });
                _points.push({ x: (targetX + MinSegementLength), y: targetY });
              }
              // 第四象限
              else {
                _points.push({ x: originX, y: (originY / 2 + targetY / 2) });
                _points.push({ x: (targetX + MinSegementLength), y: (originY / 2 + targetY / 2) });
                _points.push({ x: (targetX + MinSegementLength), y: targetY });
              }
              break;
            case LINE.ArrowDirection.up:
              // 第一二象限
              if (targetY - MinSegementLength < originY) {
                _points.push({ x: originX, y: (originY + MinSegementLength) });
                _points.push({ x: (originX / 2 + targetX / 2), y: (originY + MinSegementLength) });
                _points.push({ x: (originX / 2 + targetX / 2), y: (targetY - MinSegementLength) });
                _points.push({ x: targetX, y: (targetY - MinSegementLength) });
              }
              // 直线
              else if (targetX == originX && targetY > originY) {
              }
              // 第三四象限
              else {
                _points.push({ x: originX, y: (originY / 2 + targetY / 2) });
                _points.push({ x: targetX, y: (originY / 2 + targetY / 2) });
              }
              break;
          }
        }
        break;
      case LINE.ArrowDirection.left:
        {
          switch (_endDirection) {
            case LINE.ArrowDirection.left:
              // 第二三象限
              if (targetX < originX) {
                _points.push({ x: (targetX - MinSegementLength), y: originY });
                _points.push({ x: (targetX - MinSegementLength), y: targetY });
              }
              // 第一四象限
              else {
                _points.push({ x: (originX - MinSegementLength), y: originY });
                _points.push({ x: (originX - MinSegementLength), y: targetY });
              }
              break;
            case LINE.ArrowDirection.down:
              // 第二象限
              if (targetX < originX && targetY < originY) {
                _points.push({ x: targetX, y: originY });
              }
              // 第三象限
              else if (targetX < originX && targetY >= originY) {
                _points.push({ x: (originX / 2 + targetX / 2), y: originY });
                _points.push({ x: (originX / 2 + targetX / 2), y: (targetY + MinSegementLength) });
                _points.push({ x: targetX, y: (targetY + MinSegementLength) });
              }
              // 第一象限
              else if (targetX >= originX && targetY <= originY) {
                _points.push({ x: (originX - MinSegementLength), y: originY });
                _points.push({ x: (originX - MinSegementLength), y: (originY / 2 + targetY / 2) });
                _points.push({ x: targetX, y: (originY / 2 + targetY / 2) });
              }
              // 第四象限
              else {
                _points.push({ x: (originX - MinSegementLength), y: originY });
                _points.push({ x: (originX - MinSegementLength), y: (targetY + MinSegementLength) });
                _points.push({ x: targetX, y: (targetY + MinSegementLength) });
              }
              break;
            case LINE.ArrowDirection.right:
              // 第二三象限
              if (targetX < originX - MinSegementLength) {
                _points.push({ x: (originX / 2 + targetX / 2), y: originY });
                _points.push({ x: (originX / 2 + targetX / 2), y: targetY });
              }
              // 直线
              else if (targetX < originX && targetY == originY) {
              }
              // 第一四象限
              else {
                _points.push({ x: (originX - MinSegementLength), y: originY });
                _points.push({ x: (originX - MinSegementLength), y: (originY / 2 + targetY / 2) });
                _points.push({ x: (targetX + MinSegementLength), y: (originY / 2 + targetY / 2) });
                _points.push({ x: (targetX + MinSegementLength), y: targetY });
              }
              break;
            case LINE.ArrowDirection.up:
              // 第一象限
              if (targetX > originX && targetY < originY) {
                _points.push({ x: (originX - MinSegementLength), y: originY });
                _points.push({ x: (originX - MinSegementLength), y: (targetY - MinSegementLength) });
                _points.push({ x: targetX, y: (targetY - MinSegementLength) });
              }
              // 第二象限
              else if (targetX <= originX && targetY <= originY) {
                _points.push({ x: (originX / 2 + targetX / 2), y: originY });
                _points.push({ x: (originX / 2 + targetX / 2), y: (targetY - MinSegementLength) });
                _points.push({ x: targetX, y: (targetY - MinSegementLength) });
              }
              // 第三象限
              else if (targetX < originX && targetY > originY) {
                _points.push({ x: targetX, y: originY });
              }
              // 第四象限
              else {
                _points.push({ x: (originX - MinSegementLength), y: originY });
                _points.push({ x: (originX - MinSegementLength), y: (originY / 2 + targetY / 2) });
                _points.push({ x: targetX, y: (originY / 2 + targetY / 2) });
              }
              break;
          }
        }
        break;
      case LINE.ArrowDirection.right:
        {
          switch (_endDirection) {
            case LINE.ArrowDirection.left:
              // 第二三象限
              if (targetX - MinSegementLength < originX) {
                _points.push({ x: (originX + MinSegementLength), y: originY });
                _points.push({ x: (originX + MinSegementLength), y: (originY / 2 + targetY / 2) });
                _points.push({ x: (targetX - MinSegementLength), y: (originY / 2 + targetY / 2) });
                _points.push({ x: (targetX - MinSegementLength), y: targetY });
              }
              // 直线
              else if (targetX > originX && targetY == originY) {
              }
              // 第一四象限
              else {
                _points.push({ x: (originX / 2 + targetX / 2), y: originY });
                _points.push({ x: (originX / 2 + targetX / 2), y: targetY });
              }
              break;
            case LINE.ArrowDirection.down:
              // 第二象限
              if (targetX < originX && targetY < originY) {
                _points.push({ x: (originX + MinSegementLength), y: originY });
                _points.push({ x: (originX + MinSegementLength), y: (originY / 2 + targetY / 2) });
                _points.push({ x: targetX, y: (originY / 2 + targetY / 2) });
              }
              // 第三象限
              else if (targetX < originX && targetY >= originY) {
                _points.push({ x: (originX + MinSegementLength), y: originY });
                _points.push({ x: (originX + MinSegementLength), y: (targetY + MinSegementLength) });
                _points.push({ x: targetX, y: (targetY + MinSegementLength) });
              }
              // 第一象限
              else if (targetX >= originX && targetY <= originY) {
                _points.push({ x: targetX, y: originY });
              }
              // 第四象限
              else {
                _points.push({ x: (originX / 2 + targetX / 2), y: originY });
                _points.push({ x: (originX / 2 + targetX / 2), y: (targetY + MinSegementLength) });
                _points.push({ x: targetX, y: (targetY + MinSegementLength) });
              }
              break;
            case LINE.ArrowDirection.right:
              // 第二三象限
              if (targetX < originX) {
                _points.push({ x: (originX + MinSegementLength), y: originY });
                _points.push({ x: (originX + MinSegementLength), y: targetY });
              }
              // 第一四象限
              else {
                _points.push({ x: (targetX + MinSegementLength), y: originY });
                _points.push({ x: ((targetX + MinSegementLength)), y: targetY });
              }
              break;
            case LINE.ArrowDirection.up:
              // 第一象限
              if (targetX > originX && targetY < originY) {
                _points.push({ x: (originX / 2 + targetX / 2), y: originY });
                _points.push({ x: (originX / 2 + targetX / 2), y: (targetY - MinSegementLength) });
                _points.push({ x: targetX, y: (targetY - MinSegementLength) });
              }
              // 第二象限
              else if (targetX <= originX && targetY <= originY) {
                _points.push({ x: (originX + MinSegementLength), y: originY });
                _points.push({ x: (originX + MinSegementLength), y: (targetY - MinSegementLength) });
                _points.push({ x: targetX, y: (targetY - MinSegementLength) });
              }
              // 第三象限
              else if (targetX < originX && targetY > originY) {
                _points.push({ x: (originX + MinSegementLength), y: originY });
                _points.push({ x: (originX + MinSegementLength), y: (originY / 2 + targetY / 2) });
                _points.push({ x: targetX, y: (originY / 2 + targetY / 2) });
              }
              // 第四象限
              else {
                _points.push({ x: targetX, y: originY });
              }
              break;
          }
        }
        break;
    }
    _points.push({
      x: targetX,
      y: targetY
    });

    // 合并在一条直线上的线段
    for (let i = _points.length - 1; i >= 2; i--) {
      if ((_points[i].x == _points[i - 1].x && _points[i - 1].x == _points[i - 2].x)
        || (_points[i].y == _points[i - 1].y && _points[i - 1].y == _points[i - 2].y)) {
        _points.splice(i - 1, 1);
      }
    }

    return _points;
  }

  /**
   * @description 计算终点上绘制的箭头的箭尾的中点的坐标
   *              -
   *              -  -
   * 目标点o-> === o  -  -  e   <- 终点
   *              -  -
   *              -
   * @param _endPoint 终点坐标
   * @param _endDirection 终点方向
   * @returns o { x: number, y: number } 箭尾中点
   */
  static calcArrowTailPoint(_endPoint: LINE.point, _endDirection: LINE.ArrowDirection) {
    const _arrowTailPoint = {
      x: _endPoint.x,
      y: _endPoint.y
    };
    switch (_endDirection) {
      case LINE.ArrowDirection.up:
        _arrowTailPoint.y -= Line.settings.ArrowLength;
        break;
      case LINE.ArrowDirection.down:
        _arrowTailPoint.y += Line.settings.ArrowLength;
        break;
      case LINE.ArrowDirection.left:
        _arrowTailPoint.x -= Line.settings.ArrowLength;
        break;
      case LINE.ArrowDirection.right:
        _arrowTailPoint.x += Line.settings.ArrowLength;
        break;
      default:
        break;
    }
    return _arrowTailPoint;
  }

  /**
   * @description 当两个交叉点的距离小于交点拱形直径时，将两个交叉点合并
   * @param _crossOffsetXs
   * @param _newOffsetX
   */
  static joinToCrossOffsetX(_crossOffsetXs: Array<LINE.crossOffsetX>, _newOffsetX: any) {
    let inserted = false;
    const { CrossRadius } = Line.settings;
    if (_crossOffsetXs && _crossOffsetXs.length) {
      for (let _crossIndex = 0; _crossIndex < _crossOffsetXs.length; _crossIndex++) {
        const curOffset = _crossOffsetXs[_crossIndex];
        if (_newOffsetX + CrossRadius < curOffset.start) {
          // 替换交叉点
          _crossOffsetXs.splice(_crossIndex, 0, {
            start: _newOffsetX - CrossRadius,
            end: _newOffsetX + CrossRadius
          });
          inserted = true;
          break;
        } else if (
          // 如果可以合入当前范围
          _newOffsetX >= curOffset.start - CrossRadius
          && _newOffsetX <= curOffset.end + CrossRadius
        ) {
          _crossOffsetXs[_crossIndex].start = Math.min(curOffset.start, _newOffsetX - CrossRadius);
          _crossOffsetXs[_crossIndex].end = Math.max(curOffset.end, _newOffsetX + CrossRadius);
          // 判断合入下一个范围

          if (
            _crossIndex < _crossOffsetXs.length - 1
            && curOffset.end >= _crossOffsetXs[_crossIndex + 1].start
          ) {
            _crossOffsetXs[_crossIndex].end = _crossOffsetXs[_crossIndex + 1].end;
            _crossOffsetXs.splice(_crossIndex + 1, 1);
          }
          inserted = true;
          break;
        }
      }
    }
    if (!inserted) {
      _crossOffsetXs.push({
        start: _newOffsetX - CrossRadius,
        end: _newOffsetX + CrossRadius
      });
    }
    return _crossOffsetXs;
  }

  /**
   * 判断线段的控制点的移动方向与坐标——线段中垂线交点上。
   * @param _startPoint 线段第一个点
   * @param _endPoint 线段第二个点
   * @returns _handlerDireciton
   */
  static calcHandlerPoint(_startPoint: LINE.point, _endPoint: LINE.point) {
    let Direction: LINE.HandlerDirection = LINE.HandlerDirection.Unspecified;
    const _point: LINE.point = { x: 0, y: 0 };
    if (_startPoint.x === _endPoint.x && _startPoint.y !== _endPoint.y) {
      Direction = LINE.HandlerDirection.Horizontal;
      _point.x = _startPoint.x;
      _point.y = (_startPoint.y + _endPoint.y) / 2;
    } else if (_startPoint.y === _endPoint.y && _startPoint.x !== _endPoint.x) {
      Direction = LINE.HandlerDirection.Vertical;
      _point.y = _startPoint.y;
      _point.x = (_startPoint.x + _endPoint.x) / 2;
    }
    return {
      Direction,
      ..._point,
      Activity: undefined
    };
  }

  /**
 * @param point 目标点
 * @param activity 目标节点
 * @return { boolean } flag
 * @description 判断目标点是否在目标节点的边缘上
 */
  static checkIfOnSide(point: LINE.point, activity: Activity) {
    let flag = false;
    const { x, y } = point;
    const { left, top, right, bottom, } = activity;

    if (x === left || x === right) {
      flag = (y >= top && y <= bottom);
    } else if (y === top || y === bottom) {
      flag = (x >= left && x <= right);
    }

    return flag;
  }

  /**
 * @param point 目标点
 * @param activity 目标节点
 */
  static fixPoint(point: LINE.point, activity: Activity): LINE.point {
    const isOnSide: boolean = Line.checkIfOnSide(point, activity);
    const actrualPosition = { ...point };
    if (!isOnSide) {
      /* TODO: 修复初始点 */
      const distanceToTop = Math.abs(point.y - activity.y);
      const distanceToBottom = Math.abs(point.y - activity.y - activity.height);
      const distanceToLeft = Math.abs(point.x - activity.x);
      const distanceToRight = Math.abs(point.x - activity.x - activity.width);
      const minDistance = Math.min(distanceToTop, distanceToBottom, distanceToLeft, distanceToRight);
      if (minDistance === distanceToTop) {
        actrualPosition.y = activity.y;
        actrualPosition.x = activity.x + activity.width / 2;
      } else if (minDistance === distanceToBottom) {
        actrualPosition.y = activity.y + activity.height;
        actrualPosition.x = activity.x + activity.width / 2;
      } else if (minDistance === distanceToLeft) {
        actrualPosition.x = activity.x;
        actrualPosition.y = activity.y + activity.height / 2;
      } else if (minDistance === distanceToRight) {
        actrualPosition.x = activity.x + activity.width;
        actrualPosition.y = activity.y + activity.height / 2;
      }
    }
    return actrualPosition;
  }

  /* 公共方法 */
  /* ////////////////////////////////////////////////////////////////////////////////////////////// */
  /**
   * @param lineConfig: LINE.config 新连线的配置信息
   * @description 初始化一个连线
   */
  init(lineConfig: LINE.config) {
    this.ID = lineConfig.ID;
    this.text = lineConfig.text || '';
    this.name_i18n = lineConfig.name_i18n || '';
    this.startActivity = lineConfig.startActivity;
    this.startPoint = {
      x: +lineConfig.startPoint.x,
      y: +lineConfig.startPoint.y
    };
    this.startDirection = lineConfig.startDirection || LINE.ArrowDirection.Unspecified;
    this.endActivity = lineConfig.endActivity;
    this.endDirection = lineConfig.endDirection || LINE.ArrowDirection.Unspecified;
    if (lineConfig.endPoint) {
      this.endPoint = {
        x: +lineConfig.endPoint.x,
        y: +lineConfig.endPoint.y
      };
    }
    this.points = lineConfig.points || [];
    this.crossPoints = this.crossPoints || [];
    // 设置相对于活动原点的偏移
    this.setOffsetToActivity();
    /* 连接线的线段属性 */
    this.code = lineConfig.code;
    this.formula = lineConfig.formula;
    this.utilizeElse = lineConfig.utilizeElse;
    this.popupType = lineConfig.popupType;
    this.setTextPosition();
  }

  /**
   * @description 设置连线的属性值
   * @param props 传入需要更新的对象键值
   */
  setProps(props: LINE.props) {
    const keys = Object.keys(props);
    // 如果只是修改标签，则只需要修改标签文本内容即可
    if (keys.length === 1 && keys.includes('text')) {
      this.text = props.text || '';
      return;
    }
    // 直接对象合并多个传入属性
    Object.assign(this, props);
    const {
      startPoint, endPoint, startActivity, endActivity, points
    } = props;
    // 如果修改了起始点或者起始点的方向，则需要重新计算偏移和路径折点集合
    if (startPoint || endPoint || startActivity || endActivity) {
      this.setOffsetToActivity();
    }
    if (!points) {
      this.setPoints();
    }
  }

  /**
   * @description 选中线
   */
  select() {
    this.isSelected = true;
    this.setHandlerPoints();
  }

  /**
   * @description 取消选中线
   */
  Unselect() {
    this.isSelected = false;
    this.handlerPoints = [];
  }

  /**
   * @description 设置相对于活动原点的偏移
   */
  setOffsetToActivity() {
    if (this.startPoint && this.startActivity) {
      this.offsetToStartActivity = Line.offsetToActivity(this.startPoint, this.startActivity);
    }
    if (this.endPoint && this.endActivity) {
      this.offsetToEndActivity = Line.offsetToActivity(this.endPoint, this.endActivity);
    }
  }

  /**
   * @description 设置起始点的方向
   */
  setDirections() {
    if (!this.startDirection && this.startActivity && this.startPoint) {
      this.startDirection = Line.calcDirection(this.startActivity, this.startPoint);
    }
    if (!this.endDirection && this.endActivity && this.endPoint) {
      this.endDirection = Line.calcDirection(this.endActivity, this.endPoint);
    }
  }

  /**
   *
   * @param _ResetStartAndEnd Boolean 是否重置起点和终点
   * @description 计算获取连线路径的折点
   */
  setPoints(_ResetStartAndEnd?: boolean) {
    this.needRedraw = true;
    // this.TextX = this.TextY = 0;
    // this.fixedPoint = false;
    if (_ResetStartAndEnd) {
      if (this.startActivity) {
        this.startPoint = Line.calcPoint(this.startActivity, this.offsetToStartActivity);
      }
      if (this.endActivity) {
        this.endPoint = Line.calcPoint(this.endActivity, this.offsetToEndActivity);
      }
    }

    if (!this.endPoint) {
      return;
    }

    this.setDirections();

    if (this.startDirection == LINE.ArrowDirection.Unspecified && this.endDirection == LINE.ArrowDirection.Unspecified) {
      return;
    }

    if (this.endDirection == LINE.ArrowDirection.Unspecified) { this.endDirection = Line.getEndDirection(this.startPoint, this.startDirection, this.endPoint); } else if (this.startDirection == LINE.ArrowDirection.Unspecified) {
      this.startDirection = Line.getEndDirection(this.endPoint, this.endDirection, this.startPoint);
    }

    // 更新线条相对于活动边的位置信息
    this.setOffsetToActivity();

    this.points = Line.calculatePoints(this.startPoint, this.startDirection, this.endPoint, this.endDirection);
    // 同时更新标签位置
    this.setTextPosition();
  }

  /**
   * @description 设置标签文字位置
   */
  setTextPosition(position?: LINE.point) {
    const _len: number = this.points.length;
    if (!_len) {
      return;
    }
    let _x: number = position ? position.x : 0,
      _y: number = position ? position.y : 0;
    if (!_x && !_y) {
      switch (_len) {
        case 2:
          _x = (this.points[0].x + this.points[1].x) / 2;
          _y = (this.points[0].y + this.points[1].y) / 2;
          break;
        case 3:
        case 4:
          _x = (this.points[1].x + this.points[2].x) / 2;
          _y = (this.points[1].y + this.points[2].y) / 2;
          break;
        case 5:
        case 6:
          _x = (this.points[2].x + this.points[3].x) / 2;
          _y = (this.points[2].y + this.points[3].y) / 2;
          break;
        default:
          // code...
          break;
      }
    }
    this.textPosition = {
      // x: _x - this.text.length * (Line.settings.FontSize / 3),
      // y: _y + Line.settings.FontSize / 3,
      x: _x,
      y: _y,
    }
  }

  /**
   * @description 设置连接线上的控制点
   */
  setHandlerPoints() {
    const _pointsCount = this.points.length;
    if (_pointsCount < 2) {
      return;
    }
    let _points: Array<LINE.handlerPoint> = [];

    /* 计算折线中点作为控制点: 线段的两端不能为同一个点 */
    this.points.forEach((point: LINE.point, idx: number) => {
      if (idx < _pointsCount - 2 && idx > 0) {
        const _segStart = point;
        const _segEnd = this.points[idx + 1];
        const _handler = Line.calcHandlerPoint(_segStart, _segEnd);
        if (_handler.x !== 0 && _handler.y !== 0) {
          _points.push(_handler);
        }
      }
    });

    /* 移除在一条线上的控制点 */
    // for (let i = _points.length - 1; i >= 1; i--) {
    //   if ((_points[i].x == _points[i - 1].x) || (_points[i].y == _points[i - 1].y)) {
    //     if (i > 1) {
    //       _points.splice(i - 1, 1);
    //     } else {
    //       _points.splice(i, 1);
    //     }
    //   }
    // }

    /* 堆栈起点 */
    const _firstHandler: LINE.handlerPoint = Line.calcHandlerPoint(this.points[0], this.points[1]);
    _firstHandler.x = this.points[0].x;
    _firstHandler.y = this.points[0].y;
    _firstHandler.Activity = this.startActivity;
    _points.unshift(_firstHandler);

    /* 堆栈终点 */
    const _lastHandler: LINE.handlerPoint = Line.calcHandlerPoint(this.points[_pointsCount - 2], this.points[_pointsCount - 1]);
    _lastHandler.x = this.points[_pointsCount - 1].x;
    _lastHandler.y = this.points[_pointsCount - 1].y;
    _lastHandler.Activity = this.endActivity;
    _points.push(_lastHandler);
    
    /* 至少要保留起点和终点 */
    if (_points.length < 2) {
      _points = [
        _firstHandler,
        _lastHandler
      ];
    }
    // console.log(this.points,_points);
    this.handlerPoints = _points;
  }

  /**
   * @description 移除与目标线的所有交点
   * @param lineId 目标线的id
   */
  removeCrossPointToLine(lineId: number) {
    if (this.crossPoints && this.crossPoints.length) {
      this.crossPoints = this.crossPoints.filter((crossPoint: LINE.crossPoint) => crossPoint.verticalLineId !== lineId);
      this.needRedraw = true;
    }
  }

  /**
   * @description 添加目标线的交点
   * @param x
   * @param y
   * @param verticalLineId
   */
  addCrossPoint(x: number, y: number, verticalLineId: number) {
    if (!this.crossPoints) {
      this.crossPoints = [];
    }
    this.crossPoints.push({
      x,
      y,
      verticalLineId
    });
    this.needRedraw = true;
  }

  /**
   * @description 判断当前连接线上的交叉点
   * @param lines 当前已存在的所有连接线
   */
  calcCrossPoints(lines: Array<Line>) {
    const self = this;
    const _arrowTailPoint: any = {};
    this.crossPoints = [];
    const _minRoom = Line.settings.CornerRadius + Line.settings.CrossRadius;

    /* 移除每条相关线上的交点，并收集箭尾中点 */
    lines.forEach((curLine: Line) => {
      curLine.removeCrossPointToLine(self.ID);
      if (curLine.endPoint) {
        _arrowTailPoint[curLine.ID] = Line.calcArrowTailPoint(curLine.endPoint, curLine.endDirection);
      }
    });

    /* 计算交叉点 */
    this.points.forEach((point: LINE.point, idx: number) => {
      if (idx > 0) {
        // 当前线段的起始点
        const _segementStartPoint = self.points[idx - 1];
        let _segementEndPoint = point;
        // 如果已经是最后一点了，则以箭尾坐标来计算
        if (idx === self.points.length - 1) {
          _segementEndPoint = _arrowTailPoint[self.ID];
        }
        // 计算所有线与当前线段的交叉点
        lines.forEach((other: Line) => {
          if (other.ID !== self.ID) {
            other.points.forEach((oPoint: LINE.point, index: number) => {
              if (index > 0) {
                const _otherSegementStartPoint = other.points[index - 1];
                let _otherSegementEndPoint = oPoint;
                if (index === other.points.length - 1) {
                  _otherSegementEndPoint = _arrowTailPoint[other.ID];
                }
                // 交叉逻辑判断
                if (
                  // 当前线是水平方向
                  _segementStartPoint.y === _segementEndPoint.y
                  // 其他线是垂直方向
                  && _otherSegementStartPoint.x === _otherSegementEndPoint.x
                  /* 其他线的x坐标在当前线段的x方向范围内，且两端与垂直线的距离均大于交线+圆角半径和 */
                  // 当前线的左侧距离其他线的距离大于 线段圆角和交点圆角的总和
                  && _otherSegementStartPoint.x - Math.min(_segementStartPoint.x, _segementEndPoint.x) > _minRoom
                  // 当前线的右侧距离其他线的距离大于 线段圆角和交点圆角的总和
                  && Math.max(_segementStartPoint.x, _segementEndPoint.x) - _otherSegementStartPoint.x > _minRoom
                  /* 当前线的y坐标在其他线的y方向范围内，且其他线两端与当前线的距离均大于交线+圆角半径和 */
                  && _segementStartPoint.y - Math.min(_otherSegementStartPoint.y, _otherSegementEndPoint.y) > _minRoom
                  && Math.max(_otherSegementStartPoint.y, _otherSegementEndPoint.y) - _segementStartPoint.y > _minRoom
                ) {
                  /* 在当前线上添加交叉点 */
                  self.addCrossPoint(_otherSegementStartPoint.x, _segementStartPoint.y, other.ID);
                } else if (
                  // 其他线是水平线
                  _otherSegementStartPoint.y === _otherSegementEndPoint.y
                  // 当前线是竖直线
                  && _segementStartPoint.x == _segementEndPoint.x
                  && _segementStartPoint.x - Math.min(_otherSegementStartPoint.x, _otherSegementEndPoint.x) > _minRoom
                  && Math.max(_otherSegementStartPoint.x, _otherSegementEndPoint.x) - _segementStartPoint.x > _minRoom
                  && _otherSegementStartPoint.y - Math.min(_segementStartPoint.y, _segementEndPoint.y) > _minRoom
                  && Math.max(_segementStartPoint.y, _segementEndPoint.y) - _otherSegementStartPoint.y > _minRoom
                ) {
                  /* 在前一条线上添加交叉点' */
                  other.addCrossPoint(_segementStartPoint.x, _otherSegementStartPoint.y, self.ID);
                }
              }
            });
          }
        });
      }
    });
  }

  /**
   * @description 绘制连接线： 定义连接线的路径参数和箭头参数
   * @param drawCrossPoints 是否绘制交叉点
   */
  draw(drawCrossPoints?: boolean) {
    /* 如果点已设置，判断点是否在线上，否则重定位 */

    /* todo: 此处省略了标签文字重绘部分 */
    if (!this.points || this.points.length < 2) {
      return;
    }
    if (drawCrossPoints) {
      this.needRedraw = false;
    }
    const self = this;
    const {
      CornerRadius, CrossRadius, ArrowLength, ArrowWidth
    } = Line.settings;

    /* 使用svg绘制 */
    /* /////////////////////////////////////////////////////// */
    let pathDefine: string = '';
    // 结束于箭尾的点的集合
    const _PointsEndWithArrowTailPoint = [...this.points];
    // 最后一点修正为箭尾
    if (_PointsEndWithArrowTailPoint.length && self.endPoint) {
      _PointsEndWithArrowTailPoint[_PointsEndWithArrowTailPoint.length - 1] = Line.calcArrowTailPoint(self.endPoint, self.endDirection);
    }

    /* 画线 */
    _PointsEndWithArrowTailPoint.forEach((curPoint: LINE.point, index: number) => {
      if (index === 0) {
        pathDefine = `M${curPoint.x},${curPoint.y} `;
      }
      if (index < _PointsEndWithArrowTailPoint.length - 1) {
        const next = _PointsEndWithArrowTailPoint[index + 1];
        // 绘制交点
        if (
          drawCrossPoints
          // 水平线
          && curPoint.y === next.y
          && Math.abs(curPoint.x - next.x) >= (CornerRadius + CrossRadius) * 2
        ) {
          let crossOffsetXs: LINE.crossOffsetX[] = [];
          self.crossPoints.forEach((crossPoint: LINE.point) => {
            if (
              crossPoint.y === curPoint.y
              && crossPoint.x - Math.min(curPoint.x, next.x) > CornerRadius + CrossRadius
              && Math.max(curPoint.x, next.x) - crossPoint.x > CornerRadius + CrossRadius
            ) {
              crossOffsetXs = Line.joinToCrossOffsetX(crossOffsetXs, crossPoint.x);
            }
          });
          if (crossOffsetXs && crossOffsetXs.length) {
            if (curPoint.x < next.x) {
              // 添加拱点
              crossOffsetXs.forEach((cross: LINE.crossOffsetX) => {
                pathDefine += ` H ${cross.start} a${CrossRadius} ${CrossRadius} 0 0 1 ${CrossRadius} -${CrossRadius} H${cross.end - CrossRadius} a${CrossRadius} ${CrossRadius} 0 0 1 ${CrossRadius} ${CrossRadius} `;
              });
            } else {
              // 添加拱点
              for (let crossIndex = crossOffsetXs.length - 1; crossIndex >= 0; crossIndex--) {
                pathDefine += ` H ${crossOffsetXs[crossIndex].end} a${CrossRadius} ${CrossRadius} 0 0 0 -${CrossRadius} -${CrossRadius} H${crossOffsetXs[crossIndex].start + CrossRadius} a${CrossRadius} ${CrossRadius} 0 0 0 -${CrossRadius} ${CrossRadius} `;
              }
            }
          }
        }

        // 绘制到当前线的终点
        if (index === _PointsEndWithArrowTailPoint.length - 2) {
          pathDefine += `L ${next.x} ${next.y} `;
        } else {
          // 更下一个点
          const nexter = _PointsEndWithArrowTailPoint[index + 2];
          if (Math.abs(curPoint.x - next.x) + Math.abs(curPoint.y - next.y) > CornerRadius * 2
            && Math.abs(next.x - nexter.x) + Math.abs(next.y - nexter.y) > CornerRadius * 2
            && (nexter.x - curPoint.x !== 0 && nexter.y - curPoint.y !== 0)) {
            const x = CornerRadius * (nexter.x - curPoint.x) / Math.abs(nexter.x - curPoint.x);
            const y = CornerRadius * (nexter.y - curPoint.y) / Math.abs(nexter.y - curPoint.y);

            // 圆弧方向，默认为逆时针
            let sweep_flag = 0;
            if ((curPoint.x > nexter.x && curPoint.x == next.x && curPoint.y < nexter.y)
              || (curPoint.x > nexter.x && curPoint.y == next.y && curPoint.y > nexter.y)
              || (curPoint.x < nexter.x && curPoint.x == next.x && curPoint.y > nexter.y)
              || (curPoint.x < nexter.x && curPoint.y == next.y && curPoint.y < nexter.y)) {
              sweep_flag = 1;
            }
            if (curPoint.x == next.x) {
              pathDefine += `L${curPoint.x} ${next.y - y} `;
            } else {
              pathDefine += `L${next.x - x} ${curPoint.y} `;
            }
            pathDefine += `a${CornerRadius} ${CornerRadius} 0 0 ${sweep_flag} ${x} ${y} `;
          } else {
            pathDefine += `L ${next.x} ${next.y} `;
          }
        }
      }
    });

    if (pathDefine) {
      this.Path = pathDefine;
    }

    /* 画箭头 */
    let arrowDefine: string = '';
    const arrowPoint = this.points[this.points.length - 1];
    if (arrowPoint) {
      arrowDefine = `${arrowPoint.x},${arrowPoint.y} `;
      switch (this.endDirection) {
        case LINE.ArrowDirection.left:
          arrowDefine += `${arrowPoint.x - ArrowLength},${arrowPoint.y - ArrowWidth} ${arrowPoint.x - ArrowLength},${arrowPoint.y + ArrowWidth}`;
          break;
        case LINE.ArrowDirection.right:
          arrowDefine += `${arrowPoint.x + ArrowLength},${arrowPoint.y - ArrowWidth} ${arrowPoint.x + ArrowLength},${arrowPoint.y + ArrowWidth}`;
          break;
        case LINE.ArrowDirection.down:
          arrowDefine += `${arrowPoint.x - ArrowWidth},${arrowPoint.y + ArrowLength} ${arrowPoint.x + ArrowWidth},${arrowPoint.y + ArrowLength}`;
          break;
        case LINE.ArrowDirection.up:
          arrowDefine += `${arrowPoint.x - ArrowWidth},${arrowPoint.y - ArrowLength} ${arrowPoint.x + ArrowWidth},${arrowPoint.y - ArrowLength}`;
          break;
      }
    }
    if (arrowDefine) {
      this.Arrow = arrowDefine;
    }
  }

  /**
   * @description 当连接线有变化时，重绘连接线——包括起始点重新判断
   * @param lines
   */
  renew(lines: Array<Line>) {
    Promise.resolve(() => {
      this.setPoints(true);
    }).then(() => {
      this.calcCrossPoints(lines);
    }).then(() => {
      this.draw(true);
    });
  }

  /**
   * @description 当连接线属性更新，但路径不变时，开启重绘
   * @param lines
   */
  redraw(lines: Array<Line>) {
    this.calcCrossPoints(lines);
    this.draw(true);
    this.setTextPosition();
  }

  /**
   * @description 检查起点和终点是否都在对应节点的边缘上，否则修复位置
   */
  autoFix() {
    let changed: boolean = false;

    if (this.startPoint && this.startActivity) {
      const fixedStart: LINE.point = Line.fixPoint(this.startPoint, this.startActivity);
      if (fixedStart.x !== this.startPoint.x || fixedStart.y !== this.startPoint.y) {
        this.startPoint = fixedStart;
        changed = true;
      }
    }

    if (this.endPoint && this.endActivity) {
      const fixedEnd: LINE.point = Line.fixPoint(this.endPoint, this.endActivity);
      if (fixedEnd.x !== this.endPoint.x || fixedEnd.y !== this.endPoint.y) {
        this.endPoint = fixedEnd;
        changed = true;
      }
    }

    if (changed) {
      console.log('changed');
      this.setPoints();
      this.draw();
    }
  }
}

export default Line;

/*
 * [Line-Controller]
 * @Created by nooldey on 2018-12-08 15:03:37
 * @Description: 用于管理与画线相关的公共控制方法
 */

import Line from '../Line';
import { LINE } from '@/typings/line';
import { Activity } from '@/typings/workflow';

/* 画布Dom的Id */
const _DrawerDomId = 'workflow-drawer';
const _DrawerWrapDomId = 'designer-wrap';

/**
 * @description 获取当前光标在绘图区的坐标位置
 * @param evt 拖拽事件
 */
export const getCursorPosition = (evt: DragEvent) => {
  const drawContain: any = document.getElementById(_DrawerDomId);
  const drawWrapContain: any = document.getElementById(_DrawerWrapDomId);
  if (!drawContain) {
    return;
  }
  const _position: LINE.point = {
    x: evt.clientX - drawContain.offsetLeft + drawWrapContain.scrollLeft,
    y: evt.clientY - drawContain.offsetTop + drawWrapContain.scrollTop - 64,
  }
  return _position;
}
/* ///////////////////////////////////////////////////////////////////////////////// */
/**
 * @description 自动绘制节点上连接点方向出发到最近节点的连接线
 * @param currentLine 当前连接线目标：必须有开始节点和开始点
 * @param activities 所有的节点：用于搜寻最近的节点
 * @param lines 所有的线条：用于判断是否存在与当前绘线结果重复的已有线条
 * @returns _drawable 标志是否进行了绘制
 */
export const autoDrawLine = (currentLine: Line, activities: Array<Activity>, lines: Array<Line>) => {
  // 当点为悬空或仅有一个或0个节点时，不自动绘制
  if (!currentLine || activities.length < 2) {
    return;
  }

  // 当前操作的线
  const curLine = currentLine;
  // 当前的最大距离：当节点距离当前线的距离小于此距离时，将该节点归为当前最近的节点，并将距离置为当前可收录的最远的节点的距离
  let distance = Number.POSITIVE_INFINITY;
  // 点在线上相对于坐标原点方向的位移与所在边长的比例： 相对原点的距离比例
  let pointToEdge = 0.5;
  // 解构
  const { startDirection, startActivity, startPoint } = curLine;
  const { VerticalPerceage } = Line.settings;
  if (!startActivity || !startPoint) {
    return;
  }

  /* 从出发方向上搜寻距离最近的节点 */
  switch (startDirection) {
    /* /////// TOP /////// */
    case LINE.ArrowDirection.up:
      pointToEdge = (startPoint.x - startActivity.left) / startActivity.width;
      activities.forEach((target: Activity) => {
        // 寻找在绘线出发方向上最近的节点
        if (target.bottom < startActivity.top) {
          // 相对比例推算在目标节点上的横坐标
          const _percentX = target.left + target.width * pointToEdge;
          // 当前两节点间绘线最小距离: x轴距离*垂直加成权重 + 垂直方向距离
          const _curDistance = Math.abs(_percentX - startPoint.x) * VerticalPerceage + (startActivity.top - target.bottom);
          // 距离更小则收录
          if (_curDistance < distance) {
            distance = _curDistance;
            curLine.endActivity = target;
          }
        }
      });
      // 画线: 选取起始点等比例位置
      if (curLine.endActivity) {
        curLine.endPoint = {
          x: curLine.endActivity.left + curLine.endActivity.width * pointToEdge,
          y: curLine.endActivity.bottom
        };
      }
      break;
    /* /////// DOWN /////// */
    case LINE.ArrowDirection.down:
      pointToEdge = (startPoint.x - startActivity.left) / startActivity.width;
      activities.forEach((target: Activity) => {
        // 寻找在绘线出发方向上最近的节点
        if (target.top > startActivity.bottom) {
          // 相对比例推算在目标节点上的横坐标
          const _percentX = target.left + target.width * pointToEdge;
          // 当前两节点间绘线最小距离: x轴距离*垂直加成权重 + 垂直方向距离
          const _curDistance = Math.abs(_percentX - startPoint.x) * VerticalPerceage + (target.top - startActivity.bottom);
          // 距离更小则收录
          if (_curDistance < distance) {
            distance = _curDistance;
            curLine.endActivity = target;
          }
        }
      });
      // 画线: 选取起始点等比例位置
      if (curLine.endActivity) {
        curLine.endPoint = {
          x: curLine.endActivity.left + curLine.endActivity.width * pointToEdge,
          y: curLine.endActivity.top
        };
      }
      break;
    /* /////// LEFT /////// */
    case LINE.ArrowDirection.left:
      pointToEdge = (startPoint.y - startActivity.top) / startActivity.height;
      activities.forEach((target: Activity) => {
        // 寻找在绘线出发方向上最近的节点
        if (target.right < startActivity.left) {
          // 相对比例推算在目标节点上的纵坐标
          const _percentY = target.top + target.height * pointToEdge;
          // 当前两节点间绘线最小距离: y轴距离*垂直加成权重 + 水平方向距离
          const _curDistance = Math.abs(_percentY - startPoint.y) * VerticalPerceage + (startActivity.left - target.right);
          // 距离更小则收录
          if (_curDistance < distance) {
            distance = _curDistance;
            curLine.endActivity = target;
          }
        }
      });
      // 画线: 选取起始点等比例位置
      if (curLine.endActivity) {
        curLine.endPoint = {
          x: curLine.endActivity.right,
          y: curLine.endActivity.top + curLine.endActivity.height * pointToEdge
        };
      }
      break;
    /* /////// RIGHT /////// */
    case LINE.ArrowDirection.right:
      pointToEdge = (startPoint.y - startActivity.top) / startActivity.height;
      activities.forEach((target: Activity) => {
        // 寻找在绘线出发方向上最近的节点
        if (target.left > startActivity.right) {
          // 相对比例推算在目标节点上的纵坐标
          const _percentY = target.top + target.height * pointToEdge;
          // 当前两节点间绘线最小距离: y轴距离*垂直加成权重 + 水平方向距离
          const _curDistance = Math.abs(_percentY - startPoint.y) * VerticalPerceage + (target.left - startActivity.right);
          // 距离更小则收录
          if (_curDistance < distance) {
            distance = _curDistance;
            curLine.endActivity = target;
          }
        }
      });
      // 画线: 选取起始点等比例位置
      if (curLine.endActivity) {
        curLine.endPoint = {
          x: curLine.endActivity.left,
          y: curLine.endActivity.top + curLine.endActivity.height * pointToEdge
        };
      }
      break;
    default:
      break;
  }
  /* 绘制 */
  let _drawable = false;
  if (!curLine.endActivity) {
    return;
  }
  if (curLine.endActivity.activityType === 'START') {
    // 开始节点不允许作为自动连接的接入节点
    _drawable = false;
  } else {
    // 如果已经存在从开始到结束节点之间的连接线，则返回不绘制
    if (!curLine.startActivity || !curLine.endActivity) {
      return;
    }
    const _curStartCode = curLine.startActivity.ID;
    const _curEndCode = curLine.endActivity.ID;
    // 是否已存在两个节点之间的连线
    const _existSimilar = lines.some((verLine: Line) => {
      if (
        verLine.ID !== curLine.ID
        && !!verLine.startActivity
        && !!verLine.endActivity
        && (
          // 起点和终点一致
          (verLine.startActivity.ID === _curStartCode && verLine.endActivity.ID === _curEndCode)
          ||
          // 起点和终点倒置过来后一致
          (verLine.endActivity.ID === _curStartCode && verLine.startActivity.ID === _curEndCode)
        )
      ) {
        return true;
      }
      return false;
    });
    _drawable = !_existSimilar;
  }

  if (!_drawable) {
    curLine.endDirection = LINE.ArrowDirection.Unspecified;
    curLine.endPoint = undefined;
    curLine.endActivity = undefined;
  } else {
    // 结束方向与起点方向相反
    curLine.endDirection = Line.Opposite(curLine.startDirection);
    new Promise((resolve: any) => {
      curLine.setPoints(false);
      resolve();
    }).then(() => {
      curLine.calcCrossPoints(lines);
    }).then(() => {
      curLine.draw(false);
    });
  }
  // 返回自动绘线是否可绘制结果标志
  return _drawable;
};

/**
 * @description 在单个或多个节点变化后，自动重绘相关的连接线
 * @param changedActivities 发生位置/宽高变化的节点的集合
 * @param lines  所有的连接线
 * @returns lines 返回更新后的新的所有连接线的集合
 */
export const redrawOnActivityChange = (changedActivities: Array<Activity>, lines: Array<Line>) => {
  lines.forEach((line: Line) => {
    let changed: boolean = false;
    changedActivities.forEach((target: Activity) => {
      if (line.startActivity && line.startActivity.ID === target.ID) {
        line.startActivity = target;
        changed = true;
      }
      if (line.endActivity && line.endActivity.ID === target.ID) {
        line.endActivity = target;
        changed = true;
      }
      if (changed) {
        /* 线的相关节点有变化，重绘线条 */
        line.setPoints(true);
        line.setHandlerPoints();
      }
    });
  });
  lines.forEach((line: Line) => {
    if (line.needRedraw) {
      line.redraw(lines);
    }
  });
  return lines;
};

/**
 * @description 自动计算停靠的节点/点/方向
 * @param evt 拖拽事件
 * @param activities 当前的所有节点
 * @param excludeActivityType 停靠时排除的节点
 */
export const calculateDockActivity = (evt: DragEvent, activities: Array<Activity>, excludeActivityType?: string) => {
  /* todo 增加dockposition类型声明 */
  const _excludeActivityType = excludeActivityType || 'START';
  const dockPosition: LINE.DockPosition = {
    Activity: undefined,
    DockDirection: LINE.ArrowDirection.Unspecified,
    x: undefined,
    y: undefined
  };
  const _cursor: LINE.point | undefined = getCursorPosition(evt);
  if (!_cursor) {
    return dockPosition;
  }
  const { x, y } = _cursor;

  /* 检测当前光标点是否在某个节点内部 */
  activities.some((curActivity: Activity) => {
    if (
      curActivity.activityType !== _excludeActivityType &&
      x > curActivity.left &&
      x < curActivity.right &&
      y > curActivity.top &&
      y < curActivity.bottom
    ) {
      dockPosition.Activity = curActivity;
      // 根据短边比例较小的一边为停靠基准
      const _rateX = (x - curActivity.left) / curActivity.width;
      const _rateY = (y - curActivity.top) / curActivity.height;
      if (Math.min(_rateX, 1 - _rateX) < Math.min(_rateY, 1 - _rateY)) {
        dockPosition.y = y;
        if (_rateX < 0.5) {
          dockPosition.x = curActivity.left;
          dockPosition.DockDirection = LINE.ArrowDirection.left;
        } else {
          dockPosition.x = curActivity.right;
          dockPosition.DockDirection = LINE.ArrowDirection.right;
        }
      } else {
        dockPosition.x = x;
        if (_rateY < 0.5) {
          dockPosition.y = curActivity.top;
          dockPosition.DockDirection = LINE.ArrowDirection.up;
        } else {
          dockPosition.y = curActivity.bottom;
          dockPosition.DockDirection = LINE.ArrowDirection.down;
        }
      }
      return true;
    }
    return false;
  });

  /* 如果不在节点内，则检查是否靠近某个节点的边缘 */
  if (!dockPosition.Activity) {
    activities.some((target: Activity) => {
      if (
        target.activityType !== _excludeActivityType &&
        // 节点范围往外扩展半径DockDistanceToEdge继续匹配
        x > target.left - Line.settings.DockDistanceToEdge &&
        x < target.right + Line.settings.DockDistanceToEdge &&
        y > target.top - Line.settings.DockDistanceToEdge &&
        y < target.bottom + Line.settings.DockDistanceToEdge
      ) {
        dockPosition.Activity = target;
        // x轴位置处于扩展半径内,但不处于节点边缘上
        if (x < target.left || x > target.right) {
          // 取偏下的位置作为y轴
          dockPosition.y = Math.max(
            target.top,
            Math.min(y, target.bottom)
          );
          if (x < target.left) {
            dockPosition.x = target.left;
            dockPosition.DockDirection = LINE.ArrowDirection.left;
          } else {
            dockPosition.x = target.right;
            dockPosition.DockDirection = LINE.ArrowDirection.right;
          }
        }
        // x轴处于边缘上同一水平线
        else {
          dockPosition.x = x;
          if (y < target.top) {
            dockPosition.y = target.top;
            dockPosition.DockDirection = LINE.ArrowDirection.up;
          } else {
            dockPosition.y = target.bottom;
            dockPosition.DockDirection = LINE.ArrowDirection.down;
          }
        }
        return true;
      }
      return false;
    });
  }

  /* 将停靠计算结果返回 */
  if (!dockPosition.x) {
    dockPosition.x = x;
  }
  if (!dockPosition.y) {
    dockPosition.y = y;
  }
  return dockPosition;
};

/**
 * @description 鼠标拖拽结束点时实时绘线，并自动吸附到最近的节点
 * @param evt 拖拽事件
 * @param currentLine 当前拖动的线
 * @param activities 所有的节点
 */
export const dragToDraw = (evt: DragEvent, currentLine: Line, activities: Array<Activity>) => {
  /* 搜索最近的节点：距离小于最小间距 */
  const dockPosition: LINE.DockPosition = calculateDockActivity(evt, activities);
  let endPoint;
  if (dockPosition.x !== undefined && dockPosition.y !== undefined) {
    endPoint = {
      x: dockPosition.x,
      y: dockPosition.y
    };
  }
  /* 更新连接线的终点，绘制连接线 */
  currentLine.setProps({
    endPoint,
    endActivity: dockPosition.Activity,
    endDirection: LINE.ArrowDirection.Unspecified
  });
  currentLine.setPoints();
  currentLine.draw(false);
  return currentLine;
};

/**
 * @description 从接口获取到连接线的初始草稿数据后，不改变草稿数据，根据已有的点绘制连接线
 * @param lines 当前所有的连接线
 */
export const redrawLines = (lines: Array<Line>) => {
  const len = lines.length;
  for (let i = 0; i < len; i++) {
    const line = lines[i];
    if (!line.points || !line.points.length) {
      line.setPoints();
    }
    line.setDirections();
    line.calcCrossPoints(lines);
    line.draw(true);
  }
  return lines;
};

/**
 * @description 拖拽移动了连接线的起始点之外的线段，重绘连接线
 * @param evt 拖拽事件
 * @param position 当前控制点信息
 * @param currentLine 当前被拖拽连接线
 * @param lines 所有连接线
 */
export const moveSegment = (evt: DragEvent, position: LINE.handlerPoint, currentLine: Line, lines: Array<Line>) => {
  if (!currentLine) {
    return;
  }
  /* 判断偏移的坐标距离 */
  const _cursor: LINE.point | undefined = getCursorPosition(evt);
  if (!_cursor) {
    return;
  }
  const _offsets = {
    x: _cursor.x - position.x,
    y: _cursor.y - position.y,
  }
  if (_offsets.x === 0 && _offsets.y === 0) {
    return;
  }
  const _pointsCount: number = currentLine.points.length;
  if (_pointsCount < 2) {
    return;
  }
  if (position.Direction === LINE.HandlerDirection.Horizontal) {
    // 拖拽方向为水平，则只更新线段两端点的x坐标
    const _resultX = position.x + _offsets.x;

    currentLine.points.some((_point: LINE.point, idx: number) => {
      if (
        idx > 0
        && idx < _pointsCount - 1
        && _point.x === position.x
        && (_point.y + currentLine.points[idx + 1].y) === position.y * 2
      ) {
        _point.x = _resultX;
        currentLine.points[idx + 1].x = _resultX;
        return true;
      }
      return false;
    });

    position.x = _resultX;
    currentLine.redraw(lines);
  } else if (position.Direction === LINE.HandlerDirection.Vertical) {
    // 拖拽方向为垂直，则只更新线段两端点的y坐标
    const _resultY = position.y + _offsets.y;

    currentLine.points.some((_point: LINE.point, idx: number) => {
      if (
        idx > 0
        && idx < _pointsCount - 1
        && _point.y === position.y
        && (_point.x + currentLine.points[idx + 1].x) === position.x * 2
      ) {
        _point.y = _resultY;
        currentLine.points[idx + 1].y = _resultY;
        return true;
      }
      return false;
    });

    position.y = _resultY;
    currentLine.redraw(lines);
  }

  return position;
};

/**
 * @description 拖动连接线终点，重绘连接线
 * @param evt 拖拽事件
 * @param currentLine 当前线
 * @param activities 所有节点
 */
export const moveEnd = (evt: DragEvent, currentLine: Line, activities: Array<Activity>) => {
  const dockPosition: LINE.DockPosition = calculateDockActivity(evt, activities);
  let endPoint;
  if (dockPosition.x !== undefined && dockPosition.y !== undefined && dockPosition.Activity) {
    endPoint = {
      x: dockPosition.x,
      y: dockPosition.y,
    };
    
    const { left , top, right, bottom } = dockPosition.Activity;

    // 起始点在停靠节点的四个拐角时停止绘制——无法判断连线方向
    if (
      (endPoint.x === left || endPoint.x === right) && (endPoint.y === top || endPoint.y === bottom)
    ) {
      return;
    }


    currentLine.setProps({
      endPoint,
      endActivity: dockPosition.Activity,
      endDirection: LINE.ArrowDirection.Unspecified,
    });
  } else {
    endPoint = getCursorPosition(evt);
    currentLine.setProps({
      endPoint,
      endActivity: undefined,
      endDirection: LINE.ArrowDirection.Unspecified,
    });
  }
  currentLine.setPoints();
  currentLine.draw(false);
  return { ...endPoint, Activity: dockPosition.Activity };
};


/**
 * @description 拖动连接线起点，重绘连接线
 * @param evt 拖拽事件
 * @param currentLine 当前线
 * @param activities 所有节点
 */
export const moveStart = (evt: DragEvent, currentLine: Line, activities: Array<Activity>) => {
  const dockPosition: LINE.DockPosition = calculateDockActivity(evt, activities, 'END');
  let startPoint;
  if (dockPosition.x !== undefined && dockPosition.y !== undefined && dockPosition.Activity) {
    startPoint = {
      x: dockPosition.x,
      y: dockPosition.y,
    };

    const { left, top, right, bottom } = dockPosition.Activity;

    // 起始点在停靠节点的四个拐角时停止绘制——无法判断连线方向
    if (
      (startPoint.x === left || startPoint.x === right) && (startPoint.y === top || startPoint.y === bottom)
    ) {
      return;
    }

    currentLine.setProps({
      startPoint,
      startActivity: dockPosition.Activity,
      startDirection: LINE.ArrowDirection.Unspecified,
    });
    currentLine.setPoints();
    currentLine.draw(false);
  } else {
    startPoint = getCursorPosition(evt);
    if (startPoint) {
      currentLine.setProps({
        startPoint,
        startActivity: undefined,
        startDirection: LINE.ArrowDirection.Unspecified,
      });
      currentLine.points[0] = startPoint;
      currentLine.draw(false);
    }
  }
  return { ...startPoint, Activity: dockPosition.Activity };
}

/**
 * @description 拖拽标签，实时取到当前点最近的线段上的坐标，并赋给标签作为新坐标，达到在路径上移动的效果
 */
export const moveText = (evt: DragEvent, currentLine: Line) => {
  if (!currentLine) {
    return;
  }
  /* 判断偏移的坐标距离 */
  const _cursor: LINE.point | undefined = getCursorPosition(evt);
  if (!_cursor) {
    return;
  }
  // 最近的点
  let _nearestPoint: LINE.point = { x: NaN, y: NaN },
    // 最近的线段到光标位置最小距离的平方值
    _minDistance: number = 0;
  const maxIdx = currentLine.points.length - 1;
  for (let i = 0; i < maxIdx; i++) {
    let _curNearestPoint: LINE.point = {
      x: _cursor.x,
      y: _cursor.y,
    },
      _distance: number = 0;
    const _curPoint = currentLine.points[i],
      _nextPoint = currentLine.points[i + 1];
    // 线段为水平方向，则取线段上横向最近的点
    if (_curPoint.y === _nextPoint.y) {
      _curNearestPoint.y = _curPoint.y;
      // 光标水平位置在线段区间外，取区间两端的点的横坐标
      if (_cursor.x <= Math.min(_curPoint.x, _nextPoint.x)) {
        _curNearestPoint.x = Math.min(_curPoint.x, _nextPoint.x);
      } else if (_cursor.x > Math.max(_curPoint.x, _nextPoint.x)) {
        _curNearestPoint.x = Math.max(_curPoint.x, _nextPoint.x)
      } else {
        // 光标水平位置在线段区间内，取当前光标横轴位置，所以最小距离其实就是y坐标间距
        _curNearestPoint.x = _cursor.x;
      }
    }
    // 线段为垂直方向，则取线段上纵向最近的点
    else {
      _curNearestPoint.x = _curPoint.x;
      // 光标在线段区间外
      if (_cursor.y <= Math.min(_curPoint.y, _nextPoint.y)) {
        _curNearestPoint.y = Math.min(_curPoint.y, _nextPoint.y);
      } else if (_cursor.y > Math.max(_curPoint.y, _nextPoint.y)) {
        _curNearestPoint.y = Math.max(_curPoint.y, _nextPoint.y)
      } else {
        // 光标在区间内
        _curNearestPoint.y = _cursor.y;
      }
    }
    _distance = (_cursor.y - _curNearestPoint.y) * (_cursor.y - _curNearestPoint.y) + (_cursor.x - _curNearestPoint.x) * (_cursor.x - _curNearestPoint.x);
    if (i === 0 || (i > 0 && _distance < _minDistance)) {
      _nearestPoint = _curNearestPoint;
      _minDistance = _distance;
    }
  }
  // 移动标签
  currentLine.setTextPosition(_nearestPoint);
}

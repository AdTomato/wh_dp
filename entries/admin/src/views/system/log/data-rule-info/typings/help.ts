const getLatelyWeeK = () => {
  const day = new Date();
  day.setTime(day.getTime() - 7*24*60*60*1000);
  return day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
}

const getToday = () => {
  const day = new Date();
  day.setTime(day.getTime());
  return day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
}

const getNearWork = () => {
  return [getLatelyWeeK(), getToday()]
}

export {
  getNearWork
}
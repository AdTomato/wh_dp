import { listParams } from '@cloudpivot/api';

import { utils  } from '@cloudpivot/common'


/**
 * 获取位置控件的地址字符串，包含省市区和详细地址
 * @param value
 */
function getAddressString(value:any) {
	let addressString:any = '';
	try {
		let addressObj:any = JSON.parse(value);
		if (typeof addressObj === 'string') {
			addressObj = JSON.parse(addressObj);
		}
		const {
			provinceName = '',
			cityName = '',
			districtName = '',
			address = ''
		} = addressObj;
		addressString = provinceName + cityName + districtName + address;
	} catch (e) {
		addressString = value || '';
	}
	return addressString;
}

/**
 * 格式化输出日期数据项
 * @param value
 * @param displayFormat
 */
function getDataString(value: any, displayFormat: number) {
	let dataString = '';
	if (value) {
		const date = new Date(value.replace(/-/g, '/')); // 修复safari/ie下日期转换问题
		const month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
		const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
		const time = `${date.getFullYear()}-${month}-${day}`;
		const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
		const minutes = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
		const seconds = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;

		switch (displayFormat) {
			case 0:
				break;
			case 1:
				dataString = time;
				break;
			case 2:
				dataString = `${time} ${hours}:${minutes}:${seconds}`;
				break;
			case 3:
				dataString = `${time} ${hours}:${minutes}`;
				break;
			default:
				dataString = value;
				break;
		}
	}

	return dataString || '';
}

/**
 * 格式化输出数值数据项
 * @param value
 * @param displayFormat
 */
function getNumberString(value: any, displayFormat: number) {
	let numberString = '';
	if (value === 0) {
		numberString = `${value}`;
	} else if (value) {
		switch (displayFormat) {
			case 0:
				break;
			case 1:
				numberString = parseInt(value, 10).toLocaleString();
				break;
			case 2:
				numberString = utils.addZero(Number(value.toFixed(2).slice(0,-1)).toLocaleString(), 1);
				break;
			case 3:
				numberString = utils.addZero(Number(value.toFixed(3).slice(0,-1)).toLocaleString(), 2);
				break;
			case 4:
				numberString = `${parseInt(`${value}`, 10)}%`;
				break;
			case 5:
				numberString = `${(value).toFixed(2).slice(0,-1)}%`;
				break;
			case 6:
				numberString = `${(value).toFixed(3).slice(0,-1)}%`;
				break;
			case 7:
				numberString = `￥${utils.addZero(Number(value.toFixed(3).slice(0,-1)).toLocaleString(), 2)}`;
				break;
			case 8:
				numberString = `$${utils.addZero(Number(value.toFixed(3).slice(0,-1)).toLocaleString(), 2)}`;
				break;
			case 9:
				numberString = `€${utils.addZero(Number(value.toFixed(3).slice(0,-1)).toLocaleString(), 2)}`;
				break;
			case 10:
				numberString = `HK$${utils.addZero(Number(value.toFixed(3).slice(0,-1)).toLocaleString(), 2)}`;
				break;
			case 11:
				numberString = utils.addZero(Number(value.toFixed(4).slice(0,-1)).toLocaleString(), 3);
				break;
			case 12:
				numberString = utils.addZero(Number(value.toFixed(5).slice(0,-1)).toLocaleString(), 4);
				break;
			case 13:
				numberString = `${(value).toFixed(4).slice(0,-1)}%`;
				break;
			case 14:
				numberString = `${(value).toFixed(5).slice(0,-1)}%`;
				break;
			default:
				break;
		}
	}
	return numberString;
}

/**
 * 输出单据状态中文
 * @param value
 */
function getSequenceString(value: any) {
	let sequenceString = value;
	switch (value) {
		case 'DRAFT':
			sequenceString = '草稿';
			break;
		case 'PROCESSING':
			sequenceString = '进行中';
			break;
		case 'COMPLETED':
			sequenceString = '已完成';
			break;
		case 'CANCELED':
			sequenceString = '已作废';
			break;
		default:
			break;
	}
	return sequenceString;
}

/**
 * 输出其他常规的数据项值
 * @param value
 */
function getItemString(value: any) {
	let itemString = '';
	if (!value || value === 'null') {
		itemString = ''
	} else if (typeof value === 'boolean') {
		itemString = value ? '是': '否';
	} else if (Array.isArray(value)) {
		itemString = value.map((x:any) => x.name || '').join();
	} else if (typeof value === 'object') {
		itemString = value.name;
	} else {
		itemString = value;
	}
	return itemString;
}

/**
 * 根据数据项类型和显示格式返回真实数值
 * @param property
 * @param value
 * @return propertyValue
 * @description 针对地址/日期/数值/单据状态做特殊处理，其他则根据对象/数组，取name值进行展示，布尔值展示是与否
 */
export function getRealValue(property: listParams.QueryColumns,value:any) {
	const {
		propertyType,
		propertyCode,
		displayFormat
	} = property;

	let propertyValue = '';
	switch (propertyType) {
		case 10:
			propertyValue = getAddressString(value);
			break;
		case 3:
			propertyValue = getDataString(value,displayFormat);
			break;
		case 2:
			propertyValue = getNumberString(value,displayFormat);
			break;
		default:
			if (propertyCode === 'sequenceStatus') {
				propertyValue = getSequenceString(value);
			} else {
				propertyValue = getItemString(value);
			}
	}
	return propertyValue;
}

/**
 * 根据数据项类型数字，返回对应的数据项类型文字
 * @param propertyType 数据项类型数字
 */
export function getDataItemText(propertyType: number) {
	if (typeof propertyType !== 'number') {
		return propertyType;
	}
	const PropertyTypeMap:any = {
		'0': '短文本',
		'1': '长文本',
		'2': '数值',
		'3': '日期',
		'4': '逻辑',
		'5': '选人控件',
		'6': '附件',
		'7': '审批意见',
		'8': '子表',
		'9': '关联表单',
		'10': '地理位置',
	};

	return PropertyTypeMap[`${propertyType}`] || propertyType;
}
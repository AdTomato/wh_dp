
import { Vue } from 'vue-property-decorator';

const noxss = (text: string) => {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

Vue.directive('hight-light', {
  bind(el:any, binding:any) {
    let targetStr = binding.value.value;
    if (binding.value.keyWords && binding.value.keyWords.length > 0) {
      
      let replaceReg = new RegExp(binding.value.keyWords, 'g');
      let replaceString = '<span class="highlight">' + noxss(binding.value.keyWords) + '</span>';
      targetStr = targetStr.replace(replaceReg, replaceString);
    } else {
      targetStr = noxss(targetStr);
    }
    el.innerHTML = `${targetStr}`;
  },
  update(el:any, binding:any) {
    let targetStr = binding.value.value;
    if (binding.value.keyWords && binding.value.keyWords.length > 0) {
      
      let replaceReg = new RegExp(binding.value.keyWords, 'g');
      let replaceString = '<span class="highlight">' + noxss(binding.value.keyWords) + '</span>';
      targetStr = targetStr.replace(replaceReg, replaceString);
    } else {
      targetStr = noxss(targetStr);
    }
    el.innerHTML = `${targetStr}`;
  }
})
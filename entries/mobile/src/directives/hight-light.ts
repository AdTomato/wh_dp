import { Vue } from 'vue-property-decorator';

Vue.directive('hight-light', {
  bind(el:any, binding:any) {
    let targetStr = binding.value.value;
    if (binding.value.keyWords && binding.value.keyWords.length > 0) {
      
      let replaceReg = new RegExp(binding.value.keyWords, 'g');
      let replaceString = '<span class="highlight">' + binding.value.keyWords + '</span>';
      targetStr = targetStr.replace(replaceReg, replaceString);
    }
    el.innerHTML = `${targetStr}`;
  },
  update(el:any, binding:any) {
    let targetStr = binding.value.value;
    if (binding.value.keyWords && binding.value.keyWords.length > 0) {
      
      let replaceReg = new RegExp(binding.value.keyWords, 'g');
      let replaceString = '<span class="highlight">' + binding.value.keyWords + '</span>';
      targetStr = targetStr.replace(replaceReg, replaceString);
    }
    el.innerHTML = `${targetStr}`;
  }
})
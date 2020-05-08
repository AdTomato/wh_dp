import {TemplateHandle} from './template';

new TemplateHandle((template: any) => {
  console.log(template);
  if((window.top as any).initCustomForm){
    (window as any)._templateSourse = template;
    (window.top as any).initCustomForm(template);
  }
});





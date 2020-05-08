import introJs from './intro';
import Common = H3.Common;

function stepTemplate({ title = '', content }:any) {
  return `<div class="bubble-box">
            ${title ? `
              <h3>${title}</h3>
            `:''}
            <p class="bubble-content">
              ${content}
            </p>
          </div>`;
}

export default function h3Intro(options: Common.H3IntroOptions) {
  const intro: any = introJs();
  const defaultOptions: Common.IntroOptions = {
    showStepNumbers: false,
    showProgress: false,
    showBullets: true,
    showButtons: true,
    overlayOpacity: 0.6,
    disableInteraction: true,
    exitOnOverlayClick: false,
    exitOnEsc: false,
    tooltipClass: 'h3-intro-bubble',
    tooltipPosition: 'bottom-middle-aligned',
    helperElementPadding:0,
    noPrev: false,
    hideNext: true,
    skipLabel: '跳过',
    prevLabel: '上一步',
    nextLabel: '下一步',
    doneLabel: '知道了',
  };
  const introOptions = Object.assign(defaultOptions, options);
  if (!introOptions.steps) {
    const stepData = introOptions.stepData;
    const steps: Common.IntroStep[] = stepData.map((step: any) => {
      return {
        element: step.element,
        intro: stepTemplate(step),
        position: step.position,
      };
    });
    introOptions.steps = steps;
  }
  intro.setOptions(introOptions);
  return {
    addStep(h3Step: Common.H3IntroStep) {
      intro.addStep({
        element: h3Step.element,
        intro: stepTemplate(h3Step),
      });
      return this;
    },
    start() {
      intro.start();
      return this;
    },
    onComplete(providedCallback:any) {
      intro.oncomplete(providedCallback);
      return this;
    },
    onSkip(providedCallback:any) {
      intro.onskip(providedCallback);
      return this;
    },
  };
}
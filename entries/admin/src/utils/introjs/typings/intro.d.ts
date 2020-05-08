declare namespace H3 {
  namespace Common {
    interface IntroOptions {
      showStepNumbers?: boolean;
      showProgress?: boolean;
      showBullets?: boolean;
      showButtons?: boolean;
      overlayOpacity?: number;
      disableInteraction?: boolean;
      exitOnOverlayClick?: boolean;
      exitOnEsc?: boolean;
      tooltipClass?: string;
      nextButtonClass?: string;
      tooltipPosition?: string;
      helperElementPadding?: number;
      noPrev?: boolean;
      hideNext?: boolean;
      skipLabel?: string;
      prevLabel?: string;
      nextLabel?: string;
      doneLabel?: string;
      steps?: IntroStep[];
    }
    interface IntroStep {
      element: Element | string;
      intro?: string;
      tooltipButtons?: { 
        next?: IntroButton;
        prev?: IntroButton;
        skip?: IntroButton;
        done?: IntroButton;
      };
      position?: string;
    }
    interface IntroButton {
      label: string;
    }
    interface IntroObject {
      setOptions(options:any): IntroObject;
      addStep(step:IntroStep):IntroObject;
      start(): IntroObject;
      oncomplete(providedCallback: Function): IntroObject;
      onskip(providedCallback: Function): IntroObject;
    }
    interface H3IntroObject {
      addStep(step:H3IntroStep):H3IntroObject;
      start(): H3IntroObject;
      onComplete(providedCallback: Function): H3IntroObject;
      onSkip(providedCallback: Function): H3IntroObject;
    }
    interface H3IntroStep extends IntroStep{
      title?: string;
      content: string;
    }
    interface H3IntroOptions extends IntroOptions {
      stepData: H3IntroStep[];
    }
  }
}
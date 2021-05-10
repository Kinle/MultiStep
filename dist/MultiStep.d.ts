import { Step } from './Step';
import '../scss/MultiStep';
import '../scss/StepContent';
import '../scss/Actions';
declare type MultiStepOptions = {
    onComplete: () => void;
};
export interface Containers {
    mainContainer: HTMLElement;
    progressContainer: HTMLElement;
    stepContainer: HTMLElement;
    actionContainer: HTMLElement;
}
interface IMultiStep {
    updateOptions(newOptions: MultiStepOptions): void;
    addStep(): Step;
    getStep(step: number): Step | undefined;
    reset(): void;
}
declare const MultiStep: {
    (target: HTMLElement, options?: MultiStepOptions | undefined): IMultiStep;
    get(element: HTMLElement): IMultiStep | undefined;
};
export default MultiStep;

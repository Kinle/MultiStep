import { Step, DefaultStep } from './Step';
import '../scss/MultiStep';
import '../scss/StepContent';
import '../scss/Actions';

const MULTISTEP_CLASS = {
    mainContainer: 'ms-container',
    progressContainer: 'ms-progress-container',
    stepContainer: 'ms-step-container',
    actionContainer: 'ms-action-container',
    stepButton: 'ms-button',
};

const IDS = {
    prevButton: 'ms-prev-button',
    nextButton: 'ms-next-button',
};

const ELEMENTS = {
    DIV: 'div',
    BUTTON: 'button',
};

const ATTRIBUTES = {
    disabled: 'disabled',
};
const initialisationErrorMessage =
    'Cannot initialise Multistep for already initialised element. Use MultiStep.get(element) to access MultiStep for already initialised element';

/* eslint-disable no-unused-vars */
type MultiStepOptions = {
    onComplete?: () => void;
    onNext?: (step: Step) => void;
    onPrev?: (step: Step) => void;
    nextLabel: string;
    prevLabel: string;
    completeLabel: string;
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

const multiStepElementCache = new Map<HTMLElement, IMultiStep>();

function uuidv4() {
    return ((1e7).toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: string) =>
        (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16),
    );
}

function setProperty<T, K extends keyof T>(target: T, source: T, key: K) {
    target[key] = source[key];
}

class MultiStepManager implements IMultiStep {
    target: HTMLElement;
    containers: Containers;
    defaultOptions: MultiStepOptions = {
        nextLabel: 'Next',
        prevLabel: 'Previous',
        completeLabel: 'Finish',
    };

    steps: Step[] = [];
    currentStepIndex = 0;
    constructor(target: HTMLElement, options?: MultiStepOptions) {
        this.target = target;
        this.initialiseTarget();
        this.initialiseOption(options);
        this.containers = this.createContainers();
    }

    updateOptions(newOptions: MultiStepOptions) {
        this.extendDefaults(newOptions);
        this.updateLabels();
    }
    updateLabels() {
        const nextButton = document.getElementById(IDS.nextButton);
        if (nextButton) nextButton.innerText = this.defaultOptions.nextLabel;
        const previousButton = document.getElementById(IDS.prevButton);
        if (previousButton) previousButton.innerText = this.defaultOptions.prevLabel;
    }

    addStep(): Step {
        const step = new DefaultStep(this.containers, this.steps.length);
        this.steps.push(step);
        this.reset();
        return step;
    }

    getStep(step: number): Step | undefined {
        if (!this.isValidStep(step)) {
            return;
        }
        return this.steps[step - 1];
    }

    reset(): void {
        this.goToStep(0);
    }

    private goToStep(step: number): void {
        if (!this.isValidStep(step + 1)) {
            return;
        }
        this.scrollElement(step);
        this.updateProgress(this.currentStepIndex, step);

        this.setActionButtonAttributes(step);

        this.currentStepIndex = step;
    }
    private setActionButtonAttributes(step: number) {
        const nextButton = document.getElementById(IDS.nextButton);
        const previousButton = document.getElementById(IDS.prevButton);
        if (nextButton) {
            nextButton.removeAttribute(ATTRIBUTES.disabled);
            if (step == this.steps.length - 1) {
                nextButton.innerText = this.defaultOptions.completeLabel;
                nextButton.onclick = this.completed.bind(this);
            } else {
                nextButton.innerText = this.defaultOptions.nextLabel;
                nextButton.onclick = this.goToNext.bind(this);
            }
        }

        if (previousButton) {
            previousButton.removeAttribute(ATTRIBUTES.disabled);
            if (step == 0) previousButton.setAttribute(ATTRIBUTES.disabled, ATTRIBUTES.disabled);
        }
    }

    private completed() {
        this.steps[this.steps.length - 1].markCompleted(true);
        document.getElementById(IDS.nextButton)?.setAttribute(ATTRIBUTES.disabled, ATTRIBUTES.disabled);
        document.getElementById(IDS.prevButton)?.setAttribute(ATTRIBUTES.disabled, ATTRIBUTES.disabled);
        if (this.defaultOptions.onComplete) this.defaultOptions.onComplete();
    }

    private updateProgress(current: number, target: number) {
        if (current < target) {
            this.steps[current].markCompleted(true);
            setTimeout(this.updateProgress.bind(this), 200, current + 1, target);
            return;
        } else if (current > target) {
            this.steps[current].markCompleted(false);
            setTimeout(this.updateProgress.bind(this), 200, current - 1, target);
            return;
        }
        this.steps[current].markCurrent();
    }
    private isValidStep(step: number) {
        return step > 0 && step <= this.steps.length;
    }
    private initialiseTarget() {
        this.setTargetId();
        multiStepElementCache.set(this.target, this);
    }

    private setTargetId() {
        if (!this.target.id || this.target.id.length == 0) {
            this.target.id = uuidv4();
        }
    }

    private initialiseOption(options?: MultiStepOptions): void {
        if (options) {
            this.extendDefaults(options);
        }
    }

    private extendDefaults(newOptions: MultiStepOptions): MultiStepOptions {
        for (const optionKey in this.defaultOptions) {
            /* eslint-disable no-prototype-builtins */
            if (newOptions.hasOwnProperty(optionKey)) {
                setProperty(this.defaultOptions, newOptions, optionKey as keyof MultiStepOptions);
            }
        }
        return newOptions;
    }

    private createContainers(): Containers {
        const mainContainer = this.createMainContainer();
        return {
            mainContainer: mainContainer,
            progressContainer: this.createProgressContainer(mainContainer),
            stepContainer: this.createStepContainer(mainContainer),
            actionContainer: this.createActionContainer(mainContainer),
        };
    }
    private createMainContainer(): HTMLElement {
        const mainContainer = document.createElement(ELEMENTS.DIV);
        mainContainer.classList.add(MULTISTEP_CLASS.mainContainer);
        this.target.append(mainContainer);
        return mainContainer;
    }

    private createProgressContainer(mainContainer: HTMLElement): HTMLElement {
        const progressContainer = document.createElement(ELEMENTS.DIV);
        progressContainer.classList.add(MULTISTEP_CLASS.progressContainer);
        mainContainer.append(progressContainer);
        return progressContainer;
    }

    private createStepContainer(mainContainer: HTMLElement): HTMLElement {
        const stepContainer = document.createElement(ELEMENTS.DIV);
        stepContainer.classList.add(MULTISTEP_CLASS.stepContainer);
        mainContainer.append(stepContainer);
        return stepContainer;
    }

    private createActionContainer(mainContainer: HTMLElement): HTMLElement {
        const actionContainer = document.createElement(ELEMENTS.DIV);
        actionContainer.classList.add(MULTISTEP_CLASS.actionContainer);
        this.createPreviousAction(actionContainer);
        this.createNextAction(actionContainer);
        mainContainer.append(actionContainer);

        return actionContainer;
    }

    private createPreviousAction(actionContainer: HTMLElement): void {
        const previous = document.createElement(ELEMENTS.BUTTON);
        previous.classList.add(MULTISTEP_CLASS.stepButton);
        previous.id = IDS.prevButton;
        previous.innerText = this.defaultOptions.prevLabel;
        previous.onclick = this.goToPrevious.bind(this);
        actionContainer.append(previous);
    }

    private createNextAction(actionContainer: HTMLElement): void {
        const next = document.createElement(ELEMENTS.BUTTON);
        next.classList.add(MULTISTEP_CLASS.stepButton);
        next.id = IDS.nextButton;
        next.innerText = this.defaultOptions.nextLabel;
        next.onclick = this.goToNext.bind(this);
        actionContainer.append(next);
    }

    private goToNext() {
        this.goToStep(this.currentStepIndex + 1);
        if (this.defaultOptions.onNext) this.defaultOptions.onNext(this.steps[this.currentStepIndex]);
    }

    private goToPrevious() {
        this.goToStep(this.currentStepIndex - 1);
        if (this.defaultOptions.onPrev) this.defaultOptions.onPrev(this.steps[this.currentStepIndex]);
    }

    private scrollElement(stepIndex: number) {
        this.containers.stepContainer.scrollLeft = this.containers.stepContainer.offsetWidth * stepIndex;
    }
}

const MultiStep = function (target: HTMLElement, options?: MultiStepOptions): IMultiStep {
    if (multiStepElementCache.has(target)) {
        throw new Error(initialisationErrorMessage);
    }
    return new MultiStepManager(target, options);
};
MultiStep.get = function (element: HTMLElement): IMultiStep | undefined {
    return multiStepElementCache.get(element);
};

export default MultiStep;

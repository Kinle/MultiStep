import { uuidv4 } from './Utils';
import { Step, DefaultStep } from './Step';
import '../scss/MultiStep';
import '../scss/StepContent';
import '../scss/Actions';


const MULTISTEP_CLASS = {
	mainContainer: 'ms-container',
	progressContainer: 'ms-progress-container',
	stepContainer: 'ms-step-container',
	actionContainer: 'ms-action-container'
}

const DIV_ELEMENT = 'div';
const initialisationErrorMessage = 'Cannot initialise Multistep for already initialised element. Use MultiStep.get(element) to access MultiStep for already initialised element';

type MultiStepOptions = {
	onComplete: () => void;
}
export interface Containers {
	mainContainer: HTMLElement,
	progressContainer: HTMLElement,
	stepContainer: HTMLElement,
	actionContainer: HTMLElement
}

interface IMultiStep {
	updateOptions(newOptions: MultiStepOptions): void;
	addStep(): Step;
	getStep(step: number): Step | undefined;
	reset(): void;
}

const multiStepElementCache = new Map<HTMLElement, IMultiStep>();

class MultiStepManager implements IMultiStep {
	target: HTMLElement;
	containers: Containers;
	defaultOptions: MultiStepOptions = {
		onComplete: function(){}
	};

	steps: Step[] = [];
	currentStepIndex = 0;
	constructor(target: HTMLElement, options?: MultiStepOptions) {
		this.target = target
		this.initialiseTarget();
		this.initialiseOption(options);
		this.containers = this.createContainers();

	}

	updateOptions(newOptions: MultiStepOptions) {
		this.extendDefaults(newOptions);
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
		const nextButton = document.getElementById('ms-next-button');
		const previousButton = document.getElementById('ms-prev-button');
		if (nextButton) {
			nextButton.removeAttribute('disabled')
			if (step == this.steps.length - 1) {
				nextButton.innerText = 'Finish';
				nextButton.onclick = this.completed.bind(this);

			} else {
				nextButton.innerText = 'Next';
				nextButton.onclick = this.goToNext.bind(this);
			}

		}

		if (previousButton) {
			previousButton.removeAttribute('disabled');
			if (step == 0)
				previousButton.setAttribute('disabled', 'disabled');
		}
	}

	private completed() {
		this.steps[this.steps.length - 1].markCompleted(true);
		document.getElementById('ms-next-button')?.setAttribute('disabled', 'disabled');
		document.getElementById('ms-prev-button')?.setAttribute('disabled', 'disabled');
		this.defaultOptions.onComplete();
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
		for (const option in this.defaultOptions) {
			if (newOptions.hasOwnProperty(option)) {
				this.defaultOptions[option as keyof MultiStepOptions] = newOptions[option as keyof MultiStepOptions];
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
			actionContainer: this.createActionContainer(mainContainer)
		}
	}
	private createMainContainer(): HTMLElement {
		const mainContainer = document.createElement(DIV_ELEMENT);
		mainContainer.classList.add(MULTISTEP_CLASS.mainContainer);
		this.target.append(mainContainer);
		return mainContainer;
	}

	private createProgressContainer(mainContainer: HTMLElement): HTMLElement {
		const progressContainer = document.createElement(DIV_ELEMENT);
		progressContainer.classList.add(MULTISTEP_CLASS.progressContainer);
		mainContainer.append(progressContainer);
		return progressContainer;
	}

	private createStepContainer(mainContainer: HTMLElement): HTMLElement {
		const stepContainer = document.createElement(DIV_ELEMENT);
		stepContainer.classList.add(MULTISTEP_CLASS.stepContainer);
		mainContainer.append(stepContainer);
		return stepContainer;
	}

	private createActionContainer(mainContainer: HTMLElement): HTMLElement {
		const actionContainer = document.createElement(DIV_ELEMENT);
		actionContainer.classList.add(MULTISTEP_CLASS.actionContainer);
		this.createPreviousAction(actionContainer);
		this.createNextAction(actionContainer);
		mainContainer.append(actionContainer);

		return actionContainer;
	}

	private createPreviousAction(actionContainer: HTMLElement): void {
		const previous = document.createElement('button');
		previous.classList.add('ms-button');
		previous.id = 'ms-prev-button';
		previous.innerText = 'Previous';
		previous.onclick = this.goToPrevious.bind(this);
		actionContainer.append(previous);
	}

	private createNextAction(actionContainer: HTMLElement): void {
		const next = document.createElement('button');
		next.classList.add('ms-button');
		next.id = 'ms-next-button';
		next.innerText = 'Next';
		next.onclick = this.goToNext.bind(this);
		actionContainer.append(next);
	}

	private goToNext() {
		this.goToStep(this.currentStepIndex + 1)
	}

	private goToPrevious() {
		this.goToStep(this.currentStepIndex - 1)
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
}
MultiStep.get = function (element: HTMLElement): IMultiStep | undefined {
	return multiStepElementCache.get(element);
}

export default MultiStep;
import { Containers } from './MultiStep';
import '../scss/Step';

export interface Step {
    markCompleted(isCompleted: boolean): void;
    markCurrent(): void;
    setContent(content: HTMLElement): void
}

export class DefaultStep implements Step {
    containers: Containers;
    stepElement: HTMLElement;
    progressElement: HTMLElement;
    stepContentElement: HTMLElement;
    index: number;


    constructor(containers: Containers, index: number) {
        this.containers = containers;
        this.index = index;
        this.stepElement = this.createStepElement();
        this.progressElement = this.createProgressElement();
        this.stepContentElement = this.createStepContentElement();
    }
    

    setContent(content: HTMLElement | string): void {
        this.stepContentElement.innerHTML = '';
        if (content instanceof HTMLElement)
            this.stepContentElement.append(content);
        else
            this.stepContentElement.innerHTML = content;
    }
    markCompleted(isCompleted: boolean): void {
        this.progressElement.classList.remove('current', 'skipped')
        if (isCompleted)
            this.progressElement.classList.add('completed')
        else
            this.progressElement.classList.remove('completed')
    }
    markCurrent(): void {
        this.progressElement.classList.remove('completed', 'skipped')
        this.progressElement.classList.add('current')
    }

    private createStepElement() {
        const stepElement = this.createElement('ms-step');
        stepElement.dataset.step = String(this.index + 1);
        this.containers.stepContainer.append(stepElement);
        return stepElement;
    }
    private createStepContentElement(): HTMLElement {
        const stepContentElement = this.createElement('ms-step-content');
        this.stepElement.append(stepContentElement);
        return stepContentElement;
    }

    private createProgressElement() {
        const progressElement = this.createElement('ms-progress');
        progressElement.dataset.step = String(this.index + 1);
        progressElement.append(this.createProgressStep());
        progressElement.append(this.createProgressLabel());
        this.containers.progressContainer.append(progressElement);
        return progressElement;
    }


    private createProgressStep(): HTMLElement {
        const statusElement = this.createElement('ms-progress-step');
        statusElement.append(this.createProgressStepStatus());
        statusElement.append(this.createProgressStepIndicator());
        return statusElement;
    }


    private createProgressStepStatus(): HTMLElement {
        const statusElement = this.createElement('ms-progress-step-status');
        return statusElement;
    }

    private createProgressStepIndicator(): HTMLElement {
        const statusElement = this.createElement('ms-progress-step-indicator');
        return statusElement;
    }

    private createProgressLabel(): HTMLElement {
        const statusElement = this.createElement('ms-progress-label');
        statusElement.innerText = `Step ${this.index + 1}`;
        return statusElement;
    }

    private createElement(className: string): HTMLElement {
        const element = document.createElement('div');
        element.classList.add(className);
        return element;
    }
}
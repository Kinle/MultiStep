import { Containers } from './MultiStep';
import '../scss/Step';
export interface Step {
    markCompleted(isCompleted: boolean): void;
    markCurrent(): void;
    setContent(content: HTMLElement): void;
}
export declare class DefaultStep implements Step {
    containers: Containers;
    stepElement: HTMLElement;
    progressElement: HTMLElement;
    stepContentElement: HTMLElement;
    index: number;
    constructor(containers: Containers, index: number);
    setContent(content: HTMLElement | string): void;
    markCompleted(isCompleted: boolean): void;
    markCurrent(): void;
    private createStepElement;
    private createStepContentElement;
    private createProgressElement;
    private createProgressStep;
    private createProgressStepStatus;
    private createProgressStepIndicator;
    private createProgressLabel;
    private createElement;
}

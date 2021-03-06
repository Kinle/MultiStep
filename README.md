# MultiStep
MultiStep is a multi-step wizard plugin 

# Installation
## For node projects
`npm i multistep.js`
 or 
`yarn add multistep.js`

## Using unpkg
https://unpkg.com/multistep.js@latest/dist/multistep.min.js


# Usage

```
const multiStep = MultiStep(targetElement, { multiStepOptions });
const step1 = multiStep.addStep();
step1.setContent(htmlContent);
``` 


# API
## static MultiStep.get(element: HTMLElement):
Static method that gets MultiStep object for already bound element

## MultiStep.addStep():
Add step in the wizard and returns the step object

## MultiStep.getStep(stepNumber: number):
Returns the step object of given step number

## MultiStep.updateOptions(newOptions: MultiStepOptions):
Updates the multiStep options

## MultiStep.reset:
Reset step progress

## Step.setContent:
Sets HTML content for a step object

## Step.getStepNumber:
Gets step number. Step number starts from 1.


# Options
## onComplete():
Callback to notify when steps are completed

## onNext(step: Step):
Callback to notify when next step is triggered. Provides step object as parameter

## onPrev(step: Step):
Callback to notify when previous step is triggered. Provides step object as parameter

## nextLabel:
Label for next button. Default is 'Next'

## prevLabel:
Label for previous button. Default is 'Previous'

## completeLabel:
Label for complete button. Default is 'Finish'
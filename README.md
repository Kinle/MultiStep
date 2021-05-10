# MultiStep
MultiStep is a multi-step wizard plugin 

# Getting started

## Installation

### For node projects
`npm i multistep.js`
 or 
`yarn add multistep.js`

### Using unpkg
https://unpkg.com/multistep.js@latest/MultiStep.min.js

## Usage

```
const multiStep = MultiStep(targetElement, { multiStepOptions });
const step1 = multiStep.addStep();
step1.setContent(htmlContent);
``` 

### API
#### MultiStep.addStep():
Add step in the wizard and returns the step object

#### MultiStep.getStep(stepNumber: number):
Returns the step object of given step number

#### MultiStep.updateOptions(newOptions: MultiStepOptions):
Updates the multiStep options

#### MultiStep.reset:
Reset step progress

#### Step.setContent:
Sets HTML content for a step object

### Options
#### onComplete:
Callback to notify when steps are completed
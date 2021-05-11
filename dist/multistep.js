(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("MultiStep", [], factory);
	else if(typeof exports === 'object')
		exports["MultiStep"] = factory();
	else
		root["MultiStep"] = factory();
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ scripts_MultiStep; }
});

;// CONCATENATED MODULE: ./src/scripts/Step.ts


var DefaultStep =
/** @class */
function () {
  function DefaultStep(containers, index) {
    this.containers = containers;
    this.index = index;
    this.stepElement = this.createStepElement();
    this.progressElement = this.createProgressElement();
    this.stepContentElement = this.createStepContentElement();
  }

  DefaultStep.prototype.setContent = function (content) {
    this.stepContentElement.innerHTML = '';
    if (content instanceof HTMLElement) this.stepContentElement.append(content);else this.stepContentElement.innerHTML = content;
  };

  DefaultStep.prototype.markCompleted = function (isCompleted) {
    this.progressElement.classList.remove('current', 'skipped');
    if (isCompleted) this.progressElement.classList.add('completed');else this.progressElement.classList.remove('completed');
  };

  DefaultStep.prototype.markCurrent = function () {
    this.progressElement.classList.remove('completed', 'skipped');
    this.progressElement.classList.add('current');
  };

  DefaultStep.prototype.createStepElement = function () {
    var stepElement = this.createElement('ms-step');
    stepElement.dataset.step = String(this.index + 1);
    this.containers.stepContainer.append(stepElement);
    return stepElement;
  };

  DefaultStep.prototype.createStepContentElement = function () {
    var stepContentElement = this.createElement('ms-step-content');
    this.stepElement.append(stepContentElement);
    return stepContentElement;
  };

  DefaultStep.prototype.createProgressElement = function () {
    var progressElement = this.createElement('ms-progress');
    progressElement.dataset.step = String(this.index + 1);
    progressElement.append(this.createProgressStep());
    progressElement.append(this.createProgressLabel());
    this.containers.progressContainer.append(progressElement);
    return progressElement;
  };

  DefaultStep.prototype.createProgressStep = function () {
    var statusElement = this.createElement('ms-progress-step');
    statusElement.append(this.createProgressStepStatus());
    statusElement.append(this.createProgressStepIndicator());
    return statusElement;
  };

  DefaultStep.prototype.createProgressStepStatus = function () {
    var statusElement = this.createElement('ms-progress-step-status');
    return statusElement;
  };

  DefaultStep.prototype.createProgressStepIndicator = function () {
    var statusElement = this.createElement('ms-progress-step-indicator');
    return statusElement;
  };

  DefaultStep.prototype.createProgressLabel = function () {
    var statusElement = this.createElement('ms-progress-label');
    statusElement.innerText = "Step " + (this.index + 1);
    return statusElement;
  };

  DefaultStep.prototype.createElement = function (className) {
    var element = document.createElement('div');
    element.classList.add(className);
    return element;
  };

  return DefaultStep;
}();


;// CONCATENATED MODULE: ./src/scripts/MultiStep.ts




var MULTISTEP_CLASS = {
  mainContainer: 'ms-container',
  progressContainer: 'ms-progress-container',
  stepContainer: 'ms-step-container',
  actionContainer: 'ms-action-container',
  stepButton: 'ms-button'
};
var IDS = {
  prevButton: 'ms-prev-button',
  nextButton: 'ms-next-button'
};
var ELEMENTS = {
  DIV: 'div',
  BUTTON: 'button'
};
var ATTRIBUTES = {
  disabled: 'disabled'
};
var initialisationErrorMessage = 'Cannot initialise Multistep for already initialised element. Use MultiStep.get(element) to access MultiStep for already initialised element';
var multiStepElementCache = new Map();

function uuidv4() {
  return (1e7.toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
    return (Number(c) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> Number(c) / 4).toString(16);
  });
}

function setProperty(target, source, key) {
  target[key] = source[key];
}

var MultiStepManager =
/** @class */
function () {
  function MultiStepManager(target, options) {
    this.defaultOptions = {
      onComplete: function onComplete() {},
      onNext: function onNext() {},
      onPrev: function onPrev() {},
      nextLabel: 'Next',
      prevLabel: 'Previous',
      completeLabel: 'Finish'
    };
    this.steps = [];
    this.currentStepIndex = 0;
    this.target = target;
    this.initialiseTarget();
    this.initialiseOption(options);
    this.containers = this.createContainers();
  }

  MultiStepManager.prototype.updateOptions = function (newOptions) {
    this.extendDefaults(newOptions);
    this.updateLabels();
  };

  MultiStepManager.prototype.updateLabels = function () {
    var nextButton = document.getElementById(IDS.nextButton);
    if (nextButton) nextButton.innerText = this.defaultOptions.nextLabel;
    var previousButton = document.getElementById(IDS.prevButton);
    if (previousButton) previousButton.innerText = this.defaultOptions.prevLabel;
  };

  MultiStepManager.prototype.addStep = function () {
    var step = new DefaultStep(this.containers, this.steps.length);
    this.steps.push(step);
    this.reset();
    return step;
  };

  MultiStepManager.prototype.getStep = function (step) {
    if (!this.isValidStep(step)) {
      return;
    }

    return this.steps[step - 1];
  };

  MultiStepManager.prototype.reset = function () {
    this.goToStep(0);
  };

  MultiStepManager.prototype.goToStep = function (step) {
    if (!this.isValidStep(step + 1)) {
      return;
    }

    this.scrollElement(step);
    this.updateProgress(this.currentStepIndex, step);
    this.setActionButtonAttributes(step);
    this.currentStepIndex = step;
  };

  MultiStepManager.prototype.setActionButtonAttributes = function (step) {
    var nextButton = document.getElementById(IDS.nextButton);
    var previousButton = document.getElementById(IDS.prevButton);

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
  };

  MultiStepManager.prototype.completed = function () {
    var _a, _b;

    this.steps[this.steps.length - 1].markCompleted(true);
    (_a = document.getElementById(IDS.nextButton)) === null || _a === void 0 ? void 0 : _a.setAttribute(ATTRIBUTES.disabled, ATTRIBUTES.disabled);
    (_b = document.getElementById(IDS.prevButton)) === null || _b === void 0 ? void 0 : _b.setAttribute(ATTRIBUTES.disabled, ATTRIBUTES.disabled);
    this.defaultOptions.onComplete();
  };

  MultiStepManager.prototype.updateProgress = function (current, target) {
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
  };

  MultiStepManager.prototype.isValidStep = function (step) {
    return step > 0 && step <= this.steps.length;
  };

  MultiStepManager.prototype.initialiseTarget = function () {
    this.setTargetId();
    multiStepElementCache.set(this.target, this);
  };

  MultiStepManager.prototype.setTargetId = function () {
    if (!this.target.id || this.target.id.length == 0) {
      this.target.id = uuidv4();
    }
  };

  MultiStepManager.prototype.initialiseOption = function (options) {
    if (options) {
      this.extendDefaults(options);
    }
  };

  MultiStepManager.prototype.extendDefaults = function (newOptions) {
    for (var optionKey in this.defaultOptions) {
      if (newOptions.hasOwnProperty(optionKey)) {
        setProperty(this.defaultOptions, newOptions, optionKey);
      }
    }

    return newOptions;
  };

  MultiStepManager.prototype.createContainers = function () {
    var mainContainer = this.createMainContainer();
    return {
      mainContainer: mainContainer,
      progressContainer: this.createProgressContainer(mainContainer),
      stepContainer: this.createStepContainer(mainContainer),
      actionContainer: this.createActionContainer(mainContainer)
    };
  };

  MultiStepManager.prototype.createMainContainer = function () {
    var mainContainer = document.createElement(ELEMENTS.DIV);
    mainContainer.classList.add(MULTISTEP_CLASS.mainContainer);
    this.target.append(mainContainer);
    return mainContainer;
  };

  MultiStepManager.prototype.createProgressContainer = function (mainContainer) {
    var progressContainer = document.createElement(ELEMENTS.DIV);
    progressContainer.classList.add(MULTISTEP_CLASS.progressContainer);
    mainContainer.append(progressContainer);
    return progressContainer;
  };

  MultiStepManager.prototype.createStepContainer = function (mainContainer) {
    var stepContainer = document.createElement(ELEMENTS.DIV);
    stepContainer.classList.add(MULTISTEP_CLASS.stepContainer);
    mainContainer.append(stepContainer);
    return stepContainer;
  };

  MultiStepManager.prototype.createActionContainer = function (mainContainer) {
    var actionContainer = document.createElement(ELEMENTS.DIV);
    actionContainer.classList.add(MULTISTEP_CLASS.actionContainer);
    this.createPreviousAction(actionContainer);
    this.createNextAction(actionContainer);
    mainContainer.append(actionContainer);
    return actionContainer;
  };

  MultiStepManager.prototype.createPreviousAction = function (actionContainer) {
    var previous = document.createElement(ELEMENTS.BUTTON);
    previous.classList.add(MULTISTEP_CLASS.stepButton);
    previous.id = IDS.prevButton;
    previous.innerText = this.defaultOptions.prevLabel;
    previous.onclick = this.goToPrevious.bind(this);
    actionContainer.append(previous);
  };

  MultiStepManager.prototype.createNextAction = function (actionContainer) {
    var next = document.createElement(ELEMENTS.BUTTON);
    next.classList.add(MULTISTEP_CLASS.stepButton);
    next.id = IDS.nextButton;
    next.innerText = this.defaultOptions.nextLabel;
    next.onclick = this.goToNext.bind(this);
    actionContainer.append(next);
  };

  MultiStepManager.prototype.goToNext = function () {
    this.goToStep(this.currentStepIndex + 1);
    this.defaultOptions.onNext(this.steps[this.currentStepIndex]);
  };

  MultiStepManager.prototype.goToPrevious = function () {
    this.goToStep(this.currentStepIndex - 1);
    this.defaultOptions.onPrev(this.steps[this.currentStepIndex]);
  };

  MultiStepManager.prototype.scrollElement = function (stepIndex) {
    this.containers.stepContainer.scrollLeft = this.containers.stepContainer.offsetWidth * stepIndex;
  };

  return MultiStepManager;
}();

var MultiStep = function MultiStep(target, options) {
  if (multiStepElementCache.has(target)) {
    throw new Error(initialisationErrorMessage);
  }

  return new MultiStepManager(target, options);
};

MultiStep.get = function (element) {
  return multiStepElementCache.get(element);
};

/* harmony default export */ var scripts_MultiStep = (MultiStep);
__webpack_exports__ = __webpack_exports__.default;
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=multistep.js.map
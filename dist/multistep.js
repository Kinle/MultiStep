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

;// CONCATENATED MODULE: ./src/scripts/Utils.ts
function uuidv4() {
  return (1e7.toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
    return (Number(c) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> Number(c) / 4).toString(16);
  });
}
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
  actionContainer: 'ms-action-container'
};
var DIV_ELEMENT = 'div';
var initialisationErrorMessage = 'Cannot initialise Multistep for already initialised element. Use MultiStep.get(element) to access MultiStep for already initialised element';
var multiStepElementCache = new Map();

var MultiStepManager =
/** @class */
function () {
  function MultiStepManager(target, options) {
    this.defaultOptions = {
      onComplete: function onComplete() {}
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
    var nextButton = document.getElementById('ms-next-button');
    var previousButton = document.getElementById('ms-prev-button');

    if (nextButton) {
      nextButton.removeAttribute('disabled');

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
      if (step == 0) previousButton.setAttribute('disabled', 'disabled');
    }
  };

  MultiStepManager.prototype.completed = function () {
    var _a, _b;

    this.steps[this.steps.length - 1].markCompleted(true);
    (_a = document.getElementById('ms-next-button')) === null || _a === void 0 ? void 0 : _a.setAttribute('disabled', 'disabled');
    (_b = document.getElementById('ms-prev-button')) === null || _b === void 0 ? void 0 : _b.setAttribute('disabled', 'disabled');
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
    for (var option in this.defaultOptions) {
      if (newOptions.hasOwnProperty(option)) {
        this.defaultOptions[option] = newOptions[option];
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
    var mainContainer = document.createElement(DIV_ELEMENT);
    mainContainer.classList.add(MULTISTEP_CLASS.mainContainer);
    this.target.append(mainContainer);
    return mainContainer;
  };

  MultiStepManager.prototype.createProgressContainer = function (mainContainer) {
    var progressContainer = document.createElement(DIV_ELEMENT);
    progressContainer.classList.add(MULTISTEP_CLASS.progressContainer);
    mainContainer.append(progressContainer);
    return progressContainer;
  };

  MultiStepManager.prototype.createStepContainer = function (mainContainer) {
    var stepContainer = document.createElement(DIV_ELEMENT);
    stepContainer.classList.add(MULTISTEP_CLASS.stepContainer);
    mainContainer.append(stepContainer);
    return stepContainer;
  };

  MultiStepManager.prototype.createActionContainer = function (mainContainer) {
    var actionContainer = document.createElement(DIV_ELEMENT);
    actionContainer.classList.add(MULTISTEP_CLASS.actionContainer);
    this.createPreviousAction(actionContainer);
    this.createNextAction(actionContainer);
    mainContainer.append(actionContainer);
    return actionContainer;
  };

  MultiStepManager.prototype.createPreviousAction = function (actionContainer) {
    var previous = document.createElement('button');
    previous.classList.add('ms-button');
    previous.id = 'ms-prev-button';
    previous.innerText = 'Previous';
    previous.onclick = this.goToPrevious.bind(this);
    actionContainer.append(previous);
  };

  MultiStepManager.prototype.createNextAction = function (actionContainer) {
    var next = document.createElement('button');
    next.classList.add('ms-button');
    next.id = 'ms-next-button';
    next.innerText = 'Next';
    next.onclick = this.goToNext.bind(this);
    actionContainer.append(next);
  };

  MultiStepManager.prototype.goToNext = function () {
    this.goToStep(this.currentStepIndex + 1);
  };

  MultiStepManager.prototype.goToPrevious = function () {
    this.goToStep(this.currentStepIndex - 1);
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
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 396:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 820:
/***/ ((module) => {

module.exports = eval("require")("@octokit/action");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(396);
const { Octokit } = __nccwpck_require__(820);
const octokit = new Octokit();

async function main() {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  const pullNumber = core.getInput('pull-number');
  const requestedStatus = core.getInput('status').split(",").map(v => v.trim());

  const { data } = await octokit.request(`GET /repos/${owner}/${repo}/pulls/${pullNumber}/reviews`);
  console.log('blah', requestedStatus)

  if(data.length === 0) {
    console.log("Could not find any reviews.");
    return null;
  }

  console.log(requestedStatus, v.state)

  const filtered_reviews = data.filter(v => requestedStatus.includes(v.state) && v.user.type !== "Bot");

  if(filtered_reviews.length === 0) {
    console.log("Could not find any reviews with requested status.");
    return null;
  }

  const last_review = filtered_reviews[filtered_reviews.length - 1];

  if(last_review.state !== requestedStatus) {
    console.log("Could not find reviews with requested status.");
    return null;
  }

  core.setOutput("sha", last_review.commit_id);
  core.setOutput("username", last_review.user.login);
  core.setOutput("date", last_review.submitted_at);
  console.log(`found review with requested status: ${last_review.commit_id}`);
}

main();

})();

module.exports = __webpack_exports__;
/******/ })()
;
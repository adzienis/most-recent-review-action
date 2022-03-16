const core = require('@actions/core');
const { Octokit } = require("@octokit/action");
const octokit = new Octokit();

async function main() {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  const pullNumber = core.getInput('pull-number');
  const requestedStatus = core.getInput('status').split(",").map(v => v.trim());

  const { data } = await octokit.request(`GET /repos/${owner}/${repo}/pulls/${pullNumber}/reviews`);

  console.log(requestedStatus, "asdasd ")
  console.log(data.map(v => requestedStatus.includes(v.state)))
  console.log(data.map(v => v.user.type))

  if(data.length === 0) {
    console.log("Could not find any reviews.");
    return null;
  }

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

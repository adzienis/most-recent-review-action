const { Octokit } = require("@octokit/action");
const core = require('@actions/core');
const github = require('@actions/github');

const octokit = new Octokit();
const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
const pullNumber = core.getInput('pull-number');
const requestedStatus = core.getInput('status');

// See https://developer.github.com/v3/issues/#create-an-issue
const { data } = await octokit.request("GET /repos/${owner}/${repo}/pulls/${pullNumber}/reviews`);

if(data.length === 0) return null;

const last_review = data[data.length - 1];

if(data.state !== requestedStatus) return null;

core.setOutput("sha", last_review.commit_id);

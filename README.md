# most-recent-review-action
GH Action to get the most recent review of a PR.

# Usage

```
name: Recent Review
on: pull_request

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: adzienis/most-recent-review-action@v1.01
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        status: APPROVED, DISMISSED
        pull-number: 101
```


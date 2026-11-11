// Commit messages follow Conventional Commits: https://www.conventionalcommits.org
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Dependabot and merge commits put long URLs in the body and footer.
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
};

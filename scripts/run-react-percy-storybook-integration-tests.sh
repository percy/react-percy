# If Percy is enabled, and there's a PERCY_TOKEN supplied (it's not on community PRs),
# take snapshots of the react-percy-storybook integration tests's stories.
if [[ "$PERCY_ENABLE" != "0" && -n "$PERCY_TOKEN" ]] ; then
  cd integration-tests/react-percy-storybook && yarn run storybook:percy
fi

export function tokenAutoRefreshExtension() {
  var refreshedAccessToken = null

  return {
    willResolveField(_source, _args, ctx) {
      if (ctx.refreshedAccessToken && !refreshedAccessToken) {
        refreshedAccessToken = ctx.refreshedAccessToken
      }
    },
    willSendResponse(res) {
      if (refreshedAccessToken) {
        if (!res.graphqlResponse.extensions) {
          res.graphqlResponse.extensions = {}
        }

        res.graphqlResponse.extensions.tokenAutoRefresh = {
          accessToken: refreshedAccessToken,
        }
      }

      return res
    },
  }
}

import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { beginTrace, endTrace } from "../services/firebase/perf";

/**
 * A hook that returns an auth-aware fetch function.
 * @desc The returned fetch function that matches the browser's fetch API
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 * It will provide the following functionality:
 *
 * 1. Add a `X-Shopify-Access-Token` header to the request.
 * 2. Check response for `X-Shopify-API-Request-Failure-Reauthorize` header.
 * 3. Redirect the user to the reauthorization URL if the header is present.
 *
 * @returns {Function} fetch function
 */
export function useAuthenticatedFetch(host) {
  const app = useAppBridge();
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const hasQueryParams = uri.includes("?");
    const uriWithHost = hasQueryParams
      ? `${uri}&host=${host}`
      : `${uri}?host=${host}`;
    const headers = new Headers(options.headers);
    headers.append('SourceApp', "icu-polaris");
    options.headers = headers;
    let response;
    const url = uriWithHost?.includes('http') ? uriWithHost : `https://web.incartupsell.com${uriWithHost}`;
    if(url.includes('https://web.incartupsell.com')) {
      const trace = beginTrace(new URL(url).pathname);
      response = await fetchFunction(uriWithHost, options);
      endTrace(trace);
    } else {
      response = await fetchFunction(uriWithHost, options);
    }
    checkHeadersForReauthorization(response.headers, app);
    return response;
  };
}

function checkHeadersForReauthorization(headers, app) {
  if (headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1") {
    const authUrlHeader =
      headers.get("X-Shopify-API-Request-Failure-Reauthorize-Url") ||
      `/api/auth`;

    const redirect = Redirect.create(app);
    redirect.dispatch(
      Redirect.Action.REMOTE,
      authUrlHeader.startsWith("/")
        ? `https://${window.location.host}${authUrlHeader}`
        : authUrlHeader
    );
  }
}

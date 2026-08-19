/* Payload's REST API. The Vite site reads from here at build time. */
import config from "@payload-config";
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from "@payloadcms/next/routes";

// Uploads run through here: with clientUploads on, the server pulls the original back from
// R2 and runs sharp over it, which is the slowest thing this API does. 60s is the Hobby cap.
export const maxDuration = 60;

export const GET = REST_GET(config);
export const POST = REST_POST(config);
export const DELETE = REST_DELETE(config);
export const PATCH = REST_PATCH(config);
export const PUT = REST_PUT(config);
export const OPTIONS = REST_OPTIONS(config);

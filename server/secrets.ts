export const keycloak = {
  client_id: "webapp",
  client_secret: "ttSySTcpXke2y4AXPfiUahp3vE4X2vMB", // TODO
  redirect_uris: ["http://127.0.0.1:8082/api/login-callback"],
  post_logout_redirect_uris: [""],
  response_types: ["code"],
}

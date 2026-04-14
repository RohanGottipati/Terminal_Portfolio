const COMMAND_PARAM = "cmd";

function buildUrlWithCommand(command: string | null) {
  const url = new URL(window.location.href);

  if (command) {
    url.searchParams.set(COMMAND_PARAM, command);
  } else {
    url.searchParams.delete(COMMAND_PARAM);
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

export function getCommandFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(COMMAND_PARAM);
  return value?.trim() || null;
}

export function pushCommandToUrl(command: string | null) {
  window.history.pushState({}, "", buildUrlWithCommand(command));
}

export function replaceCommandInUrl(command: string | null) {
  window.history.replaceState({}, "", buildUrlWithCommand(command));
}

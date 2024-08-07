type AppKey = `app_${string}`;

export const isAppKey = (key: string): key is AppKey => {
  return key.startsWith("app_");
};

// For WorldID
export const WORLD_APP_ID = process.env.REACT_APP_WORLD_APP_ID ?? "";

export const WORLD_APP_ACTION_ID =
  process.env.REACT_APP_WORLD_APP_ACTION_ID ?? "";

export const WORLD_VERIFIER_ADDRESS =
  process.env.REACT_APP_WORLD_VERIFIER_ADDRESS ?? "";


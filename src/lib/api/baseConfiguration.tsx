import config from "../config";
import { getJwtFromCookie } from "../util/cookies";
import {
  Configuration,
} from "./base";

const baseConfig = () => {
  const baseConfig = new Configuration();
  baseConfig.basePath = config.apiUrl;

  const jwt = getJwtFromCookie();
  if (jwt) {
    baseConfig.accessToken = jwt;
  }
  return baseConfig;
};

const nimaConfig = () => {
  const nimaConfig = new Configuration();
  nimaConfig.basePath = config.nimaAPIUrl;

  const jwt = getJwtFromCookie();
  if (jwt) {
    nimaConfig.accessToken = jwt;
  }
  return nimaConfig;
};

export { baseConfig, nimaConfig };

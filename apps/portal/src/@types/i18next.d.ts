import "i18next";
import auth from "../locales/en/auth.json";
import clubDashboard from "../locales/en/clubDashboard.json";
import clubEvent from "../locales/en/clubEvent.json";
import common from "../locales/en/common.json";
import errors from "../locales/en/errors.json";
import events from "../locales/en/events.json";
import job from "../locales/en/job.json";
import settings from "../locales/en/settings.json";
import sports from "../locales/en/sports.json";
import teams from "../locales/en/teams.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      auth: typeof auth;
      clubDashboard: typeof clubDashboard;
      clubEvent: typeof clubEvent;
      common: typeof common;
      errors: typeof errors;
      events: typeof events;
      job: typeof job;
      settings: typeof settings;
      sports: typeof sports;
      teams: typeof teams;
    };
  }
}

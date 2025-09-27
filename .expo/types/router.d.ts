/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/components/Auth/Auth`; params?: Router.UnknownInputParams; } | { pathname: `/components/Auth/SignIn`; params?: Router.UnknownInputParams; } | { pathname: `/components/Auth/SignUp`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/components/Auth/Auth`; params?: Router.UnknownOutputParams; } | { pathname: `/components/Auth/SignIn`; params?: Router.UnknownOutputParams; } | { pathname: `/components/Auth/SignUp`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/components/Auth/Auth${`?${string}` | `#${string}` | ''}` | `/components/Auth/SignIn${`?${string}` | `#${string}` | ''}` | `/components/Auth/SignUp${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/components/Auth/Auth`; params?: Router.UnknownInputParams; } | { pathname: `/components/Auth/SignIn`; params?: Router.UnknownInputParams; } | { pathname: `/components/Auth/SignUp`; params?: Router.UnknownInputParams; };
    }
  }
}

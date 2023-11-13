import React from 'react';

import { IntlProvider } from 'react-intl';
import { Router, Route, Redirect } from 'react-router-dom';
import { messages, AppLanguage, supportedLanguages } from '../intl';
import { routesEnum } from '../Routes';

interface Props {
  history: any;
}

type Match = {
  path: string,
  url: string,
  isExact: boolean,
  params: {
    lang: AppLanguage
  }
}

type Location = {
  pathname: string,
  search: string,
  hash: string,
  key: string
}

interface RouteType {
  match: Match;
  location: Location
}

export const LocalizedRouter: React.FC<Props> = ({ children, history }) => (
  <Router history={history}>
    <Route path="/:lang([a-z-]{2,5})">
      {({ match, location }: RouteType) => {
        /**
         * Get current language
         * Set default locale to en if base path is used without a language
         */
        const params = match ? match.params : {};
        const { lang = AppLanguage.English } = params as Match['params'];

        /**
         * If language provided is not supported, redirect to "languages" page
         */
        if (supportedLanguages.indexOf(lang) < 0) {
          return <Redirect push to={routesEnum.languagesPage} />;
        }

        /**
         * If language is not in route path, redirect to language route
         */
        const { pathname } = location;
        if (!pathname.includes(`/${lang}/`) && pathname !== `/${lang}`) {
          return <Redirect to={`/${lang}${pathname}`} />;
        }

        /**
         * Return Intl provider with default language set
         */
        return (
          <IntlProvider locale={lang} messages={messages[lang]}>
            {children}
          </IntlProvider>
        );
      }}
    </Route>
  </Router>
);

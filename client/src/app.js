export class App {
  configureRouter(config, router) {

    config.title = 'Aurelia';
    config.map([
      // { route: ['', 'checkout'], name: 'components/checkout/checkout',      moduleId: 'components/checkout/checkout',      nav: false, title: 'Home' },
      { route: ['checkout', 'checkout'], name: 'components/checkout/checkout',      moduleId: 'components/checkout/checkout',      nav: true, title: 'Home' },
      { route: ['admin', 'admin'], name: 'components/admin/admin',      moduleId: 'components/admin/admin',      nav: true, title: 'Manage' },
      //{ route: ['login', 'login'], name: 'components/login/login',      moduleId: 'components/login/login',      nav: false },
      { route: ['loginSSO', 'loginSSO'], name: 'components/login/loginSSO',      moduleId: 'components/login/loginSSO',      nav: false }
    ]);

    config.mapUnknownRoutes('not-found');

    this.router = router;
  }
}
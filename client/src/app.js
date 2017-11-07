export class App {
  configureRouter(config, router) {

    config.title = 'Aurelia';
    config.map([
      { route: ['', 'checkout'], name: 'components/checkout/checkout',      moduleId: 'components/checkout/checkout',      nav: false, title: 'Home' },
      { route: ['checkout', 'checkout'], name: 'components/checkout/checkout',      moduleId: 'components/checkout/checkout',      nav: true, title: 'Home' },
      { route: ['admin', 'admin'], name: 'components/admin/admin',      moduleId: 'components/admin/admin',      nav: true, title: 'Manage' }
    ]);

    this.router = router;
  }
}
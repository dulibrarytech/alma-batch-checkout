export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'welcome'], name: 'components/welcome/welcome',      moduleId: 'components/welcome/welcome',      nav: true, title: 'Welcome' },
      { route: ['checkout', 'checkout'], name: 'components/checkout/checkout',      moduleId: 'components/checkout/checkout',      nav: true, title: 'Checkout' }
    ]);

    this.router = router;
  }
}
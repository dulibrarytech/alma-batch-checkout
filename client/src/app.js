export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'welcome'], name: 'components/welcome/welcome',      moduleId: 'components/welcome/welcome',      nav: true, title: 'Welcome' }
    ]);

    this.router = router;
  }
}
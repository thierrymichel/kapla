export class Manager {
  constructor(application) {
    this.application = application;
  }

  start() {
    console.info('Manager:start');
  }

  stop() {
    console.info('Manager:stop');
  }

  addDefinition(definition) {
    console.info('Manager:addDefinition');
  }

  removeSlug(slug) {

  }
}

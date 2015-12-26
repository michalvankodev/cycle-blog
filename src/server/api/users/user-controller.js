export function* getUser(next) {
  this.body = this.params.id;
}

export function NodeEntity(name?: string): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return function (target) {
    const _className = name ?? target.name;

    Reflect.defineMetadata('4jNodeName', _className, target.prototype);
  };
}

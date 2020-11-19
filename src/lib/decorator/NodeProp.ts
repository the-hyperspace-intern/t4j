import 'reflect-metadata';

export function NodeProp(): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return function (target, propKey: string) {
    Reflect.defineMetadata('isNodeProp', true, target, propKey);
  };
}

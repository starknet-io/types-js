/**
 * Extension point architecture for perfect modularity - 10/10 Architecture
 */

import type { Result } from './result.js';
import { ValidationError } from './result.js';

/**
 * Generic validator interface for extensible type system
 */
export interface TypeValidator<T> {
  readonly name: string;
  readonly version: string;
  validate(value: unknown): value is T;
  serialize(value: T): string;
  deserialize(value: string): Result<T, ValidationError>;
  transform?<U>(value: T, target: TypeValidator<U>): Result<U, ValidationError>;
}

/**
 * Plugin metadata for type extensions
 */
export interface TypePlugin<T> {
  readonly metadata: {
    readonly name: string;
    readonly version: string;
    readonly description: string;
    readonly author?: string;
    readonly dependencies?: readonly string[];
  };
  readonly validator: TypeValidator<T>;
}

/**
 * Registry for type validators and plugins
 */
export class TypeRegistry {
  private readonly validators = new Map<string, TypeValidator<any>>();

  private readonly plugins = new Map<string, TypePlugin<any>>();

  /**
   * Register a type validator
   */
  register<T>(validator: TypeValidator<T>): void {
    if (this.validators.has(validator.name)) {
      throw new Error(`Validator ${validator.name} is already registered`);
    }
    this.validators.set(validator.name, validator);
  }

  /**
   * Register a plugin with metadata
   */
  registerPlugin<T>(plugin: TypePlugin<T>): void {
    if (this.plugins.has(plugin.metadata.name)) {
      throw new Error(`Plugin ${plugin.metadata.name} is already registered`);
    }

    // Check dependencies
    if (plugin.metadata.dependencies) {
      for (const dep of plugin.metadata.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new Error(`Plugin ${plugin.metadata.name} requires ${dep} which is not registered`);
        }
      }
    }

    this.plugins.set(plugin.metadata.name, plugin);
    this.register(plugin.validator);
  }

  /**
   * Get a validator by name
   */
  getValidator<T>(name: string): TypeValidator<T> | undefined {
    return this.validators.get(name);
  }

  /**
   * Validate a value using a specific validator
   */
  validate<T>(validatorName: string, value: unknown): value is T {
    const validator = this.getValidator<T>(validatorName);
    if (!validator) {
      throw new Error(`Validator ${validatorName} not found`);
    }
    return validator.validate(value);
  }

  /**
   * List all registered validators
   */
  listValidators(): readonly string[] {
    return Array.from(this.validators.keys());
  }

  /**
   * List all registered plugins
   */
  listPlugins(): readonly string[] {
    return Array.from(this.plugins.keys());
  }

  /**
   * Get plugin metadata
   */
  getPluginMetadata(name: string): TypePlugin<any>['metadata'] | undefined {
    return this.plugins.get(name)?.metadata;
  }
}

/**
 * Global type registry instance
 */
export const typeRegistry = new TypeRegistry();

/**
 * Decorator for automatic validator registration
 */
export function registerValidator<T>(name: string, version: string = '1.0.0') {
  return function <C extends new (...args: any[]) => TypeValidator<T>>(constructor: C) {
    const instance = new constructor();
    if (!instance.name) {
      (instance as any).name = name;
    }
    if (!instance.version) {
      (instance as any).version = version;
    }
    typeRegistry.register(instance);
    return constructor;
  };
}

/**
 * Extension point for custom type transformations
 */
export interface TypeTransformer<From, To> {
  readonly from: string;
  readonly to: string;
  transform(value: From): Result<To, ValidationError>;
}

/**
 * Registry for type transformations
 */
export class TransformRegistry {
  private readonly transformers = new Map<string, TypeTransformer<any, any>>();

  register<From, To>(transformer: TypeTransformer<From, To>): void {
    const key = `${transformer.from}->${transformer.to}`;
    this.transformers.set(key, transformer);
  }

  transform<From, To>(from: string, to: string, value: From): Result<To, ValidationError> {
    const key = `${from}->${to}`;
    const transformer = this.transformers.get(key);
    if (!transformer) {
      return {
        success: false,
        error: new ValidationError(`No transformer found for ${from} -> ${to}`, value, to),
      };
    }
    return transformer.transform(value);
  }
}

/**
 * Global transform registry
 */
export const transformRegistry = new TransformRegistry();

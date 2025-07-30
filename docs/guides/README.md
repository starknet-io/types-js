# 📚 Developer Guides

Comprehensive guides for optimal usage of `@starknet-io/types-js` with focus on performance and bundle size optimization.

## 📖 Available Guides

### **[Performance Guide](./PERFORMANCE_GUIDE.md)** ⚡
Learn how to achieve minimal bundle size and maximum tree-shaking efficiency:
- Bundle size impact analysis
- Optimal import strategies  
- Performance best practices
- Real-world examples with bundle measurements

### **[Tree-Shaking Guide](./TREE_SHAKING_GUIDE.md)** 🌳
Master advanced tree-shaking techniques for perfect optimization:
- Bundler-specific configurations
- Build analysis tools
- Advanced tree-shaking techniques
- Conditional loading patterns

### **[Usage Guide](./USAGE_GUIDE.md)** 🚀
Complete usage reference with comprehensive examples:
- Core concepts and branded types
- Runtime validation patterns
- Framework integration examples
- Common usage patterns and best practices

## 🎯 Quick Reference

### **For Minimal Bundle Size:**
1. Use type-only imports when possible
2. Import functions by name, never star imports
3. Consider conditional loading for development-only validation
4. Monitor bundle size with analysis tools

### **For Maximum Type Safety:**
1. Leverage branded types for compile-time safety
2. Use runtime validation only when necessary
3. Implement proper error handling patterns
4. Follow TypeScript strict mode practices

### **For Best Developer Experience:**
1. Configure your bundler for optimal tree-shaking
2. Use meaningful type annotations
3. Implement proper validation patterns
4. Monitor performance impact regularly

## 📊 Expected Performance

Following these guides should achieve:
- **Type imports**: 0 bytes bundle impact
- **Light validation**: < 200 bytes total
- **Full validation suite**: < 1KB total
- **99%+ tree-shaking efficiency**

## 🔗 Related Documentation

- **[API Reference](../api/)** - Generated TypeDoc documentation
- **[Migration Guide](../MIGRATION.md)** - Upgrading from previous versions
- **[Developer README](../README_DEVELOPER_FOCUSED.md)** - Performance-focused overview
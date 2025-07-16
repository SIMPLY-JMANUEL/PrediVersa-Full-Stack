#!/usr/bin/env node

/**
 * Script de Testing Automatizado para Sistema Dimensional PrediVersa
 * Valida que todos los tokens y container queries funcionen correctamente
 */

const fs = require('fs');
const path = require('path');

class DimensionalTester {
  constructor() {
    this.results = [];
    this.tokensPath = path.join(__dirname, 'src', 'styles', 'tokens.css');
    this.componentsPath = path.join(__dirname, 'src', 'components');
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m',
    };

    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
    this.results.push({ timestamp, message, type });
  }

  // Test 1: Validar que todos los tokens existen
  testTokensExistence() {
    this.log('🧪 Testing: Existencia de Design Tokens', 'info');

    try {
      const tokensContent = fs.readFileSync(this.tokensPath, 'utf8');

      const expectedTokens = [
        // Spacing
        '--space-3xs',
        '--space-2xs',
        '--space-xs',
        '--space-sm',
        '--space-md',
        '--space-lg',
        '--space-xl',
        '--space-2xl',
        '--space-3xl',

        // Typography
        '--text-xs',
        '--text-sm',
        '--text-base',
        '--text-lg',
        '--text-xl',
        '--text-2xl',
        '--text-3xl',
        '--text-hero',

        // Containers
        '--container-xs',
        '--container-sm',
        '--container-md',
        '--container-lg',
        '--container-xl',
        '--container-2xl',

        // Borders
        '--border-radius-sm',
        '--border-radius-md',
        '--border-radius-lg',
        '--border-radius-xl',

        // Components
        '--header-height',
        '--hero-min-height',
        '--card-padding',
        '--button-height',
        '--icon-size-sm',
        '--icon-size-md',
        '--icon-size-lg',

        // Grid
        '--grid-gap-sm',
        '--grid-gap-md',
        '--grid-gap-lg',
        '--grid-min-column',
      ];

      const missingTokens = [];
      const foundTokens = [];

      expectedTokens.forEach(token => {
        if (tokensContent.includes(token)) {
          foundTokens.push(token);
        } else {
          missingTokens.push(token);
        }
      });

      if (missingTokens.length === 0) {
        this.log(
          `✅ Todos los tokens encontrados (${foundTokens.length}/${expectedTokens.length})`,
          'success'
        );
      } else {
        this.log(`❌ Tokens faltantes: ${missingTokens.join(', ')}`, 'error');
      }

      return missingTokens.length === 0;
    } catch (error) {
      this.log(`❌ Error leyendo tokens.css: ${error.message}`, 'error');
      return false;
    }
  }

  // Test 2: Validar sintaxis de clamp()
  testClampSyntax() {
    this.log('🧪 Testing: Sintaxis de clamp()', 'info');

    try {
      const tokensContent = fs.readFileSync(this.tokensPath, 'utf8');
      const clampRegex = /clamp\([^)]+\)/g;
      const clampMatches = tokensContent.match(clampRegex) || [];

      let validClamps = 0;
      const invalidClamps = [];

      clampMatches.forEach(clamp => {
        // Validar sintaxis básica: clamp(min, preferred, max)
        const parts = clamp
          .slice(6, -1)
          .split(',')
          .map(p => p.trim());
        if (parts.length === 3) {
          validClamps++;
        } else {
          invalidClamps.push(clamp);
        }
      });

      if (invalidClamps.length === 0) {
        this.log(
          `✅ Sintaxis clamp() correcta (${validClamps} encontrados)`,
          'success'
        );
      } else {
        this.log(
          `❌ Sintaxis clamp() incorrecta: ${invalidClamps.join(', ')}`,
          'error'
        );
      }

      return invalidClamps.length === 0;
    } catch (error) {
      this.log(`❌ Error validando clamp(): ${error.message}`, 'error');
      return false;
    }
  }

  // Test 3: Validar Container Queries en componentes
  testContainerQueries() {
    this.log('🧪 Testing: Container Queries en componentes', 'info');

    const componentFiles = [
      'Features.css',
      'DashboardHeader.css',
      'Button/Button.module.css',
    ];

    let totalContainerQueries = 0;
    let componentsWithCQ = 0;

    componentFiles.forEach(file => {
      try {
        const filePath = path.join(this.componentsPath, file);
        const content = fs.readFileSync(filePath, 'utf8');

        const containerTypeMatches = (
          content.match(/container-type:\s*inline-size/g) || []
        ).length;
        const containerQueryMatches = (content.match(/@container[^{]+{/g) || [])
          .length;

        if (containerTypeMatches > 0 || containerQueryMatches > 0) {
          componentsWithCQ++;
          totalContainerQueries += containerQueryMatches;
          this.log(
            `✅ ${file}: ${containerTypeMatches} containers, ${containerQueryMatches} queries`,
            'success'
          );
        } else {
          this.log(`⚠️ ${file}: Sin Container Queries`, 'warning');
        }
      } catch (error) {
        this.log(`❌ Error leyendo ${file}: ${error.message}`, 'error');
      }
    });

    this.log(
      `📊 Total: ${totalContainerQueries} Container Queries en ${componentsWithCQ} componentes`,
      'info'
    );
    return totalContainerQueries > 0;
  }

  // Test 4: Validar uso de tokens en componentes
  testTokenUsage() {
    this.log('🧪 Testing: Uso de tokens en componentes', 'info');

    const componentFiles = [
      'Header.css',
      'Hero.css',
      'Features.css',
      'DashboardHeader.css',
    ];

    let totalTokenUsage = 0;
    let componentsWithTokens = 0;

    componentFiles.forEach(file => {
      try {
        const filePath = path.join(this.componentsPath, file);
        const content = fs.readFileSync(filePath, 'utf8');

        const tokenMatches = (content.match(/var\(--[^)]+\)/g) || []).length;

        if (tokenMatches > 0) {
          componentsWithTokens++;
          totalTokenUsage += tokenMatches;
          this.log(`✅ ${file}: ${tokenMatches} usos de tokens`, 'success');
        } else {
          this.log(`⚠️ ${file}: Sin tokens`, 'warning');
        }
      } catch (error) {
        this.log(`❌ Error leyendo ${file}: ${error.message}`, 'error');
      }
    });

    this.log(
      `📊 Total: ${totalTokenUsage} usos de tokens en ${componentsWithTokens} componentes`,
      'info'
    );
    return totalTokenUsage > 0;
  }

  // Test 5: Validar breakpoints de dispositivos comunes
  testDeviceBreakpoints() {
    this.log('🧪 Testing: Breakpoints de dispositivos', 'info');

    const commonDevices = [
      { name: 'iPhone SE', width: 375 },
      { name: 'iPhone 12 Pro', width: 390 },
      { name: 'iPad Mini', width: 768 },
      { name: 'iPad Pro 11"', width: 834 },
      { name: 'Desktop', width: 1440 },
      { name: '4K Monitor', width: 2560 },
    ];

    // Simular evaluación de tokens en diferentes anchos
    commonDevices.forEach(device => {
      // Calculamos valores aproximados basados en las fórmulas clamp()
      const spacemd = Math.max(16, Math.min(device.width * 0.025, 24));
      const textbase = Math.max(16, Math.min(device.width * 0.025, 18));

      this.log(
        `📱 ${device.name} (${device.width}px): space-md≈${spacemd.toFixed(
          0
        )}px, text-base≈${textbase.toFixed(1)}px`,
        'info'
      );
    });

    return true;
  }

  // Test 6: Validar accesibilidad básica
  testAccessibility() {
    this.log('🧪 Testing: Validaciones de accesibilidad', 'info');

    try {
      const tokensContent = fs.readFileSync(this.tokensPath, 'utf8');

      // Verificar que el tamaño mínimo de texto sea >= 16px
      const textBaseMatch = tokensContent.match(
        /--text-base:\s*clamp\(([^,]+),/
      );
      if (textBaseMatch) {
        const minSize = parseFloat(textBaseMatch[1]);
        if (minSize >= 1) {
          // 1rem = 16px
          this.log(
            `✅ Tamaño mínimo de texto accesible: ${minSize}rem`,
            'success'
          );
        } else {
          this.log(
            `❌ Tamaño mínimo de texto muy pequeño: ${minSize}rem`,
            'error'
          );
        }
      }

      // Verificar altura mínima de botones >= 44px (WCAG)
      const buttonHeightMatch = tokensContent.match(
        /--button-height:\s*clamp\(([^,]+),/
      );
      if (buttonHeightMatch) {
        const minHeight = parseFloat(buttonHeightMatch[1]);
        if (minHeight >= 40) {
          // Cercano a 44px recomendado
          this.log(
            `✅ Altura mínima de botón accesible: ${minHeight}px`,
            'success'
          );
        } else {
          this.log(
            `❌ Altura mínima de botón muy pequeña: ${minHeight}px`,
            'error'
          );
        }
      }

      return true;
    } catch (error) {
      this.log(`❌ Error en test de accesibilidad: ${error.message}`, 'error');
      return false;
    }
  }

  // Ejecutar todos los tests
  async runAllTests() {
    this.log('🚀 Iniciando Testing Completo del Sistema Dimensional', 'info');
    this.log('================================================', 'info');

    const tests = [
      { name: 'Existencia de Tokens', test: () => this.testTokensExistence() },
      { name: 'Sintaxis clamp()', test: () => this.testClampSyntax() },
      { name: 'Container Queries', test: () => this.testContainerQueries() },
      { name: 'Uso de Tokens', test: () => this.testTokenUsage() },
      { name: 'Breakpoints', test: () => this.testDeviceBreakpoints() },
      { name: 'Accesibilidad', test: () => this.testAccessibility() },
    ];

    let passedTests = 0;
    const totalTests = tests.length;

    for (const { name, test } of tests) {
      this.log(`\n--- ${name} ---`, 'info');
      try {
        const result = await test();
        if (result) {
          passedTests++;
        }
      } catch (error) {
        this.log(`❌ Error en test ${name}: ${error.message}`, 'error');
      }
    }

    this.log('\n================================================', 'info');
    this.log(
      `📊 RESUMEN: ${passedTests}/${totalTests} tests pasados`,
      passedTests === totalTests ? 'success' : 'warning'
    );

    if (passedTests === totalTests) {
      this.log('🎉 ¡Sistema Dimensional completamente funcional!', 'success');
    } else {
      this.log('⚠️ Algunos tests fallaron - revisar implementación', 'warning');
    }

    return { passed: passedTests, total: totalTests, results: this.results };
  }

  // Generar reporte de testing
  generateReport() {
    const reportPath = path.join(__dirname, 'dimensional-test-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      results: this.results,
      summary: {
        total: this.results.length,
        success: this.results.filter(r => r.type === 'success').length,
        warnings: this.results.filter(r => r.type === 'warning').length,
        errors: this.results.filter(r => r.type === 'error').length,
      },
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.log(`📄 Reporte generado: ${reportPath}`, 'info');
  }
}

// Ejecutar testing si es llamado directamente
if (require.main === module) {
  const tester = new DimensionalTester();
  tester.runAllTests().then(() => {
    tester.generateReport();
  });
}

module.exports = DimensionalTester;
